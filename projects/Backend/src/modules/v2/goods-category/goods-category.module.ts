import { forwardRef, Module } from "@nestjs/common";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";
import BoothModule from "../booth/booth.module";

@Module({
  imports: [forwardRef(() => BoothModule)],
  providers: [GoodsCategoryService],
  controllers: [GoodsCategoryController],
  exports: [GoodsCategoryService],
})
export default class GoodsCategoryModule { }
