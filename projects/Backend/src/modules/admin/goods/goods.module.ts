import { Module } from "@nestjs/common";
import { PublicGoodsModule } from "@/modules/public/goods/goods.module";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";

@Module({
  imports: [
    PublicGoodsModule,
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
