import { forwardRef, Module } from "@nestjs/common";
import { UtilModule } from "@/modules/common/util/util.module";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";
import { BoothImageService } from "./booth.image.service";
import { BoothImageController } from "./booth.image.controller";
import GoodsModule from "../goods/goods.module";
import GoodsCategoryModule from "../goods-category/goods-category.module";
import GoodsCombinationModule from "../goods-combination/goods-combination.module";
import { BoothIndividualController } from "./booth.individual.controller";

@Module({
  imports: [
    forwardRef(() => GoodsModule),
    forwardRef(() => GoodsCategoryModule),
    forwardRef(() => GoodsCombinationModule),
    UtilModule,
  ],
  providers: [
    BoothService,
    BoothImageService,
  ],
  controllers: [
    BoothController,
    BoothIndividualController,
    BoothImageController,
  ],
  exports: [
    BoothService,
    // BoothImageService,
  ],
})
export default class BoothModule { }
