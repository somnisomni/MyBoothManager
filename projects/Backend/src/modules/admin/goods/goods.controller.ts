import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { PublicGoodsService } from "@/modules/public/goods/goods.service";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";

@Controller("/admin/goods")
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly publicGoodsService: PublicGoodsService) {}

  /* Normal routes */
  @Post()
  async create(@Body() createGoodDto: CreateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.create(createGoodDto, authData.id);
  }

  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() updateGoodsDto: UpdateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.updateInfo(+id, updateGoodsDto, authData.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.remove(+id, parseInt(boothId), authData.id);
  }

  /* === Will be replaced with public routes === */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsService.findOne(+id);
  }
  /* === === */

  /* SuperAdmin routes */
  @SuperAdmin()
  @Get()
  async findAll() {
    return await this.goodsService.findAll();
  }

  @SuperAdmin()
  @Get("count")
  async countAll() {
    return await this.goodsService.countAll();
  }
}
