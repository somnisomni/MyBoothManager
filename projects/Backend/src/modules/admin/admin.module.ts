import { Module } from "@nestjs/common";
import { BoothModule } from "./booth/booth.module";
import { GoodsModule } from "./goods/goods.module";
import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth/auth.module";
import { GoodsOrderModule } from "./goods-order/goods-order.module";
import { GoodsCategoryModule } from "./goods-category/goods-category.module";
import { GoodsCombinationModule } from "./goods-combination/goods-combination.module";
import { BoothMemberModule } from "./booth-member/booth-member.module";

@Module({
  imports: [
    AccountModule,
    AuthModule,
    BoothModule,
    BoothMemberModule,
    GoodsModule,
    GoodsCategoryModule,
    GoodsOrderModule,
    GoodsCombinationModule,
  ],
  controllers: [],
})
export class AdminModule {}
