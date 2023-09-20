import { Module, forwardRef } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";
import { GoodsModule } from "../goods/goods.module";

@Module({
  imports: [GoodsModule],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
