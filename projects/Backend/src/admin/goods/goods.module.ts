import { Module } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";

@Module({
  controllers: [
    GoodsController,
  ],
  providers: [
    GoodsService,
  ],
  exports: [
    GoodsService,
  ],
})
export class GoodsModule {}
