import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import { BaseError } from "sequelize";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";

@Injectable()
export class BoothService {
  async findBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    const booth = await Booth.findByPk(boothId);

    if(!booth) throw new NotFoundException("부스를 찾을 수 없습니다.");
    else if(booth.ownerId !== accountId) throw new BadRequestException("부스에 대한 권한이 없습니다.");
    else return booth;
  }

  async create(ownerId: number, createBoothDto: CreateBoothDTO): Promise<Booth> {
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

  async findAllForAccountId(ownerId: number): Promise<Array<Booth>> {
    return await Booth.findAll({
      where: {
        ownerId,
      },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findOne(boothId: number, callerAccountId: number): Promise<Booth> {
    return await this.findBoothBelongsToAccount(boothId, callerAccountId);
  }

  async findAllGoodsOfBooth(boothId: number, callerAccountId: number): Promise<Array<Goods>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await Goods.findAll({
      where: { boothId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findAllGoodsCategoryOfBooth(boothId: number, callerAccountId: number): Promise<Array<GoodsCategory>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await GoodsCategory.findAll({
      where: { boothId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  update(id: number, updateBoothDto: UpdateBoothDTO) {
    throw new BadRequestException("Booth update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Booth deletion is not yet supported.");
  }
}
