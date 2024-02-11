import { Controller, Get, Param } from "@nestjs/common";
import { PublicGoodsCategoryService } from "./goods-category.service";

@Controller("/public/goods/category")
export class PublicGoodsCategoryController {
  constructor(private readonly publicGoodsCategoryService: PublicGoodsCategoryService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsCategoryService.findOne(+id);
  }
}
