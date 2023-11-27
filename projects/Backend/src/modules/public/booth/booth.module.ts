import { Module } from "@nestjs/common";
import { PublicGoodsModule } from "../goods/goods.module";
import { PublicGoodsCategoryModule } from "../goods-category/goods-category.module";
import { PublicBoothService } from "./booth.service";
import { PublicBoothController } from "./booth.controller";

@Module({
  imports: [
    PublicGoodsModule,
    PublicGoodsCategoryModule,
  ],
  controllers: [PublicBoothController],
  providers: [PublicBoothService],
  exports: [PublicBoothService],
})
export class PublicBoothModule {}
