import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "@/modules/admin/auth/auth.guard";
import { PublicGoodsService } from "./goods.service";

@Public()
@Controller("/public/goods")
export class PublicGoodsController {
  constructor(private readonly publicGoodsService: PublicGoodsService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsService.findOne(+id);
  }
}
