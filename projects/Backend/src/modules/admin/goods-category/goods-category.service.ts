import { Injectable } from "@nestjs/common";
import { ISuccessResponse } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { create, removeTarget } from "@/lib/common-functions";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import { DuplicatedEntityException, EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { PublicGoodsCategoryService } from "@/modules/public/goods-category/goods-category.service";
import GoodsCombination from "@/db/models/goods-combination";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";
import { GoodsCategoryInfoUpdateFailedException, GoodsCategoryParentBoothNotFoundException } from "./goods-category.exception";

@Injectable()
export class GoodsCategoryService {
  constructor(private readonly publicGoodsCategoryService: PublicGoodsCategoryService) { }

  async getGoodsCategoryAndParentBooth(categoryId: number, boothId: number, callerAccountId: number): Promise<{ booth: Booth, category: GoodsCategory }> {
    const category = await this.publicGoodsCategoryService.findOne(categoryId);

    if(!category) throw new EntityNotFoundException();
    else if(category.boothId !== boothId) throw new NoAccessException();

    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new GoodsCategoryParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { booth, category };
  }

  async findGoodsCategoryBelongsToBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<GoodsCategory> {
    const { category } = await this.getGoodsCategoryAndParentBooth(goodsId, boothId, callerAccountId);
    return category;
  }

  async create(createGoodsCategoryDto: CreateGoodsCategoryDTO): Promise<GoodsCategory> {
    const existence = await GoodsCategory.findOne({
      where: {
        boothId: createGoodsCategoryDto.boothId,
        name: createGoodsCategoryDto.name,
      },
    });

    if(!existence) {
      return await create(GoodsCategory, createGoodsCategoryDto);
    } else {
      throw new DuplicatedEntityException();
    }
  }

  async updateInfo(id: number, updateGoodsCategoryDTO: UpdateGoodsCategoryDTO, callerAccountId: number) {
    let category = await this.findGoodsCategoryBelongsToBooth(id, updateGoodsCategoryDTO.boothId!, callerAccountId);

    try {
      await category.update({
        ...updateGoodsCategoryDTO,
        boothId: undefined,
      });
      category = await category.save();
    } catch(err) {
      throw new GoodsCategoryInfoUpdateFailedException();
    }

    return category;
  }

  async remove(id: number): Promise<ISuccessResponse> {
    const category = await this.publicGoodsCategoryService.findOne(id);

    // Find goods/combinations by category and set to default(uncategorized)
    for(const g of await Goods.findAll({ where: { categoryId: id } })) {
      await (g.set("categoryId", null)).save();
    }
    for(const c of await GoodsCombination.findAll({ where: { categoryId: id } })) {
      await (c.set("categoryId", null)).save();
    }

    return await removeTarget(category, undefined, true);
  }
}
