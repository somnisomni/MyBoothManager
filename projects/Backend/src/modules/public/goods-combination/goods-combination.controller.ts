import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsCombinationService } from "./goods-combination.service";
import { GoodsCombinationResponseDto } from "./dto/goods-combination.dto";

@Controller("/public/goods/combination")
export class PublicGoodsCombinationController {
  constructor(private readonly publicGoodsCombinationService: PublicGoodsCombinationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<GoodsCombinationResponseDto> {
    return new GoodsCombinationResponseDto((await this.publicGoodsCombinationService.findOne(+id)).getForPublic());
  }
}
