import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { findOneByPk } from "@/lib/common-functions";
import { PublicCommon } from "../common";
import { BoothNotPublishedException } from "../booth/booth.exception";

@Injectable()
export class PublicGoodsCategoryService {
  async findOne(id: number, isAdmin: boolean = false): Promise<GoodsCategory> {
    const category = await findOneByPk(GoodsCategory, id);

    if(!isAdmin) {
      if(!await PublicCommon.isBoothPublicilyAccessible(category.boothId)) {
        throw new BoothNotPublishedException();
      }
    }

    return category;
  }

  async findAll(boothId?: number, isAdmin: boolean = false): Promise<Array<GoodsCategory>> {
    if(boothId && !isAdmin) {
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
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
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
    }

    const where = boothId ? { boothId } : undefined;
    return { value: await GoodsCategory.count({ where }) };
  }
}
