import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { BoothModule } from "./booth/booth.module";
import { GoodsModule } from "./goods/goods.module";
import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/auth.guard";

@Module({
  imports: [
    AccountModule,
    AuthModule,
    BoothModule,
    GoodsModule,
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
