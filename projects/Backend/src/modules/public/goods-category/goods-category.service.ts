import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { findOneByPk } from "@/lib/common-functions";
import { PublicCommon } from "../common";

@Injectable()
export class PublicGoodsCategoryService {
  async findOne(id: number): Promise<GoodsCategory> {
    const category = await findOneByPk(GoodsCategory, id);

    PublicCommon.throwIfBoothNotPublicilyAccessible(category.boothId);

    return category;
  }

  async findAll(boothId?: number): Promise<Array<GoodsCategory>> {
    if(boothId) {
      PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);
    }

    const where = boothId ? { boothId } : undefined;

    return await GoodsCategory.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<ISingleValueResponse<number>> {
    if(boothId) {
      PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);
    }

    const where = boothId ? { boothId } : undefined;
    return { value: await GoodsCategory.count({ where }) };
  }
}
