import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import { BaseError } from "sequelize";
import { IStatusOKResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, STATUS_OK_RESPONSE } from "@myboothmanager/common";
import { GoodsService } from "../goods/goods.service";
import { GoodsCategoryService } from "../goods/goods-category.service";

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

  update(id: number, updateBoothDto: UpdateBoothDTO) {
    throw new BadRequestException("Booth update is not yet supported.");
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
