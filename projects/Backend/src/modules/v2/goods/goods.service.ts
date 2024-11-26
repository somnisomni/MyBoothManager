import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GoodsImageService } from "./goods.image.service";
import Goods from "@/db/models/goods";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { BoothService } from "../booth/booth.service";
import Booth from "@/db/models/booth";
import { GoodsInfoUpdateFailedException, GoodsParentBoothNotFoundException } from "./goods.exception";
import { CreateGoodsRequestDto } from "./dto/create.dto";
import { UpdateGoodsRequestDto } from "./dto/update.dto";
import { ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { CacheMap } from "@/lib/utils/cache-map";
import { findOneByPk, removeInstance, findAll as dbFindAll, create as dbCreate } from "@/lib/utils/db";

@Injectable()
export class GoodsService {
  constructor(
    @Inject(forwardRef(() => GoodsImageService))
    private readonly image: GoodsImageService,
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
  ) { }

  private readonly goodsBoothCache = new GoodsBoothCache();

  /**
   * Gets the goods entity and parent booth entity, and checks if the goods belongs to the booth.
   * @param goodsId ID of the goods
   * @param boothId ID of the booth
   * @param accountId ID of the account which owns the booth. If omitted, the parent booth is not checked and `booth` becomes `undefined`.
   * @returns `Goods` entity
   * @throws `NoAccessException` if the goods does not belong to the booth or the booth does not belong to the account
   * @throws `EntityNotFoundException` if the goods with the ID does not exist
   */
  private async getGoodsAndParentBooth(goodsId: number, boothId: number, accountId?: number): Promise<{ goods: Goods, booth?: Booth }> {
    if(!await this.goodsBoothCache.testValue(goodsId, boothId)) {
      throw new NoAccessException();
    }

    let booth: Booth | undefined;
    if(typeof accountId === "number") {
      try {
        booth = await this.booth.findOne(boothId, false, accountId);
      } catch(err) {
        if(err instanceof EntityNotFoundException) {
          // Change the error instance
          throw new GoodsParentBoothNotFoundException();
        }

        throw err;
      }
    }

    return {
      booth,
      goods: await findOneByPk(Goods, goodsId),
    };
  }

  async isGoodsBelongsToBooth(goodsId: number, boothId: number): Promise<boolean> {
    return await this.goodsBoothCache.testValue(goodsId, boothId);
  }

  /**
   * Finds a goods entity by ID.
   * @param id ID of the goods
   * @param boothId ID of the booth which the goods belongs to
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Found `Goods` entity
   * @throws `BoothNotPublishedException` if the parent booth is not published when `force` is `false`
   */
  async findOne(id: number, boothId: number, force = false, accountId?: number): Promise<Goods> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return (await this.getGoodsAndParentBooth(id, boothId, accountId)).goods;
  }

  /**
   * Finds all goods belonging to the booth.
   * @param boothId ID of the booth
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Array of found `Goods` entities
   */
  async findAll(boothId?: number, force = false, accountId?: number): Promise<Goods[]> {
    if(boothId && typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return await dbFindAll(Goods, {
      where: {
        boothId: boothId ?? undefined,
      },
    });
  }

  /**
   * Creates a new goods entity.
   * @param createDto DTO for creating a goods
   * @param accountId ID of the account
   * @returns Newly created `Goods` entity
   */
  async create(createDto: CreateGoodsRequestDto, accountId: number): Promise<Goods> {
    // Check if the booth belongs to the account
    if(!await this.booth.isBoothBelongsToAccount(createDto.boothId, accountId)) {
      throw new GoodsParentBoothNotFoundException();
    }

    // TODO: Normalization processes below may could be moved to the sequelize hook of entity class.
    // Normalize `stockRemaining`
    if(createDto.stockRemaining === undefined || createDto.stockRemaining < 0) {
      createDto.stockRemaining = createDto.stockInitial;
    }

    // Remove `categoryId` if it's uncategorized
    if(createDto.categoryId && createDto.categoryId < 0) {
      delete createDto.categoryId;
    }

    // Create
    return await dbCreate(Goods, createDto);
  }

  /**
   * Updates information of a goods.
   * @param id ID of the goods
   * @param updateDto DTO for updating goods information
   * @param accountId ID of the account
   * @returns Updated `Goods` entity
   */
  async update(id: number, updateDto: UpdateGoodsRequestDto, accountId: number): Promise<Goods> {
    let { goods } = await this.getGoodsAndParentBooth(id, updateDto.boothId, accountId);
    const categoryId = (updateDto.categoryId && updateDto.categoryId < 0) ? undefined : (updateDto.categoryId ?? goods.categoryId);

    try {
      // Handling category change if the goods is combined
      if(goods.combinationId && goods.categoryId !== categoryId) {
        goods = await goods.set("combinationId", null).save();
      }

      return await (await goods.update({
        ...updateDto,
        categoryId,
        boothId: undefined,  // Prevent boothId from being updated
      })).save();
    } catch(err) {
      throw new GoodsInfoUpdateFailedException();
    }
  }

  /**
   * Removes a goods entity. Also removes all images associated with the goods.
   * @param id ID of the goods
   * @param boothId ID of the booth
   * @param accountId ID of the account
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const { goods } = await this.getGoodsAndParentBooth(id, boothId, accountId);

    // Delete all images of the goods
    await this.image.deleteAllImages(id, boothId, accountId);

    return await removeInstance(goods) ? SUCCESS_RESPONSE : SUCCESS_RESPONSE;
  }
}

class GoodsBoothCache extends CacheMap<number, number> {
  override async fetch(key: number): Promise<number> {
    const goods = await findOneByPk(Goods, key);

    if(typeof goods.boothId !== "number") throw new NoAccessException();

    return goods.boothId;
  }
}
