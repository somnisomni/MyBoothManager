import Account from "@/db/models/account";
import Booth from "@/db/models/booth";
import { findOneByPk, findAll as commonFindAll, create as commonCreate, removeTarget } from "@/lib/common-functions";
import { NoAccessException } from "@/lib/exceptions";
import { CacheMap } from "@/lib/types";
import { BoothStatus, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { CreateBoothRequestDto } from "./dto/create.dto";
import { BoothImageService } from "./booth.image.service";
import { UpdateBoothRequestDto } from "./dto/update.dto";
import { UpdateBoothStatusRequestDto } from "./dto/update-status.dto";
import { SUPER_ADMIN_AUTH_DATA } from "../auth/auth.service";
import { BoothInfoUpdateFailedException, BoothNotPublishedException, BoothStatusUpdateFailedException } from "./booth.exception";

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

      if(onlyPublished && (booth.status === BoothStatus.PREPARE && !booth.statusContentPublished)) {
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
    const booths = await commonFindAll(Booth, {
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
    return await commonCreate(Booth, createDto, undefined, { ownerId: accountId });
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
   * @returns `SUCCESS_RESPONSE`
   */
  async updateStatus(id: number, updateStatusDto: UpdateBoothStatusRequestDto, accountId: number): Promise<ISuccessResponse> {
    try {
      const booth = await this.getBoothBelongsToAccount(id, accountId);

      await (await booth.update({
        status: updateStatusDto.status,
        statusReason: updateStatusDto.reason,
        statusContentPublished: updateStatusDto.contentPublished,
      })).save();
    } catch(err) {
      throw new BoothStatusUpdateFailedException();
    }

    return SUCCESS_RESPONSE;
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

    return await removeTarget(booth);
  }
}

class BoothOwnerCache extends CacheMap<number, number> {
  override async fetch(key: number): Promise<number> {
    const booth = await findOneByPk(Booth, key);

    if(typeof booth.ownerId === "undefined") throw new NoAccessException();

    return booth.ownerId;
  }
}
