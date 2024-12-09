import Account from "@/db/models/account";
import Booth from "@/db/models/booth";
import { NoAccessException } from "@/lib/exceptions";
import { BoothStatus, ISuccessResponse, SUCCESS_RESPONSE, type IBoothStatus, type ISingleValueResponse } from "@myboothmanager/common";
import { forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Op } from "sequelize";
import { CreateBoothRequestDto } from "./dto/create.dto";
import { BoothImageService } from "./booth.image.service";
import { UpdateBoothRequestDto } from "./dto/update.dto";
import { UpdateBoothStatusRequestDto } from "./dto/update-status.dto";
import { SUPER_ADMIN_AUTH_DATA } from "../auth/auth.service";
import { BoothInfoUpdateFailedException, BoothNoticeUpdateFailedException, BoothNotPublishedException, BoothStatusUpdateFailedException } from "./booth.exception";
import { CacheMap } from "@/lib/utils/cache-map";
import { create as dbCreate, findAll as dbFindAll, findOneByPk, removeInstance } from "@/lib/utils/db";
import type { UpdateBoothNoticeRequestDto } from "@/modules/v2/booth/dto/update-notice.dto";

@Injectable()
export class BoothService {
  constructor(
    @Inject(forwardRef(() => BoothImageService))
    private readonly image: BoothImageService,
  ) { }

  private readonly boothOwnerCache = new BoothOwnerCache();

  /**
   * Gets the booth entity and checks if it belongs to the specific account.
   * @param boothId ID of the booth
   * @param accountId ID of the account
   * @returns `Booth` entity
   * @throws `EntityNotFoundException` if the booth with the ID does not exist
   * @throws `NoAccessException` if the booth does not belong to the account
   */
  private async getBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    if(!await this.boothOwnerCache.testValue(boothId, accountId)) {
      throw new NoAccessException();
    }

    return await findOneByPk(Booth, boothId);
  }

  async isBoothBelongsToAccount(boothId: number, accountId: number): Promise<boolean> {
    return await this.boothOwnerCache.testValue(boothId, accountId);
  }

  isBoothPublished(booth?: Booth): boolean {
    if(!booth) return false;

    return booth.status === BoothStatus.OPEN || booth.statusContentPublished;
  }

  async isBoothAvailable(booth?: Booth | number): Promise<boolean> {
    if(!booth) return false;

    let boothInstance: Booth;
    if(typeof booth === "number") {
      boothInstance = await findOneByPk(Booth, booth);
    } else {
      boothInstance = booth;
    }

    return this.isBoothPublished(boothInstance)
            && (boothInstance.status !== BoothStatus.CLOSE || (boothInstance.status === BoothStatus.CLOSE && boothInstance.statusContentPublished))
            && (!boothInstance.fairId || !boothInstance.associatedFair?.isPassed);
  }

  /**
   * Finds a booth entity by ID. If `accountId` is specified, it checks if the booth belongs to the account.
   * @param id ID of the booth
   * @param onlyPublished Whether to find only published booths. default: `false`. published condition: `status != PREPARE || statusContentPublished == true`
   * @param accountId ID of the account
   * @param setLastSelected Whether to set the booth as the last selected booth of the account. default: `false`
   * @returns Found `Booth` entity
   */
  async findOne(id: number, onlyPublished = false, accountId?: number, setLastSelected = false): Promise<Booth> {
    if(typeof accountId === "number") {
      // ADMIN
      const booth = await this.getBoothBelongsToAccount(id, accountId);

      if(booth && setLastSelected) {
        await (await findOneByPk(Account, accountId))?.update({ lastSelectedBoothId: id });
      }

      return booth;
    } else {
      // PUBLIC
      const booth = await findOneByPk(Booth, id);

      if(onlyPublished && !this.isBoothPublished(booth)) {
        // If booth is not published, throw an error
        throw new BoothNotPublishedException();
      }

      return booth;
    }
  }

  /**
   * Finds all booths. If `accountId` is specified, it finds all booths owned by the account.
   * @param onlyAvailable Whether to find only available booths. default: `false`. available condition: `status != CLOSE && !(status == PREPARE && statusContentPublished == false) && associatedFair.isPassed == false`
   * @param accountId ID of the account
   * @returns Array of found `Booth` entities
   */
  async findAll(onlyAvailable = false, accountId?: number): Promise<Booth[]> {
    const booths = await dbFindAll(Booth, {
      where: {
        ...(accountId ? { ownerId: accountId } : { }),
        ...(onlyAvailable ? {
          // status != CLOSE && !(status == PREPARE && statusContentPublished == false)
          [Op.and]: {
            status: { [Op.not]: BoothStatus.CLOSE },
            [Op.not]: {
              [Op.and]: {
                status: BoothStatus.PREPARE,
                statusContentPublished: false,
              },
            },
          },
        } : { }),
      },
    });

    // associatedFair.isPassed === false
    return booths.filter(
      booth => !onlyAvailable
                || (onlyAvailable && (typeof booth.fairId !== "number" || !booth.associatedFair?.isPassed)));
  }

  /**
   * Creates a new booth entity.
   * @param createDto DTO for creating a booth
   * @param accountId ID of the owner account
   * @returns Newly created `Booth` entity
   */
  async create(createDto: CreateBoothRequestDto, accountId: number): Promise<Booth> {
    return await dbCreate(Booth, { ...createDto, ownerId: accountId });
  }

  /**
   * Updates information of a booth.
   * @param id ID of the booth
   * @param updateDto DTO for updating booth information
   * @param accountId ID of the account
   * @returns Updated `Booth` entity
   * @throws `BoothInfoUpdateFailedException` if the update failed
   */
  async update(id: number, updateDto: UpdateBoothRequestDto, accountId: number): Promise<Booth> {
    try {
      const booth = await this.getBoothBelongsToAccount(id, accountId);

      return await (await booth.update(updateDto)).save();
    } catch(err) {
      throw new BoothInfoUpdateFailedException();
    }
  }

  /**
   * Updates status of a booth.
   * @param id ID of the booth
   * @param updateStatusDto DTO for updating status of a booth
   * @param accountId ID of the account
   * @returns Updated status (satisfies `IBoothStatus`)
   */
  async updateStatus(id: number, updateStatusDto: UpdateBoothStatusRequestDto, accountId: number): Promise<IBoothStatus> {
    try {
      const booth = await this.getBoothBelongsToAccount(id, accountId);

      // Force setting `contentPublished` to true if the status is `OPEN` or `PAUSE`
      if(updateStatusDto.status === BoothStatus.OPEN || updateStatusDto.status === BoothStatus.PAUSE) {
        updateStatusDto.contentPublished = true;
      }

      // Clear `reason` if the status is not `PAUSE`
      if(updateStatusDto.status !== BoothStatus.PAUSE) {
        updateStatusDto.reason = undefined;
      }

      const instance = await (await booth.update({
        status: updateStatusDto.status,
        statusReason: updateStatusDto.reason ?? null,
        statusContentPublished: updateStatusDto.contentPublished,
      })).save();

      return {
        status: instance.status,
        reason: instance.statusReason ?? undefined,
        contentPublished: instance.statusContentPublished,
      };
    } catch(err) {
      throw new BoothStatusUpdateFailedException();
    }
  }

  /**
   * Updates notice of a booth.
   * @param id ID of the booth
   * @param notice DTO for updating notice of a booth
   * @param accountId ID of the account
   * @returns Updated notice content (in `value` field)
   */
  async updateNotice(id: number, notice: UpdateBoothNoticeRequestDto, accountId: number): Promise<ISingleValueResponse<string>> {
    try {
      const booth = await this.getBoothBelongsToAccount(id, accountId);

      const instance = await (await booth.update({
        noticeContent: notice.noticeContent || null,
      })).save();

      return {
        value: instance.noticeContent!,
      };
    } catch(err) {
      throw new BoothNoticeUpdateFailedException();
    }
  }

  /**
   * Removes a booth entity. Also removes all images associated with the booth.
   * @param id ID of the booth
   * @param accountId ID of the account. If super admin ID is specified, it bypasses the owner check.
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number, accountId: number): Promise<ISuccessResponse> {
    const booth = accountId === SUPER_ADMIN_AUTH_DATA.id
      ? await findOneByPk(Booth, id)
      : await this.getBoothBelongsToAccount(id, accountId);

    // Delete all images of the booth
    await this.image.deleteAllImages(id, accountId);

    // TODO: Remove all related entities like goods, orders, etc.

    return await removeInstance(booth) ? SUCCESS_RESPONSE : SUCCESS_RESPONSE;
  }
}

class BoothOwnerCache extends CacheMap<number, number> {
  protected override async fetch(key: number): Promise<number> {
    const booth = await findOneByPk(Booth, key);

    if(typeof booth.ownerId !== "number") throw new NoAccessException();

    return booth.ownerId;
  }
}
