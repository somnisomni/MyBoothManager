import { Module } from "@nestjs/common";
import { PublicGoodsCombinationController } from "./goods-combination.controller";
import { PublicGoodsCombinationService } from "./goods-combination.service";

@Module({
  controllers: [PublicGoodsCombinationController],
  providers: [PublicGoodsCombinationService],
  exports: [PublicGoodsCombinationService],
})
export class PublicGoodsCombinationModule {}
