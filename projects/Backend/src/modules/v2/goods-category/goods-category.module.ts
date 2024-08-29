import { Module } from "@nestjs/common";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
  providers: [GoodsCategoryService],
  controllers: [GoodsCategoryController],
  exports: [GoodsCategoryService],
})
export default class GoodsCategoryModule { }
