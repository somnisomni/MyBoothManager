import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";

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
  update(@Param("id") id: string, @Body() updateGoodDto: UpdateGoodsDTO) {
    return this.goodsService.update(+id, updateGoodDto);
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
