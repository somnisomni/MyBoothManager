import { Injectable } from "@nestjs/common";
import { GoodsStockVisibility, GoodsWithoutAllStockInfoOmitKey, GoodsWithoutInitialStockInfoOmitKey, IGoods, IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import { deleteKeys, findOneByPk } from "@/lib/common-functions";

@Injectable()
export class PublicGoodsService {
  goodsPreprocess(goods: Goods): IGoods {
    const processed: IGoods = { ...goods.dataValues };
    processed.goodsImageUrl = goods.get("goodsImageUrl") ?? undefined;

    if(processed.stockVisibility === GoodsStockVisibility.HIDE_ALL) {
      deleteKeys(processed, GoodsWithoutAllStockInfoOmitKey);
    } else if(processed.stockVisibility === GoodsStockVisibility.SHOW_REMAINING_ONLY) {
      deleteKeys(processed, GoodsWithoutInitialStockInfoOmitKey);
    }

    return processed;
  }

  async findOne(goodsId: number): Promise<IGoods> {
    return this.goodsPreprocess((await findOneByPk(Goods, goodsId)));
  }

  async findAll(boothId?: number): Promise<Array<IGoods>> {
    const where = boothId ? { boothId } : undefined;
    const allGoods: Array<IGoods> = [];

    const raw = await Goods.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
    for(const goods of raw) {
      allGoods.push(this.goodsPreprocess(goods));
    }

    return allGoods;
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;
    return { value: await Goods.count({ where }) };
  }
}
