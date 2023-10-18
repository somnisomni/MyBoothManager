import { Module } from "@nestjs/common";
import { GoodsOrderService } from "./goods-order.service";
import { GoodsOrderController } from "./goods-order.controller";

@Module({
  controllers: [GoodsOrderController],
  providers: [GoodsOrderService],
  exports: [GoodsOrderService],
})
export class GoodsOrderModule {}
