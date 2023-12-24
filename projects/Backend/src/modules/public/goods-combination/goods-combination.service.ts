import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { findOneByPk } from "@/lib/common-functions";
import GoodsCombination from "@/db/models/goods-combination";

@Injectable()
export class PublicGoodsCombinationService {
  async findOne(id: number): Promise<GoodsCombination> {
    return await findOneByPk(GoodsCombination, id);
  }

  async findAll(boothId?: number): Promise<Array<GoodsCombination>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsCombination.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;
    return { value: await GoodsCombination.count({ where }) };
  }
}
