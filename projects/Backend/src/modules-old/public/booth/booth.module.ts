import { Module } from "@nestjs/common";
import { PublicGoodsModule } from "../goods/goods.module";
import { PublicGoodsCategoryModule } from "../goods-category/goods-category.module";
import { PublicGoodsCombinationModule } from "../goods-combination/goods-combination.module";
import { PublicBoothService } from "./booth.service";
import { PublicBoothController } from "./booth.controller";

@Module({
  imports: [
    PublicGoodsModule,
    PublicGoodsCategoryModule,
    PublicGoodsCombinationModule,
  ],
  controllers: [PublicBoothController],
  providers: [PublicBoothService],
  exports: [PublicBoothService],
})
export class PublicBoothModule {}
