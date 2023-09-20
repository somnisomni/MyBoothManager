import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import { SuperAdmin } from "../auth/auth.guard";

@Controller("/admin/goods")
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /* Normal routes */
  @Post()
  async create(@Body() createGoodDto: CreateGoodsDTO) {
    return await this.goodsService.create(createGoodDto);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query("bId") boothId: string) {
    return await this.goodsService.findGoodsBelongsToBooth(+id, parseInt(boothId));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodDto: UpdateGoodsDTO) {
    return this.goodsService.update(+id, updateGoodDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string) {
    return await this.goodsService.remove(+id, parseInt(boothId));
  }

  /* Super admin routes */
  @SuperAdmin()
  @Get("all")
  async findAll() {
    return await this.goodsService.findAll();
  }
}
