import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsService } from "./goods.service";
import { GoodsResponseDto } from "./dto/goods.dto";

@Controller("/public/goods")
export class PublicGoodsController {
  constructor(private readonly publicGoodsService: PublicGoodsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<GoodsResponseDto> {
    return new GoodsResponseDto((await this.publicGoodsService.findOne(+id)).getForPublic());
  }
}
