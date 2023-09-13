import { Module } from "@nestjs/common";
import { BoothModule } from "./booth/booth.module";
import { GoodsModule } from "./goods/goods.module";
import { AccountModule } from "./account/account.module";

@Module({
  imports: [
    AccountModule,
    BoothModule,
    GoodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
