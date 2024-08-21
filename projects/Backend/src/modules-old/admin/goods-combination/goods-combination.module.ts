import { Module } from "@nestjs/common";
import { UtilModule } from "../util/util.module";
import { GoodsCombinationController } from "./goods-combination.controller";
import { GoodsCombinationService } from "./goods-combination.service";

@Module({
  imports: [
    UtilModule,
  ],
  controllers: [
    GoodsCombinationController,
  ],
  providers: [
    GoodsCombinationService,
  ],
  exports: [
    GoodsCombinationService,
  ],
})
export class GoodsCombinationModule {}
