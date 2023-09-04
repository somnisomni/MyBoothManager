import { Module } from "@nestjs/common";
import { BoothModule } from "./booth/booth.module";
import { GoodsModule } from "./goods/goods.module";

@Module({
  imports: [
    BoothModule,
    GoodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
