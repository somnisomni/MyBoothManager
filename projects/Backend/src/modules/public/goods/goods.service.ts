import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import { findOneByPk } from "@/lib/common-functions";
import UploadStorage from "@/db/models/uploadstorage";

@Injectable()
export class PublicGoodsService {
  async findOne(goodsId: number): Promise<Goods> {
    return await findOneByPk(Goods, goodsId, [ UploadStorage ]);
  }

  async findAll(boothId?: number): Promise<Array<Goods>> {
    const where = boothId ? { boothId } : undefined;

    return await Goods.findAll({
      include: [ UploadStorage ],
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
