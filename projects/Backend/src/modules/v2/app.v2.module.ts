import { Module, type Type } from "@nestjs/common";
import { APP_GUARD, RouterModule, type RouteTree } from "@nestjs/core";
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
import BoothMemberModule from "./booth-member/booth-member.module";
import { V2_ROUTE_PREFIX } from "@/lib/const";

const API_MODULES: Type<unknown>[] = [
  AccountModule,
  AuthModule,
  BoothModule,
  BoothMemberModule,
  BoothOrderModule,
  FairModule,
  GoodsModule,
  GoodsCategoryModule,
  GoodsCombinationModule,
  UtilModule,
];

function generateRouterModuleChildrens(rootPath = "/"): RouteTree[] {
  return (API_MODULES ?? []).map((module) => ({
    path: rootPath,
    module,
  }));
}

@Module({
  imports: [
    ...API_MODULES,

    RouterModule.register([
      {
        path: V2_ROUTE_PREFIX,
        children: [
          ...generateRouterModuleChildrens(),
        ],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModuleV2 { }
