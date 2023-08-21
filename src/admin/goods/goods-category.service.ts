import { BadRequestException, Injectable } from "@nestjs/common";
import { GoodsCategory } from "./entities/goods.entity";
import { goodsCategoryList } from "@/dev/temp-data";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";

@Injectable()
export class GoodsCategoryService {
  create(createGoodsCategoryDto: CreateGoodsCategoryDTO) {
    throw new BadRequestException("Goods category creation is not yet supported.");
  }

  findAll(): Array<GoodsCategory> {
    return Object.values(goodsCategoryList);
  }

  findOne(id: number): GoodsCategory {
    if(!goodsCategoryList[id]) throw new BadRequestException("Goods category not found.");

    return goodsCategoryList[id];
  }

  update(id: number, updateGoodsCategoryDTO: UpdateGoodsCategoryDTO) {
    throw new BadRequestException("Goods category update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods category deletion is not yet supported.");
  }
}
