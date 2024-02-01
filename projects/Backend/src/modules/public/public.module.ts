import { Module } from "@nestjs/common";
import { PublicBoothModule } from "./booth/booth.module";
import { PublicGoodsModule } from "./goods/goods.module";
import { PublicGoodsCategoryModule } from "./goods-category/goods-category.module";
import { PublicGoodsCombinationModule } from "./goods-combination/goods-combination.module";
import { PublicBoothMemberModule } from "./booth-member/booth-member.module";

@Module({
  imports: [
    PublicBoothModule,
    PublicBoothMemberModule,
    PublicGoodsModule,
    PublicGoodsCategoryModule,
    PublicGoodsCombinationModule,
  ],
  controllers: [],
  providers: [],
})
export class PublicModule {}
