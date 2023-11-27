import { Module } from "@nestjs/common";
import { PublicGoodsCategoryModule } from "@/modules/public/goods-category/goods-category.module";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
  imports: [
    PublicGoodsCategoryModule,
  ],
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
