import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import Goods from "@/db/models/goods";
import { BaseError } from "sequelize";
import { IGoodsResponse } from "myboothmanager-common/interfaces";

@Injectable()
export class GoodsService {
  async create(createGoodsDto: CreateGoodsDTO): Promise<IGoodsResponse> {
    if(createGoodsDto.stockRemaining === undefined) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    try {
      const response = (await Goods.create(createGoodsDto)) as IGoodsResponse;

      return response;
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB error");
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findAll(): Promise<Array<IGoodsResponse>> {
    return (await Goods.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<IGoodsResponse>;
  }

  async findOne(id: number): Promise<IGoodsResponse> {
    const goods = await Goods.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    }) as IGoodsResponse;

    if(!goods) throw new BadRequestException("Goods not found.");
    return goods;
  }

  update(id: number, updateGoodDto: UpdateGoodsDTO) {
    throw new BadRequestException("Goods update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods deletion is not yet supported.");
  }
}
