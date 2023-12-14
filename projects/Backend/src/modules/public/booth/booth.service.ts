import type Goods from "@/db/models/goods";
import type GoodsCategory from "@/db/models/goods-category";
import { Injectable } from "@nestjs/common";
import { BoothStatus, IBooth, IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { WhereOptions , Op } from "sequelize";
import Booth from "@/db/models/booth";
import { findOneByPk } from "@/lib/common-functions";
import { PublicGoodsService } from "../goods/goods.service";
import { PublicGoodsCategoryService } from "../goods-category/goods-category.service";
import { BoothNotPublishedException } from "./booth.exception";
import UploadStorage from "@/db/models/uploadstorage";

@Injectable()
export class PublicBoothService {
  constructor(
    private publicGoodsService: PublicGoodsService,
    private publicGoodsCategoryService: PublicGoodsCategoryService) { }

  private readonly PUBLIC_WHERE_OPTIONS: WhereOptions<IBooth> = {
    [Op.not]: {
      [Op.and]: {
        status: BoothStatus.PREPARE,
        statusPublishContent: false,
      },
    },
  };

  async findOne(boothId: number): Promise<Booth> {
    const booth = await findOneByPk(Booth, boothId, [ UploadStorage ]);

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

    return await Booth.findAll({
      include: [ UploadStorage ],
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
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
}
