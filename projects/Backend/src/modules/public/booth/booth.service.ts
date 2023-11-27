import type Goods from "@/db/models/goods";
import type GoodsCategory from "@/db/models/goods-category";
import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import { EntityNotFoundException } from "@/lib/exceptions";
import { PublicGoodsService } from "../goods/goods.service";
import { PublicGoodsCategoryService } from "../goods-category/goods-category.service";

@Injectable()
export class PublicBoothService {
  constructor(
    private publicGoodsService: PublicGoodsService,
    private publicGoodsCategoryService: PublicGoodsCategoryService) {}

  async findOne(boothId: number): Promise<Booth> {
    const booth = await Booth.findByPk(boothId, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!booth) throw new EntityNotFoundException();
    else return booth;
  }

  async findAll(): Promise<Array<Booth>> {
    return await Booth.findAll({
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
