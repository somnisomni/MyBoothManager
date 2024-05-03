import type GoodsCategory from "@/db/models/goods-category";
import { Injectable } from "@nestjs/common";
import { BoothStatus, IBoothModel, ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { WhereOptions } from "sequelize";
import Booth from "@/db/models/booth";
import { findOneByPk } from "@/lib/common-functions";
import GoodsCombination from "@/db/models/goods-combination";
import Goods from "@/db/models/goods";
import { PublicGoodsService } from "../goods/goods.service";
import { PublicGoodsCategoryService } from "../goods-category/goods-category.service";
import { PublicGoodsCombinationService } from "../goods-combination/goods-combination.service";
import { PublicCommon } from "../common";
import { BoothNotPublishedException } from "./booth.exception";

@Injectable()
export class PublicBoothService {
  constructor(
    private publicGoodsService: PublicGoodsService,
    private publicGoodsCategoryService: PublicGoodsCategoryService,
    private publicGoodsCombinationService: PublicGoodsCombinationService) { }

  async findOne(boothId: number): Promise<Booth> {
    const booth = await findOneByPk(Booth, boothId);

    if(booth.status === BoothStatus.PREPARE && !booth.statusContentPublished) {
      throw new BoothNotPublishedException();
    }

    return booth;
  }

  async findAll(accountId?: number): Promise<Array<Booth>> {
    const where: WhereOptions<IBoothModel> = {
      ...(accountId ? {
        ownerId: accountId,
      } : {
        ...PublicCommon.PUBLIC_ALL_BOOTH_WHERE_OPTIONS,
      }),
    };

    return await Booth.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(): Promise<ISingleValueResponse<number>> {
    return { value: await Booth.count() };
  }

  async findAllGoodsOfBooth(boothId: number): Promise<Array<Goods>> {
    return await this.publicGoodsService.findAll(boothId);
  }

  async countAllGoodsOfBooth(boothId: number): Promise<ISingleValueResponse<number>> {
    return await this.publicGoodsService.countAll(boothId);
  }

  async findAllGoodsCategoryOfBooth(boothId: number): Promise<Array<GoodsCategory>> {
    return await this.publicGoodsCategoryService.findAll(boothId);
  }

  async countAllGoodsCategoryOfBooth(boothId: number): Promise<ISingleValueResponse<number>> {
    return await this.publicGoodsCategoryService.countAll(boothId);
  }

  async findAllGoodsCombinationOfBooth(boothId: number): Promise<Array<GoodsCombination>> {
    return await this.publicGoodsCombinationService.findAll(boothId);
  }

  async countAllGoodsCombinationOfBooth(boothId: number): Promise<ISingleValueResponse<number>> {
    return await this.publicGoodsCombinationService.countAll(boothId);
  }
}
