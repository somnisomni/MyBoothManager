import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BaseError } from "sequelize";
import { IStatusOKResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, STATUS_OK_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import { GoodsService } from "../goods/goods.service";
import { GoodsCategoryService } from "../goods/goods-category.service";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";

@Injectable()
export class BoothService {
  constructor(private goodsService: GoodsService, private goodsCategoryService: GoodsCategoryService) {}

  async findBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    const booth = await Booth.findByPk(boothId);

    if(!booth) throw new NotFoundException("부스를 찾을 수 없습니다.");
    else if(booth.ownerId !== accountId) throw new BadRequestException("부스에 대한 권한이 없습니다.");
    else return booth;
  }

  async create(createBoothDto: CreateBoothDTO, ownerId: number): Promise<Booth> {
    try {
      return await Booth.create({
        ...createBoothDto,
        ownerId,
      });
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB 오류");
      } else {
        throw new BadRequestException();
      }
    }
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

  async updateBoothInfo(id: number, updateBoothDto: UpdateBoothDTO, callerAccountId: number): Promise<Booth> {
    let booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothDto);
      booth = await booth.save();
    } catch(err) {
      throw new InternalServerErrorException("부스 정보를 수정할 수 없습니다.");
    }

    return booth;
  }

  async updateBoothStatus(id: number, updateBoothStatusDto: UpdateBoothStatusDTO, callerAccountId: number): Promise<IStatusOKResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothStatusDto);
      await booth.save();
    } catch(err) {
      throw new InternalServerErrorException("부스 상태를 수정할 수 없습니다.");
    }

    return STATUS_OK_RESPONSE;
  }

  async remove(id: number, callerAccountId: number): Promise<IStatusOKResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.destroy();
      await booth.save();
    } catch(err) {
      throw new InternalServerErrorException("부스를 삭제할 수 없습니다.");
    }

    return STATUS_OK_RESPONSE;
  }
}
