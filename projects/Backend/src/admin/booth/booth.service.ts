import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import Booth from "@/db/models/booth";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import { GoodsCategoryOutput } from "../goods/goods-category.entity";
import { BoothOutput } from "./booth.entity";
import { BaseError } from "sequelize";
import { IGoodsResponse } from "@myboothmanager/common";

@Injectable()
export class BoothService {
  async create(ownerId: number, createBoothDto: CreateBoothDTO): Promise<BoothOutput> {
    try {
      return (await Booth.create({
        ...createBoothDto,
        ownerId,
      }));
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB error");
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findAll(): Promise<Array<BoothOutput>> {
    return (await Booth.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<BoothOutput>;
  }

  async findOne(id: number): Promise<BoothOutput> {
    const booth = await Booth.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    }) as BoothOutput;

    if(!booth) throw new BadRequestException("Booth not found.");
    return booth;
  }

  async findAllBoothGoods(boothId: number): Promise<Array<IGoodsResponse>> {
    return (await Goods.findAll({
      where: { boothId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<IGoodsResponse>;
  }

  async findAllBoothGoodsCategory(boothId: number): Promise<Array<GoodsCategoryOutput>> {
    return (await GoodsCategory.findAll({
      where: { boothId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<GoodsCategoryOutput>;
  }

  update(id: number, updateBoothDto: UpdateBoothDTO) {
    throw new BadRequestException("Booth update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Booth deletion is not yet supported.");
  }
}
