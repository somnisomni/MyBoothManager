import { Module } from "@nestjs/common";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
  controllers: [
    GoodsCategoryController,
  ],
  providers: [
    GoodsCategoryService,
  ],
  exports: [
    GoodsCategoryService,
  ],
})
export class GoodsCategoryModule {}
