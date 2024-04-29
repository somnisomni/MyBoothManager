import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsCategoryService } from "./goods-category.service";
import { GoodsCategoryResponseDto } from "./dto/goods-category.dto";

@Controller("/public/goods/category")
export class PublicGoodsCategoryController {
  constructor(private readonly publicGoodsCategoryService: PublicGoodsCategoryService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<GoodsCategoryResponseDto> {
    return new GoodsCategoryResponseDto((await this.publicGoodsCategoryService.findOne(+id)).get());
  }
}
