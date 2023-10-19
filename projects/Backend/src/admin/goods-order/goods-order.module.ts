import { Module } from "@nestjs/common";
import { GoodsModule } from "../goods/goods.module";
import { GoodsOrderService } from "./goods-order.service";
import { GoodsOrderController } from "./goods-order.controller";

@Module({
  imports: [GoodsModule],
  controllers: [GoodsOrderController],
  providers: [GoodsOrderService],
  exports: [GoodsOrderService],
})
export class GoodsOrderModule {}
