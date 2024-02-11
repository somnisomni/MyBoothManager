import { Controller, Get, Param } from "@nestjs/common";
import { PublicGoodsCombinationService } from "./goods-combination.service";

@Controller("/public/goods/combination")
export class PublicGoodsCombinationController {
  constructor(private readonly publicGoodsCombinationService: PublicGoodsCombinationService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsCombinationService.findOne(+id);
  }
}
