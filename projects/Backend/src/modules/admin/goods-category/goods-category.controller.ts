import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query } from "@nestjs/common";
import { PublicGoodsCategoryService } from "@/modules/public/goods-category/goods-category.service";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsCategoryService } from "./goods-category.service";
import { CreateGoodsCategoryRequestDto } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryRequestDto } from "./dto/update-goods-category.dto";
import { AdminGoodsCategoryResponseDto } from "./dto/goods-category.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods/category")
export class GoodsCategoryController {
  constructor(
    private readonly goodsCategoryService: GoodsCategoryService,
    private readonly publicGoodsCategoryService: PublicGoodsCategoryService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createGoodsCategoryDto: CreateGoodsCategoryRequestDto): Promise<AdminGoodsCategoryResponseDto> {
    return new AdminGoodsCategoryResponseDto(await this.goodsCategoryService.create(createGoodsCategoryDto));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodsCategoryDTO: UpdateGoodsCategoryRequestDto, @AuthData() authData: IAuthPayload) {
    return this.goodsCategoryService.updateInfo(+id, updateGoodsCategoryDTO, authData.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return this.goodsCategoryService.remove(+id, +boothId, authData.id);
  }

  /* SuperAdmin routes */
  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return (await this.publicGoodsCategoryService.findAll()).map((goodsCategory) => new AdminGoodsCategoryResponseDto(goodsCategory));
  }

  @SuperAdmin()
  @Get("count")
  async countAll() {
    return await this.publicGoodsCategoryService.countAll();
  }
}
