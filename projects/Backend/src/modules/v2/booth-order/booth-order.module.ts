import { Module } from "@nestjs/common";
import { BoothOrderController } from "./booth-order.controller";
import { BoothOrderService } from "./booth-order.service";

@Module({
  providers: [BoothOrderService],
  controllers: [BoothOrderController],
})
export default class BoothOrderModule { }
