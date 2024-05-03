import { Injectable } from "@nestjs/common";
import { ISuccessResponse, ImageSizeConstraintKey, IImageUploadInfo } from "@myboothmanager/common";
import { MultipartFile } from "@fastify/multipart";
import { create, jsonContains, removeTarget } from "@/lib/common-functions";
import Booth from "@/db/models/booth";
import { NoAccessException } from "@/lib/exceptions";
import BoothMember from "@/db/models/booth-member";
import { PublicBoothMemberService } from "@/modules/public/booth-member/booth-member.service";
import Goods from "@/db/models/goods";
import { UtilService } from "../util/util.service";
import { UpdateBoothMemberRequestDto } from "./dto/update-booth-member.dto";
import { CreateBoothMemberRequestDto } from "./dto/create-booth-member.dto";
import { BoothMemberInfoUpdateFailedException, BoothMemberParentBoothNotFoundException } from "./booth-member.exception";

@Injectable()
export class BoothMemberService {
  constructor(
    private readonly publicBoothMemberService: PublicBoothMemberService,
    private readonly utilService: UtilService,
  ) { }

  async getBoothMemberAndParentBooth(memberId: number, boothId: number, callerAccountId: number): Promise<{ booth: Booth, member: BoothMember }> {
    const member = await this.publicBoothMemberService.findOne(boothId, memberId);

    if(member.boothId !== boothId) throw new NoAccessException();

    const booth = await Booth.findOne({ where: { id: boothId, ownerId: callerAccountId } });
    if(!booth) throw new BoothMemberParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { booth, member };
  }

  async findBoothMemberBelongsToBooth(memberId: number, boothId: number, callerAccountId: number): Promise<BoothMember> {
    const { member } = await this.getBoothMemberAndParentBooth(memberId, boothId, callerAccountId);
    return member;
  }

  async create(boothId: number, createBoothMemberDTO: CreateBoothMemberRequestDto, callerAccountId: number): Promise<BoothMember> {
    if(!(await Booth.findOne({ where: { id: boothId, ownerId: callerAccountId } }))) {
      throw new BoothMemberParentBoothNotFoundException();
    }

    return await create(BoothMember, {
      ...createBoothMemberDTO,
      boothId,
    });
  }

  async update(boothId: number, id: number, updateBoothMemberDTO: UpdateBoothMemberRequestDto, callerAccountId: number): Promise<BoothMember> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);

    try {
      return (await member.update({
        ...updateBoothMemberDTO,
        boothId: undefined,
      })).save();
    } catch(err) {
      throw new BoothMemberInfoUpdateFailedException();
    }
  }

  async uploadMemberImage(boothId: number, id: number, file: MultipartFile, callerAccountId: number): Promise<IImageUploadInfo> {
    return await this.utilService.processImageUpload(
      await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId),
      "avatarImageId",
      file,
      "booth/member",
      ImageSizeConstraintKey.BOOTH_MEMBER_AVATAR,
      callerAccountId,
    );
  }

  async deleteMemberImage(boothId: number, id: number, callerAccountId: number): Promise<ISuccessResponse> {
    return await this.utilService.processImageDelete(
      await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId),
      "avatarImageId",
    );
  }

  async remove(boothId: number, id: number, callerAccountId: number): Promise<ISuccessResponse> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);

    // Remove the member from the goods
    const goodsOwned = await Goods.findAll({
      where: jsonContains<Goods>("ownerMemberIds", id.toString()),
    });
    for(const goods of goodsOwned) {
      await goods.update({
        ownerMemberIds: goods.ownerMemberIds!.filter((memberId: number) => memberId !== id),
      });
    }

    return await removeTarget(member, undefined, true);
  }
}
