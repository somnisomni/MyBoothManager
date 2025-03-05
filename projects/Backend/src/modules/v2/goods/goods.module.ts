import { forwardRef, Module } from "@nestjs/common";
import { UtilModule } from "@/modules/common/util/util.module";
import BoothModule from "../booth/booth.module";
import { GoodsController } from "./goods.controller";
import { GoodsImageController } from "./goods.image.controller";
import { GoodsImageService } from "./goods.image.service";
import { GoodsService } from "./goods.service";

@Module({
  imports: [
    forwardRef(() => BoothModule),
    UtilModule,
  ],
  providers: [
    GoodsService,
    GoodsImageService,
  ],
  controllers: [
    GoodsController,
    GoodsImageController,
  ],
  exports: [
    GoodsService,
    // GoodsImageService,
  ],
})
export default class GoodsModule { }
