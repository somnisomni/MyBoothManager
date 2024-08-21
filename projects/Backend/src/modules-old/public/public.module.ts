import { Module } from "@nestjs/common";
import { PublicBoothModule } from "./booth/booth.module";
import { PublicGoodsModule } from "./goods/goods.module";
import { PublicGoodsCategoryModule } from "./goods-category/goods-category.module";
import { PublicGoodsCombinationModule } from "./goods-combination/goods-combination.module";
import { PublicBoothMemberModule } from "./booth-member/booth-member.module";
import { PublicFairModule } from "./fair/fair.module";
import { SupportModule } from "./support/support.module";

@Module({
  imports: [
    PublicFairModule,
    PublicBoothModule,
    PublicBoothMemberModule,
    PublicGoodsModule,
    PublicGoodsCategoryModule,
    PublicGoodsCombinationModule,
    SupportModule,
  ],
  controllers: [],
  providers: [],
})
export class PublicModule { }
