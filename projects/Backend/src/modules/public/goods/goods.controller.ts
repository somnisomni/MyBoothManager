import { Controller, Get, Param } from "@nestjs/common";
import { PublicGoodsService } from "./goods.service";

@Controller("/public/goods")
export class PublicGoodsController {
  constructor(private readonly publicGoodsService: PublicGoodsService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsService.findOne(+id);
  }
}
