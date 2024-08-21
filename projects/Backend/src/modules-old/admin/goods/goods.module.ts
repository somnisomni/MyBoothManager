import { Module } from "@nestjs/common";
import { PublicGoodsModule } from "@/modules/public/goods/goods.module";
import { UtilModule } from "../util/util.module";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";

@Module({
  imports: [
    PublicGoodsModule,
    UtilModule,
  ],
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
