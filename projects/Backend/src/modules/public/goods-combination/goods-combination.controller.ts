import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "@/modules/admin/auth/auth.guard";
import { PublicGoodsCombinationService } from "./goods-combination.service";

@Public()
@Controller("/public/goods/combination")
export class PublicGoodsCombinationController {
  constructor(private readonly publicGoodsCombinationService: PublicGoodsCombinationService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsCombinationService.findOne(+id);
  }
}
