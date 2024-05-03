import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsCombinationService } from "./goods-combination.service";
import { PublicGoodsCombinationResponseDto } from "./dto/goods-combination.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/public/goods/combination")
export class PublicGoodsCombinationController {
  constructor(private readonly publicGoodsCombinationService: PublicGoodsCombinationService) {}

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicGoodsCombinationResponseDto> {
    return new PublicGoodsCombinationResponseDto(await this.publicGoodsCombinationService.findOne(+id));
  }
}
