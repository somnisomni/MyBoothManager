import { BadRequestException, Injectable } from "@nestjs/common";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { create } from "@/lib/common-functions";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";

@Injectable()
export class GoodsCategoryService {
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

    if(!category) throw new BadRequestException("Goods category not found.");
    return category;
  }

  update(id: number, updateGoodsCategoryDTO: UpdateGoodsCategoryDTO) {
    throw new BadRequestException("Goods category update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods category deletion is not yet supported.");
  }
}
