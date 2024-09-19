import { Module } from "@nestjs/common";
import BoothModule from "../booth/booth.module";
import { UtilModule } from "@/modules/common/util/util.module";
import { GoodsCombinationService } from "./goods-combination.service";
import { GoodsCombinationController } from "./goods-combination.controller";
import { GoodsCombinationImageController } from "./goods-combination.image.controller";
import { GoodsCombinationImageService } from "./goods-combination.image.service";

@Module({
  imports: [
    BoothModule,
    UtilModule,
  ],
  providers: [
    GoodsCombinationService,
    GoodsCombinationImageService,
  ],
  controllers: [
    GoodsCombinationController,
    GoodsCombinationImageController,
  ],
  exports: [
    GoodsCombinationService,
    // GoodsCombinationImageService,
  ],
})
export default class GoodsCombinationModule { }
