import type { FastifyRequest } from "fastify";
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { PublicGoodsService } from "@/modules/public/goods/goods.service";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { GoodsService } from "./goods.service";
import { CreateGoodsRequestDto } from "./dto/create-goods.dto";
import { UpdateGoodsRequestDto } from "./dto/update-goods.dto";
import { AdminGoodsResponseDto } from "./dto/goods.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods")
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly publicGoodsService: PublicGoodsService,
    private readonly utilService: UtilService) {}

  /* Normal routes */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createGoodDto: CreateGoodsRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminGoodsResponseDto> {
    return new AdminGoodsResponseDto(await this.goodsService.create(createGoodDto, authData.id));
  }

  @Post(":id/image")
  async uploadImage(@Param("id") id: string, @Query("bId") boothId: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.uploadImage(+id, +boothId, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/image")
  async removeImage(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.deleteImage(+id, +boothId, authData.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() updateGoodsDto: UpdateGoodsRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminGoodsResponseDto> {
    return new AdminGoodsResponseDto(await this.goodsService.updateInfo(+id, updateGoodsDto, authData.id));
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.remove(+id, +boothId, authData.id);
  }

  /* SuperAdmin routes */
  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return (await this.publicGoodsService.findAll()).map((goods) => new AdminGoodsResponseDto(goods));
  }

  @SuperAdmin()
  @Get("count")
  async countAll() {
    return await this.publicGoodsService.countAll();
  }
}
