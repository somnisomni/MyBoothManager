import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PublicGoodsCategoryService } from "@/modules/public/goods-category/goods-category.service";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsCategoryService } from "./goods-category.service";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";

@Controller("/admin/goods/category")
export class GoodsCategoryController {
  constructor(
    private readonly goodsCategoryService: GoodsCategoryService,
    private readonly publicGoodsCategoryService: PublicGoodsCategoryService) {}

  @Post()
  create(@Body() createGoodsCategoryDto: CreateGoodsCategoryDTO) {
    return this.goodsCategoryService.create(createGoodsCategoryDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodsCategoryDTO: UpdateGoodsCategoryDTO, @AuthData() authData: IAuthPayload) {
    return this.goodsCategoryService.updateInfo(+id, updateGoodsCategoryDTO, authData.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.goodsCategoryService.remove(+id);
  }

  /* === Will be replaced with public routes === */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicGoodsCategoryService.findOne(+id);
  }
  /* === === */

  /* SuperAdmin routes */
  @SuperAdmin()
  @Get()
  async findAll() {
    return await this.goodsCategoryService.findAll();
  }

  @SuperAdmin()
  @Get("count")
  async countAll() {
    return await this.goodsCategoryService.countAll();
  }
}
