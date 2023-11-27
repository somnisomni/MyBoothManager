import { Module } from "@nestjs/common";
import { PublicBoothModule } from "@/modules/public/booth/booth.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";

@Module({
  imports: [
    PublicBoothModule,
    GoodsOrderModule,
  ],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
