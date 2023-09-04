import { Module } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
  controllers: [
    GoodsController,
    GoodsCategoryController,
  ],
  providers: [
    GoodsService,
    GoodsCategoryService,
  ],
})
export class GoodsModule {}
