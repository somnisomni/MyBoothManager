import { UtilModule } from "@/modules/common/util/util.module";
import { Module } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";
import { GoodsImageService } from "./goods.image.service";
import { GoodsImageController } from "./goods.image.controller";

@Module({
  imports: [UtilModule],
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
