import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { BoothModule } from "./booth/booth.module";
import { GoodsModule } from "./goods/goods.module";
import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/auth.guard";
import { GoodsOrderModule } from "./goods-order/goods-order.module";
import { GoodsCategoryModule } from "./goods-category/goods-category.module";
import { GoodsCombinationModule } from "./goods-combination/goods-combination.module";

@Module({
  imports: [
    AccountModule,
    AuthModule,
    BoothModule,
    GoodsModule,
    GoodsCategoryModule,
    GoodsOrderModule,
    GoodsCombinationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AdminModule {}
