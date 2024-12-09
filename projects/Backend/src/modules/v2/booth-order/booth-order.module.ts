import { Module } from "@nestjs/common";
import { BoothOrderController } from "./booth-order.controller";
import { BoothOrderService } from "./booth-order.service";
import GoodsModule from "../goods/goods.module";
import GoodsCombinationModule from "../goods-combination/goods-combination.module";
import BoothModule from "../booth/booth.module";

@Module({
  imports: [
    BoothModule,
    GoodsModule,
    GoodsCombinationModule,
  ],
  providers: [BoothOrderService],
  controllers: [BoothOrderController],
})
export default class BoothOrderModule { }
