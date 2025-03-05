import { forwardRef, Module } from "@nestjs/common";
import BoothModule from "../booth/booth.module";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
  imports: [ forwardRef(() => BoothModule) ],
  providers: [ GoodsCategoryService ],
  controllers: [ GoodsCategoryController ],
  exports: [ GoodsCategoryService ],
})
export default class GoodsCategoryModule { }
