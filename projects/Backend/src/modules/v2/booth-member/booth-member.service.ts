import type Booth from "@/db/models/booth";
import BoothMember from "@/db/models/booth-member";
import Goods from "@/db/models/goods";
import { create as commonCreate, findAll as commonFindAll, findOneByPk, jsonContains, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import type { ISuccessResponse } from "@myboothmanager/common";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CacheMap } from "../../../lib/types";
import { BoothService } from "../booth/booth.service";
import { BoothMemberParentBoothNotFoundException } from "./booth-member.exception";
import type { CreateBoothMemberRequestDto } from "./dto/create.dto";
import { BoothMemberImageService } from "./booth-member.image.service";
import type { UpdateBoothMemberRequestDto } from "./dto/update.dto";

@Injectable()
export class BoothMemberService {
  constructor(
    @Inject(forwardRef(() => BoothMemberImageService))
    private readonly image: BoothMemberImageService,
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
  ) { }

  private readonly memberBoothCache = new MemberBoothCache();

  /**
   * Gets the booth member entity and parent booth entity, and checks if the booth member belongs to the booth.
   * @param memberId ID of the booth member
   * @param boothId ID of the booth
   * @param accountId ID of the account which owns the booth. If omitted, the parent booth is not checked and `booth` becomes `undefined`.
   * @returns `BoothMember` entity
   * @throws `NoAccessException` if the booth member does not belong to the booth or the booth does not belong to the account
   * @throws `EntityNotFoundException` if the booth member with the ID does not exist
   */
  async getBoothMemberAndParentBooth(memberId: number, boothId: number, accountId?: number): Promise<{ member: BoothMember, booth?: Booth }> {
    if(!await this.memberBoothCache.testValue(memberId, boothId)) {
      throw new NoAccessException();
    }

    let booth: Booth | undefined;
    if(typeof accountId === "number") {
      try {
        booth = await this.booth.findOne(boothId, false, accountId);
      } catch(err) {
        if(err instanceof EntityNotFoundException) {
          // Change the error instance
          throw new BoothMemberParentBoothNotFoundException();
        }

        throw err;
      }
    }

    return {
      booth,
      member: await findOneByPk(BoothMember, memberId),
    };
  }

  async isMemberBelongsToBooth(memberId: number, boothId: number): Promise<boolean> {
    return await this.memberBoothCache.testValue(memberId, boothId);
  }

  /**
   * Finds a booth member entity by ID.
   * @param id ID of the booth member
   * @param boothId ID of the booth which the member belongs to
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Found `BoothMember` entity
   * @throws `BoothMemberNotFoundException` if the booth member with the ID does not exist
   */
  async findOne(id: number, boothId: number, force = false, accountId?: number): Promise<BoothMember> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return (await this.getBoothMemberAndParentBooth(id, boothId, accountId)).member;
  }

  /**
   * Finds all booth members beloging to the booth.
   * @param boothId ID of the booth
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Array of found `BoothMember` entities
   */
  async findAll(boothId: number, force = false, accountId?: number): Promise<BoothMember[]> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return await commonFindAll(BoothMember, { boothId });
  }

  /**
   * Creates a new booth member entity.
   * @param createDto DTO for creating a booth member
   * @param accountId ID of the account
   * @returns Newly created `BoothMember` entity
   */
  async create(createDto: CreateBoothMemberRequestDto, accountId: number): Promise<BoothMember> {
    // Check if the booth belongs to the account
    if(!(await this.booth.findOne(createDto.boothId, false, accountId))) {
      throw new BoothMemberParentBoothNotFoundException();
    }

    // Create
    return await commonCreate(BoothMember, createDto);
  }

  /**
   * Updates information of a booth member.
   * @param id ID of the goods
   * @param updateDto DTO for updating a booth member information
   * @param accountId ID of the account
   * @returns Updated `BoothMember` entity
   */
  async update(id: number, updateDto: UpdateBoothMemberRequestDto, accountId: number): Promise<BoothMember> {
    const { member } = await this.getBoothMemberAndParentBooth(id, updateDto.boothId, accountId);
    return await (await member.update({ ...updateDto })).save();
  }

  /**
   * Removes a booth member entity. Also removes associated with the member.
   * @param id ID of the booth member
   * @param boothId ID of the booth
   * @param accountId ID of the account
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const { member } = await this.getBoothMemberAndParentBooth(id, boothId, accountId);

    // Delete all images of the member
    await this.image.deleteAllImages(id, boothId, accountId);

    // Remove the member from the goods
    const goodsOwned = await Goods.findAll({
      where: jsonContains<Goods>("ownerMemberIds", id.toString()),
    });
    for(const goods of goodsOwned) {
      await goods.update({
        ownerMemberIds: goods.ownerMemberIds!.filter((memberId: number) => memberId !== id),
      });
    }

    // Remove the entity
    return await removeTarget(member);
  }
}

class MemberBoothCache extends CacheMap<number, number> {
  override async fetch(key: number): Promise<number> {
    const member = await findOneByPk(BoothMember, key);

    if(typeof member.boothId !== "number") throw new NoAccessException();

    return member.boothId;
  }
}
