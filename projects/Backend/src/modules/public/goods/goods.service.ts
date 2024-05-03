import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import { findOneByPk } from "@/lib/common-functions";
import { PublicCommon } from "../common";

@Injectable()
export class PublicGoodsService {
  async findOne(goodsId: number): Promise<Goods> {
    const goods = await findOneByPk(Goods, goodsId);

    PublicCommon.throwIfBoothNotPublicilyAccessible(goods.boothId);

    return goods;
  }

  async findAll(boothId?: number, isAdmin: boolean = false): Promise<Array<Goods>> {
    if(boothId && !isAdmin) {
      PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);
    }

    const where = boothId ? { boothId } : undefined;

    return await Goods.findAll({
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
    return { value: await Goods.count({ where }) };
  }
}
