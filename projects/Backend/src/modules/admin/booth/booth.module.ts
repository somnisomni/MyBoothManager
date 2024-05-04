import { Module } from "@nestjs/common";
import { PublicBoothModule } from "@/modules/public/booth/booth.module";
import { PublicBoothMemberModule } from "@/modules/public/booth-member/booth-member.module";
import { PublicGoodsModule } from "@/modules/public/goods/goods.module";
import { PublicGoodsCombinationModule } from "@/modules/public/goods-combination/goods-combination.module";
import { PublicGoodsCategoryModule } from "@/modules/public/goods-category/goods-category.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { UtilModule } from "../util/util.module";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";

@Module({
  imports: [
    PublicBoothModule,
    PublicBoothMemberModule,
    PublicGoodsModule,
    PublicGoodsCombinationModule,
    PublicGoodsCategoryModule,
    GoodsOrderModule,
    UtilModule,
  ],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
