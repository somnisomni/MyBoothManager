import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import { EntityNotFoundException } from "@/lib/exceptions";

@Injectable()
export class PublicGoodsService {
  constructor() {}

  async findOne(goodsId: number): Promise<Goods> {
    const goods = await Goods.findByPk(goodsId, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!goods) throw new EntityNotFoundException();
    else return goods;
  }

  async findAll(boothId?: number): Promise<Array<Goods>> {
    const where = boothId ? { boothId } : undefined;

    return await Goods.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;
    return { value: await Goods.count({ where }) };
  }
}
