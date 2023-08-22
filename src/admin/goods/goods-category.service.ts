import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";
import GoodsCategory, { IGoodsCategory } from "@/db/models/goods-category";
import { OmitInternals } from "@/lib/interface-omit";

type GoodsCategoryOutput = OmitInternals<IGoodsCategory>;

@Injectable()
export class GoodsCategoryService {
  create(createGoodsCategoryDto: CreateGoodsCategoryDTO) {
    throw new BadRequestException("Goods category creation is not yet supported.");
  }

  async findAll(): Promise<Array<GoodsCategoryOutput>> {
    return (await GoodsCategory.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<GoodsCategoryOutput>;
  }

  async findOne(id: number): Promise<GoodsCategoryOutput> {
    const category = await GoodsCategory.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    }) as GoodsCategoryOutput;

    if(!category) throw new BadRequestException("Goods category not found.");
    return category;
  }

  update(id: number, updateGoodsCategoryDTO: UpdateGoodsCategoryDTO) {
    throw new BadRequestException("Goods category update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Goods category deletion is not yet supported.");
  }
}
