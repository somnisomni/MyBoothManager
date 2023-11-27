import { Module } from "@nestjs/common";
import { PublicGoodsService } from "./goods.service";
import { PublicGoodsController } from "./goods.controller";

@Module({
  controllers: [PublicGoodsController],
  providers: [PublicGoodsService],
  exports: [PublicGoodsService],
})
export class PublicGoodsModule {}
