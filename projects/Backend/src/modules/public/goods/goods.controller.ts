import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsService } from "./goods.service";
import { PublicGoodsResponseDto } from "./dto/goods.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/public/goods")
export class PublicGoodsController {
  constructor(private readonly publicGoodsService: PublicGoodsService) {}

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicGoodsResponseDto> {
    return new PublicGoodsResponseDto(await this.publicGoodsService.findOne(+id));
  }
}
