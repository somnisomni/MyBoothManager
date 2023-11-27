import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { findOneByPk } from "@/lib/common-functions";

@Injectable()
export class PublicGoodsCategoryService {
  async findOne(id: number): Promise<GoodsCategory> {
    return await findOneByPk(GoodsCategory, id);
  }

  async findAll(boothId?: number): Promise<Array<GoodsCategory>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsCategory.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;
    return { value: await GoodsCategory.count({ where }) };
  }
}