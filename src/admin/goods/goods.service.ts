import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import Goods from "@/db/models/goods";
import { OmitInternals } from "@/lib/interface-omit";

type GoodsOutput = OmitInternals<Goods>;

@Injectable()
export class GoodsService {
  create(createGoodDto: CreateGoodsDTO) {
    throw new BadRequestException("Goods creation is not yet supported.");
  }

  async findAll(): Promise<Array<GoodsOutput>> {
    return (await Goods.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<GoodsOutput>;
  }

  async findOne(id: number): Promise<GoodsOutput> {
    const goods = await Goods.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    }) as GoodsOutput;

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
