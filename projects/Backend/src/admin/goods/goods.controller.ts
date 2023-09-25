import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";

@Controller("/admin/goods")
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /* Normal routes */
  @Post()
  async create(@Body() createGoodDto: CreateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.create(createGoodDto, authData.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.findGoodsBelongsToBooth(+id, parseInt(boothId), authData.id);
  }

  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() updateGoodsDto: UpdateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.updateInfo(+id, updateGoodsDto, authData.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.remove(+id, parseInt(boothId), authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Get("all")
  async findAll() {
    return await this.goodsService.findAll();
  }
}
