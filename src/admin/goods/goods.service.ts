import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import { Goods } from "./entities/goods.entity";
import { goodsList } from "@/dev/temp-data";

@Injectable()
export class GoodsService {
  create(createGoodDto: CreateGoodsDTO) {
    throw new BadRequestException("Goods creation is not yet supported.");
  }

  findAll(): Array<Goods> {
    return Object.values(goodsList);
  }

  findOne(id: number): Goods {
    if(!goodsList[id]) throw new BadRequestException("Goods not found.");

    return goodsList[id];
  }

  update(id: number, updateGoodDto: UpdateGoodsDTO) {
    throw new BadRequestException("Goods update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods deletion is not yet supported.");
  }
}
