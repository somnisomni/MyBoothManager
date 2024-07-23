import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsCategoryService } from "./goods-category.service";
import { PublicGoodsCategoryResponseDto } from "./dto/goods-category.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/public/goods/category")
export class PublicGoodsCategoryController {
  constructor(private readonly publicGoodsCategoryService: PublicGoodsCategoryService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicGoodsCategoryResponseDto> {
    return new PublicGoodsCategoryResponseDto(await this.publicGoodsCategoryService.findOne(+id));
  }
}
