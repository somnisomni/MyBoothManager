import { Module } from "@nestjs/common";
import { PublicBoothModule } from "@/modules/public/booth/booth.module";
import { GoodsModule } from "../goods/goods.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { GoodsCategoryModule } from "../goods-category/goods-category.module";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";

@Module({
  imports: [
    PublicBoothModule,
    GoodsModule,
    GoodsCategoryModule,
    GoodsOrderModule,
  ],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
