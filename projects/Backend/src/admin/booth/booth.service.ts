import { Injectable } from "@nestjs/common";
import { ISuccessResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import GoodsOrder from "@/db/models/goods-order";
import { create, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { GoodsService } from "../goods/goods.service";
import { GoodsCategoryService } from "../goods-category/goods-category.service";
import { GoodsOrderService } from "../goods-order/goods-order.service";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";
import { BoothInfoUpdateFailedException, BoothStatusUpdateFailedException } from "./booth.exception";

@Injectable()
export class BoothService {
  constructor(
    private goodsService: GoodsService,
    private goodsCategoryService: GoodsCategoryService,
    private goodsOrderService: GoodsOrderService) {}

  async findBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    const booth = await Booth.findByPk(boothId, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!booth) throw new EntityNotFoundException();
    else if(booth.ownerId !== accountId) throw new NoAccessException();
    else return booth;
  }

  async create(createBoothDto: CreateBoothDTO, ownerId: number): Promise<Booth> {
    return await create(Booth, createBoothDto, { ownerId });
  }

  async findAll(ownerId?: number): Promise<Array<Booth>> {
    const where = ownerId ? { ownerId } : undefined;

    return await Booth.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findAllGoodsOfBooth(boothId: number, callerAccountId: number): Promise<Array<Goods>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsService.findAll(boothId);
  }

  async countAllGoodsOfBooth(boothId: number, callerAccountId: number): Promise<IValueResponse> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsService.countAll(boothId);
  }

  async findAllGoodsCategoryOfBooth(boothId: number, callerAccountId: number): Promise<Array<GoodsCategory>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsCategoryService.findAll(boothId);
  }

  async findAllGoodsOrderOfBooth(boothId: number, callerAccountId: number): Promise<Array<GoodsOrder>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsOrderService.findAll(boothId);
  }

  async updateBoothInfo(id: number, updateBoothDto: UpdateBoothDTO, callerAccountId: number): Promise<Booth> {
    let booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothDto);
      booth = await booth.save();
    } catch(err) {
      throw new BoothInfoUpdateFailedException();
    }

    return booth;
  }

  async updateBoothStatus(id: number, updateBoothStatusDto: UpdateBoothStatusDTO, callerAccountId: number): Promise<ISuccessResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothStatusDto);
      await booth.save();
    } catch(err) {
      throw new BoothStatusUpdateFailedException();
    }

    return SUCCESS_RESPONSE;
  }

  async remove(id: number, callerAccountId: number): Promise<ISuccessResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);
    return await removeTarget(booth);
  }
}
