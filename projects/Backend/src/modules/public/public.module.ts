import { Module } from "@nestjs/common";
import { PublicBoothModule } from "./booth/booth.module";
import { PublicGoodsModule } from "./goods/goods.module";
import { PublicGoodsCategoryModule } from "./goods-category/goods-category.module";

@Module({
  imports: [
    PublicBoothModule,
    PublicGoodsModule,
    PublicGoodsCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class PublicModule {}
