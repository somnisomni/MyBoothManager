import { forwardRef, Module } from "@nestjs/common";
import { UtilModule } from "@/modules/common/util/util.module";
import BoothModule from "../booth/booth.module";
import { GoodsCombinationController } from "./goods-combination.controller";
import { GoodsCombinationImageController } from "./goods-combination.image.controller";
import { GoodsCombinationImageService } from "./goods-combination.image.service";
import { GoodsCombinationService } from "./goods-combination.service";

@Module({
  imports: [
    forwardRef(() => BoothModule),
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
