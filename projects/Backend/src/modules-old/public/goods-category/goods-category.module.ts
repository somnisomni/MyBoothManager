import { Module } from "@nestjs/common";
import { PublicGoodsCategoryController } from "./goods-category.controller";
import { PublicGoodsCategoryService } from "./goods-category.service";

@Module({
  controllers: [PublicGoodsCategoryController],
  providers: [PublicGoodsCategoryService],
  exports: [PublicGoodsCategoryService],
})
export class PublicGoodsCategoryModule {}
