import type Goods from "@/db/models/goods";
import type GoodsCategory from "@/db/models/goods-category";
import { Injectable } from "@nestjs/common";
import { BoothStatus, IBooth, IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { WhereOptions , Op } from "sequelize";
import Booth from "@/db/models/booth";
import { findOneByPk } from "@/lib/common-functions";
import GoodsCombination from "@/db/models/goods-combination";
import { PublicGoodsService } from "../goods/goods.service";
import { PublicGoodsCategoryService } from "../goods-category/goods-category.service";
import { PublicGoodsCombinationService } from "../goods-combination/goods-combination.service";
import { BoothNotPublishedException } from "./booth.exception";

@Injectable()
export class PublicBoothService {
  constructor(
    private publicGoodsService: PublicGoodsService,
    private publicGoodsCategoryService: PublicGoodsCategoryService,
    private publicGoodsCombinationService: PublicGoodsCombinationService) { }

  private readonly PUBLIC_WHERE_OPTIONS: WhereOptions<IBooth> = {
    [Op.not]: {
      [Op.and]: {
        status: BoothStatus.PREPARE,
        statusPublishContent: false,
      },
    },
  };

  async findOne(boothId: number): Promise<Booth> {
    const booth = await findOneByPk(Booth, boothId);

    if(booth.status === BoothStatus.PREPARE && !booth.statusPublishContent) {
      throw new BoothNotPublishedException();
    }

    return booth;
  }

  async findAll(accountId?: number): Promise<Array<Booth>> {
    const where: WhereOptions<IBooth> = {
      ...(accountId ? {
        ownerId: accountId,
      } : {
        ...this.PUBLIC_WHERE_OPTIONS,
      }),
    };

    try {
      return await Booth.findAll({
        where,
        attributes: {
          exclude: SEQUELIZE_INTERNAL_KEYS,
        },
      });
    } catch(err) { console.error(err); return []; }
  }

  async countAll(): Promise<IValueResponse> {
    return { value: await Booth.count() };
  }

  async findAllGoodsOfBooth(boothId: number): Promise<Array<Goods>> {
    return await this.publicGoodsService.findAll(boothId);
  }

  async countAllGoodsOfBooth(boothId: number): Promise<IValueResponse> {
    return await this.publicGoodsService.countAll(boothId);
  }

  async findAllGoodsCategoryOfBooth(boothId: number): Promise<Array<GoodsCategory>> {
    return await this.publicGoodsCategoryService.findAll(boothId);
  }

  async countAllGoodsCategoryOfBooth(boothId: number): Promise<IValueResponse> {
    return await this.publicGoodsCategoryService.countAll(boothId);
  }

  async findAllGoodsCombinationOfBooth(boothId: number): Promise<Array<GoodsCombination>> {
    return await this.publicGoodsCombinationService.findAll(boothId);
  }

  async countAllGoodsCombinationOfBooth(boothId: number): Promise<IValueResponse> {
    return await this.publicGoodsCombinationService.countAll(boothId);
  }
}
