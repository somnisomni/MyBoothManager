import { Module } from "@nestjs/common";
import { GoodsModule } from "../goods/goods.module";
import { GoodsCombinationModule } from "../goods-combination/goods-combination.module";
import { GoodsOrderService } from "./goods-order.service";
import { GoodsOrderController } from "./goods-order.controller";

@Module({
  imports: [GoodsModule, GoodsCombinationModule],
  controllers: [GoodsOrderController],
  providers: [GoodsOrderService],
  exports: [GoodsOrderService],
})
export class GoodsOrderModule {}
