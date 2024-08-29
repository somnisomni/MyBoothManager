import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UtilModule } from "../common/util/util.module";
import { AuthGuard } from "./auth/auth.guard";
import AccountModule from "./account/account.module";
import AuthModule from "./auth/auth.module";
import BoothModule from "./booth/booth.module";
import BoothOrderModule from "./booth-order/booth-order.module";
import FairModule from "./fair/fair.module";
import GoodsModule from "./goods/goods.module";
import GoodsCategoryModule from "./goods-category/goods-category.module";
import GoodsCombinationModule from "./goods-combination/goods-combination.module";

@Module({
  imports: [
    AccountModule,
    AuthModule,
    BoothModule,
    BoothOrderModule,
    FairModule,
    GoodsModule,
    GoodsCategoryModule,
    GoodsCombinationModule,
    UtilModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModuleV2 { }
