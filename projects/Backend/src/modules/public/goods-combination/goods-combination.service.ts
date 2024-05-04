import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { findOneByPk } from "@/lib/common-functions";
import GoodsCombination from "@/db/models/goods-combination";
import { PublicCommon } from "../common";

@Injectable()
export class PublicGoodsCombinationService {
  async findOne(id: number): Promise<GoodsCombination> {
    const combination = await findOneByPk(GoodsCombination, id);

    PublicCommon.throwIfBoothNotPublicilyAccessible(combination.boothId);

    return combination;
  }

  async findAll(boothId?: number, isAdmin: boolean = false): Promise<Array<GoodsCombination>> {
    if(boothId && !isAdmin) {
      PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);
    }

    const where = boothId ? { boothId } : undefined;

    return await GoodsCombination.findAll({
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
    return { value: await GoodsCombination.count({ where }) };
  }
}
