import type Goods from "@/db/models/goods";
import type GoodsCategory from "@/db/models/goods-category";
import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import { findOneByPk } from "@/lib/common-functions";
import { PublicGoodsService } from "../goods/goods.service";
import { PublicGoodsCategoryService } from "../goods-category/goods-category.service";

@Injectable()
export class PublicBoothService {
  constructor(
    private publicGoodsService: PublicGoodsService,
    private publicGoodsCategoryService: PublicGoodsCategoryService) {}

  async findOne(boothId: number): Promise<Booth> {
    return await findOneByPk(Booth, boothId);
  }

  async findAll(accountId?: number): Promise<Array<Booth>> {
    const where = accountId ? { ownerId: accountId } : undefined;

    return await Booth.findAll({
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
