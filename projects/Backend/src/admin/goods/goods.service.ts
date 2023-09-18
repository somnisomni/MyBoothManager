import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import Goods from "@/db/models/goods";
import { BaseError } from "sequelize";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";

@Injectable()
export class GoodsService {
  async create(createGoodsDto: CreateGoodsDTO): Promise<Goods> {
    if(createGoodsDto.stockRemaining === undefined) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    try {
      const response = await Goods.create(createGoodsDto);

      return response;
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB 오류");
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findAll(): Promise<Array<Goods>> {
    return await Goods.findAll({
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findOne(id: number): Promise<Goods> {
    const goods = await Goods.findByPk(id, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!goods) throw new BadRequestException("굿즈를 찾을 수 없습니다.");
    return goods;
  }

  update(id: number, updateGoodDto: UpdateGoodsDTO) {
    throw new BadRequestException("Goods update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods deletion is not yet supported.");
  }
}
