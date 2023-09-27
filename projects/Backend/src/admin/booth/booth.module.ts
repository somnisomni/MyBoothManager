import { Module } from "@nestjs/common";
import { GoodsModule } from "../goods/goods.module";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";

@Module({
  imports: [GoodsModule],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
