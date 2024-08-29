import { Controller } from "@nestjs/common";
import { GoodsCategoryService } from "./goods-category.service";

@Controller("/goods/category")
export class GoodsCategoryController {
  constructor(
    private readonly category: GoodsCategoryService,
  ) { }
}
