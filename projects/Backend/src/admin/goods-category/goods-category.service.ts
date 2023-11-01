import { Injectable } from "@nestjs/common";
import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { create, removeTarget } from "@/lib/common-functions";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";
import { GoodsCategoryInfoUpdateFailedException, GoodsCategoryParentBoothNotFoundException } from "./goods-category.exception";

@Injectable()
export class GoodsCategoryService {
  async getGoodsCategoryAndParentBooth(categoryId: number, boothId: number, callerAccountId: number): Promise<{ booth: Booth, category: GoodsCategory }> {
    const category = await GoodsCategory.findByPk(categoryId, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

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
    return await create(GoodsCategory, createGoodsCategoryDto);
  }

  async findAll(boothId: number): Promise<Array<GoodsCategory>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsCategory.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findOne(id: number): Promise<GoodsCategory> {
    const category = await GoodsCategory.findByPk(id, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!category) throw new EntityNotFoundException();
    return category;
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
    const category = await this.findOne(id);

    // Find goods by category and set to default(uncategorized)
    const goods = await Goods.findAll({
      where: {
        categoryId: id,
      },
    });
    for(const g of goods) {
      await (g.set("categoryId", null)).save();
    }

    return await removeTarget(category, true);
  }
}
