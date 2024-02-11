import type { FastifyRequest } from "fastify";
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { PublicGoodsService } from "@/modules/public/goods/goods.service";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { GoodsService } from "./goods.service";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods")
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly publicGoodsService: PublicGoodsService,
    private readonly utilService: UtilService) {}

  /* Normal routes */
  @Post()
  async create(@Body() createGoodDto: CreateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.create(createGoodDto, authData.id);
  }

  @Post(":id/image")
  async uploadBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.uploadImage(+id, +boothId, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/image")
  async removeBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.deleteImage(+id, +boothId, authData.id);
  }

  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() updateGoodsDto: UpdateGoodsDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.updateInfo(+id, updateGoodsDto, authData.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsService.remove(+id, +boothId, authData.id);
  }

  /* SuperAdmin routes */
  @SuperAdmin()
  @Get()
  async findAll() {
    return await this.publicGoodsService.findAll();
  }

  @SuperAdmin()
  @Get("count")
  async countAll() {
    return await this.publicGoodsService.countAll();
  }
}
