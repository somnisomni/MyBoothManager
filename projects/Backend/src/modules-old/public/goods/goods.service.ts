import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import { findOneByPk } from "@/lib/common-functions";
import { PublicCommon } from "../common";
import { BoothNotPublishedException } from "../booth/booth.exception";

@Injectable()
export class PublicGoodsService {
  async findOne(goodsId: number): Promise<Goods> {
    const goods = await findOneByPk(Goods, goodsId);

    if(!await PublicCommon.isBoothPublicilyAccessible(goods.boothId)) {
      throw new BoothNotPublishedException();
    }

    return goods;
  }

  async findAll(boothId?: number, isAdmin: boolean = false): Promise<Array<Goods>> {
    if(boothId && !isAdmin) {
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
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
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
    }

    const where = boothId ? { boothId } : undefined;
    return { value: await Goods.count({ where }) };
  }
}
