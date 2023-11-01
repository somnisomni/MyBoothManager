import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { AuthData } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsCategoryService } from "./goods-category.service";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";

@Controller("/admin/goods/category")
export class GoodsCategoryController {
  constructor(private readonly goodsCategoryService: GoodsCategoryService) {}

  @Post()
  create(@Body() createGoodsCategoryDto: CreateGoodsCategoryDTO) {
    return this.goodsCategoryService.create(createGoodsCategoryDto);
  }

  @Get()
  async findAll(@Query("bId") boothId: string) {
    return await this.goodsCategoryService.findAll(parseInt(boothId));
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.goodsCategoryService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodsCategoryDTO: UpdateGoodsCategoryDTO, @AuthData() authData: IAuthPayload) {
    return this.goodsCategoryService.updateInfo(+id, updateGoodsCategoryDTO, authData.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.goodsCategoryService.remove(+id);
  }
}
