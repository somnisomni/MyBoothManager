import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import Goods from "@/db/models/goods";
import { BaseError } from "sequelize";
import { IStatusOKResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, STATUS_OK_RESPONSE } from "@myboothmanager/common";

@Injectable()
export class GoodsService {
  async findGoodsBelongsToBooth(goodsId: number, boothId: number): Promise<Goods> {
    const goods = await Goods.findByPk(goodsId);

    if(!goods) throw new NotFoundException("굿즈를 찾을 수 없습니다.");
    else if(goods.boothId !== boothId) throw new BadRequestException("해당 굿즈는 해당 부스에 속해있지 않습니다.");
    else return goods;
  }

  async create(createGoodsDto: CreateGoodsDTO): Promise<Goods> {
    if(createGoodsDto.stockRemaining === undefined) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    try {
      return await Goods.create(createGoodsDto);
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB 오류");
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findAll(boothId?: number): Promise<Array<Goods>> {
    const where = boothId ? { boothId } : undefined;

    return await Goods.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;

    return { value: await Goods.count({ where }) };
  }

  update(id: number, updateGoodDto: UpdateGoodsDTO) {
    throw new BadRequestException("Goods update is not yet supported.");
  }

  async remove(id: number, boothId: number): Promise<IStatusOKResponse> {
    const goods = await this.findGoodsBelongsToBooth(id, boothId);

    try {
      await goods.destroy();
      await goods.save();
    } catch(err) {
      throw new InternalServerErrorException("굿즈를 삭제할 수 없습니다.");
    }

    return STATUS_OK_RESPONSE;
  }
}
