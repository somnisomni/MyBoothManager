import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";

@Controller("/admin/goods")
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  create(@Body() createGoodDto: CreateGoodsDTO) {
    return this.goodsService.create(createGoodDto);
  }

  @Get()
  findAll() {
    return this.goodsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.goodsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodDto: UpdateGoodsDTO) {
    return this.goodsService.update(+id, updateGoodDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.goodsService.remove(+id);
  }
}
