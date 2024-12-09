import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BoothService } from "../booth/booth.service";
import { GoodsCombinationImageService } from "./goods-combination.image.service";
import GoodsCombination from "@/db/models/goods-combination";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import { findOneByPk, removeInstance, findAll as dbFindAll, create as dbCreate } from "@/lib/utils/db";
import { NoAccessException, EntityNotFoundException } from "@/lib/exceptions";
import { CacheMap } from "@/lib/utils/cache-map";
import { GoodsStockVisibility, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { CreateGoodsCombinationRequestDto } from "./dto/create.dto";
import { UpdateGoodsCombinationRequestDto } from "./dto/update.dto";
import { GoodsCombinationParentBoothNotFoundException, GoodsCombinationInfoUpdateFailedException } from "./goods-combination.exception";

@Injectable()
export class GoodsCombinationService {
  constructor(
    @Inject(forwardRef(() => GoodsCombinationImageService))
    private readonly image: GoodsCombinationImageService,
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
  ) { }

  private readonly combinationBoothCache = new CombinationBoothCache();

  /**
   * Gets the goods combination entity and parent booth entity, and checks if the goods combination belongs to the booth.
   * @param combinationId ID of the goods combination
   * @param boothId ID of the booth
   * @param accountId ID of the account which owns the booth. If omitted, the parent booth is not checked and `booth` becomes `undefined`.
   * @returns `GoodsCombination` entity
   * @throws `NoAccessException` if the goods combination does not belong to the booth or the booth does not belong to the account
   * @throws `EntityNotFoundException` if the goods combination with the ID does not exist
   */
  private async getCombinationAndParentBooth(combinationId: number, boothId: number, accountId?: number): Promise<{ combination: GoodsCombination, booth?: Booth }> {
    if(!await this.combinationBoothCache.testValue(combinationId, boothId)) {
      throw new NoAccessException();
    }

    let booth: Booth | undefined;
    if(typeof accountId === "number") {
      try {
        booth = await this.booth.findOne(boothId, false, accountId);
      } catch(err) {
        if(err instanceof EntityNotFoundException) {
          // Change the error instance
          throw new GoodsCombinationParentBoothNotFoundException();
        }

        throw err;
      }
    }

    return {
      booth,
      combination: await findOneByPk(GoodsCombination, combinationId),
    };
  }

  async isCombinationBelongsToBooth(combinationId: number, boothId: number): Promise<boolean> {
    return await this.combinationBoothCache.testValue(combinationId, boothId);
  }

  /**
   * Finds a goods combination entity by ID.
   * @param id ID of the goods combination
   * @param boothId ID of the booth which the goods combination belongs to
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Found `GoodsCombination` entity
   * @throws `BoothNotPublishedException` if the parent booth is not published when `force` is `false`
   */
  async findOne(id: number, boothId: number, force = false, accountId?: number): Promise<GoodsCombination> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return (await this.getCombinationAndParentBooth(id, boothId, accountId)).combination;
  }

  /**
   * Finds all goods combination belonging to the booth.
   * @param boothId ID of the booth
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Array of found `GoodsCombination` entities
   */
  async findAll(boothId: number, force = false, accountId?: number): Promise<GoodsCombination[]> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return await dbFindAll(GoodsCombination, { where: { boothId } });
  }

  /**
   * Creates a new goods combination entity.
   * @param createDto DTO for creating a goods combination
   * @param accountId ID of the account
   * @returns Newly created `GoodsCombination` entity
   */
  async create(createDto: CreateGoodsCombinationRequestDto, accountId: number): Promise<GoodsCombination> {
    // Check if the booth belongs to the account
    if(!await this.booth.isBoothBelongsToAccount(createDto.boothId, accountId)) {
      throw new GoodsCombinationParentBoothNotFoundException();
    }

    // Remove `categoryId` if it's uncategorized
    if(createDto.categoryId && createDto.categoryId < 0) {
      delete createDto.categoryId;
    }

    // Set stock visibility to SHOW_REMAINING_ONLY if set to SHOW_ALL
    if(createDto.stockVisibility === GoodsStockVisibility.SHOW_ALL) {
      createDto.stockVisibility = GoodsStockVisibility.SHOW_REMAINING_ONLY;
    }

    // Remove/Exclude target goods with different category
    if(createDto.goodsIds) {
      const targetGoods = await Goods.findAll({
        where: {
          id: createDto.goodsIds,
        },
      });
      for(const g of targetGoods) {
        if(g.categoryId !== createDto.categoryId) {
          await (g.set("combinationId", null)).save();
          createDto.goodsIds.splice(createDto.goodsIds.indexOf(g.id), 1);
        }
      }
    }

    // Create combination
    const combination = await dbCreate(GoodsCombination, createDto);

    // Update existing goods to associate with the combination
    const goodsToBeUpdated = await Goods.findAll({
      where: {
        id: createDto.goodsIds,
      },
    });
    for(const g of goodsToBeUpdated) {
      if(!g.combinationId) {
        await (g.set("combinationId", combination.id)).save();
      }
    }

    // Reload combination and return the entity
    return await combination.reload();
  }

  /**
   * Updates information of a goods combination.
   * @param id ID of the goods combination
   * @param updateDto DTO for updating goods information
   * @param accountId ID of the account
   * @returns Updated `Goods` entity
   */
  async update(id: number, updateDto: UpdateGoodsCombinationRequestDto, accountId: number): Promise<GoodsCombination> {
    // Remove `categoryId` if it's uncategorized
    if(updateDto.categoryId && updateDto.categoryId < 0) {
      delete updateDto.categoryId;
    }

    // Set stock visibility to SHOW_REMAINING_ONLY if set to SHOW_ALL
    if(updateDto.stockVisibility === GoodsStockVisibility.SHOW_ALL) {
      updateDto.stockVisibility = GoodsStockVisibility.SHOW_REMAINING_ONLY;
    }

    // Get the combination
    const { combination } = await this.getCombinationAndParentBooth(id, updateDto.boothId, accountId);

    if(updateDto.goodsIds) {
      // Remove combination ID from existing goods
      const goodsToBeUpdated = await Goods.findAll({
        where: {
          combinationId: combination.id,
        },
      });
      for(const g of goodsToBeUpdated) {
        if(g.combinationId) {
          await (g.set("combinationId", null)).save();
        }
      }

      // Remove/Exclude target goods with different category
      const targetGoods = await Goods.findAll({
        where: {
          id: updateDto.goodsIds,
        },
      });
      for(const g of targetGoods) {
        if(g.categoryId !== (updateDto.categoryId || combination.categoryId)) {
          await (g.set("combinationId", null)).save();
          updateDto.goodsIds.splice(updateDto.goodsIds.indexOf(g.id), 1);
        }
      }
    }

    // Update combination
    try {
      await combination.update({
        ...updateDto,
        boothId: undefined,  // Prevent boothId from being updated
      });
      await (await combination.save()).reload();
    } catch(err) {
      throw new GoodsCombinationInfoUpdateFailedException();
    }

    // Assign goods to combination
    if(updateDto.goodsIds) {
      const goodsToBeUpdated = await Goods.findAll({
        where: {
          id: updateDto.goodsIds,
        },
      });
      for(const g of goodsToBeUpdated) {
        if(!g.combinationId) {
          await (g.set("combinationId", combination.id)).save();
        }
      }
    }

    // Reload combination and return the entity
    return await combination.reload();
  }

  /**
   * Removes a goods combination entity. Also removes all images associated with the goods combination.
   * @param id ID of the goods combination
   * @param boothId ID of the booth
   * @param accountId ID of the account
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const { combination } = await this.getCombinationAndParentBooth(id, boothId, accountId);

    // Find goods by combination and unassign them
    const goods = await Goods.findAll({
      where: {
        combinationId: combination.id,
      },
    });
    for(const g of goods) {
      await (g.set("combinationId", null)).save();
    }

    // Delete all images of the goods combination
    await this.image.deleteAllImages(id, boothId, accountId);

    return await removeInstance(combination) ? SUCCESS_RESPONSE : SUCCESS_RESPONSE;
  }
}

class CombinationBoothCache extends CacheMap<number, number> {
  protected override async fetch(key: number): Promise<number> {
    const goods = await findOneByPk(GoodsCombination, key);

    if(typeof goods.boothId !== "number") throw new NoAccessException();

    return goods.boothId;
  }
}
