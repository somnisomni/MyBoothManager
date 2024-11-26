import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BoothService } from "../booth/booth.service";
import { CacheMap } from "@/lib/utils/cache-map";
import { findOneByPk, findAll as dbFindAll, create as dbCreate, removeInstance } from "@/lib/utils/db";
import GoodsCategory from "@/db/models/goods-category";
import { DuplicatedEntityException, EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import Booth from "@/db/models/booth";
import { GoodsCategoryInfoUpdateFailedException, GoodsCategoryParentBoothNotFoundException } from "./goods-category.exception";
import { CreateGoodsCategoryRequestDto } from "./dto/create.dto";
import { UpdateGoodsCategoryRequestDto } from "./dto/update.dto";
import { ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import GoodsCombination from "@/db/models/goods-combination";

@Injectable()
export class GoodsCategoryService {
  constructor(
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
  ) { }

  private readonly categoryBoothCache = new GoodsCategoryBoothCache();

  /**
   * Gets the goods category entity and parent booth entity, and checks if the goods category belongs to the booth.
   * @param categoryId ID of the goods category
   * @param boothId ID of the booth
   * @param accountId ID of the account which owns the booth. If omitted, the parent booth is not checked and `booth` becomes `undefined`.
   * @returns `GoodsCategory` entity
   * @throws `NoAccessException` if the goods category does not belong to the booth or the booth does not belong to the account
   * @throws `EntityNotFoundException` if the goods category with the ID does not exist
   */
  private async getCategoryAndParentBooth(categoryId: number, boothId: number, accountId?: number): Promise<{ category: GoodsCategory, booth?: Booth }> {
    if(!await this.categoryBoothCache.testValue(categoryId, boothId)) {
      throw new NoAccessException();
    }

    let booth: Booth | undefined;
    if(typeof accountId === "number") {
      try {
        booth = await this.booth.findOne(boothId, false, accountId);
      } catch(err) {
        if(err instanceof EntityNotFoundException) {
          // Change the error instance
          throw new GoodsCategoryParentBoothNotFoundException();
        }

        throw err;
      }
    }

    return {
      booth,
      category: await findOneByPk(GoodsCategory, categoryId),
    };
  }

  async isCategoryBelongsToBooth(categoryId: number, boothId: number): Promise<boolean> {
    return await this.categoryBoothCache.testValue(categoryId, boothId);
  }

  /**
   * Finds a goods category entity by ID.
   * @param id ID of the goods category
   * @param boothId ID of the booth which the goods category belongs to
   * @param force Whether to ignore parent booth published status.
   * @param accountId ID of the account
   * @returns Found `GoodsCategory` entity
   * @throws `BoothNotPublishedException` if the parent booth is not published when `force` is `false`
   */
  async findOne(id: number, boothId: number, force = false, accountId?: number): Promise<GoodsCategory> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return (await this.getCategoryAndParentBooth(id, boothId, accountId)).category;
  }

  /**
   * Finds all goods categories belonging to the booth.
   * @param boothId ID of the booth
   * @param force Whether to ignore parent booth published status. If `accountId` is specified, this is ignored and always assumed as `true`. default: `false`
   * @param accountId ID of the account
   * @returns Array of found `GoodsCategory` entities
   */
  async findAll(boothId: number, force = false, accountId?: number): Promise<GoodsCategory[]> {
    if(typeof accountId !== "number") {
      // PUBLIC booth check
      // `BoothService.findOne()` will throw errors on its own
      await this.booth.findOne(boothId, !force);
    }

    return await dbFindAll(GoodsCategory, { where: { boothId } });
  }

  /**
   * Creates a new goods category entity.
   * @param createDto DTO for creating a goods category
   * @param accountId ID of the account
   * @returns Newly created `GoodsCategory` entity
   */
  async create(createDto: CreateGoodsCategoryRequestDto, accountId: number): Promise<GoodsCategory> {
    // Check if the booth belongs to the account
    if(!await this.booth.isBoothBelongsToAccount(createDto.boothId, accountId)) {
      throw new GoodsCategoryParentBoothNotFoundException();
    }

    // Check existence
    if(await GoodsCategory.count({
      where: {
        boothId: createDto.boothId,
        name: createDto.name,
      },
    }) > 0) {
      throw new DuplicatedEntityException();
    }

    // Create
    return await dbCreate(GoodsCategory, createDto);
  }

  /**
   * Updates information of a goods category.
   * @param id ID of the goods category
   * @param updateDto DTO for updating goods category information
   * @param accountId ID of the account
   * @returns Updated `GoodsCategory` entity
   */
  async update(id: number, updateDto: UpdateGoodsCategoryRequestDto, accountId: number): Promise<GoodsCategory> {
    const { category } = await this.getCategoryAndParentBooth(id, updateDto.boothId, accountId);

    try {
      return await (await category.update({
        ...updateDto,
        boothId: undefined,  // Prevent boothId from being updated
      })).save();
    } catch(err) {
      throw new GoodsCategoryInfoUpdateFailedException();
    }
  }

  /**
   * Removes a goods category entity. Also unassociates all goods and goods combinations from the category.
   * @param id ID of the goods category
   * @param boothId ID of the booth
   * @param accountId ID of the account
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const { category } = await this.getCategoryAndParentBooth(id, boothId, accountId);

    // Unassociate goods and goods combinations
    for(const g of await Goods.findAll({ where: { categoryId: id } })) {
      await (g.set("categoryId", null)).save();
    }
    for(const c of await GoodsCombination.findAll({ where: { categoryId: id } })) {
      await (c.set("categoryId", null)).save();
    }

    // Remove
    return await removeInstance(category, { force: true }) ? SUCCESS_RESPONSE : SUCCESS_RESPONSE;
  }
}

class GoodsCategoryBoothCache extends CacheMap<number, number> {
  override async fetch(key: number): Promise<number> {
    const category = await findOneByPk(GoodsCategory, key);

    if(typeof category.boothId !== "number") throw new NoAccessException();

    return category.boothId;
  }
}
