import type { FastifyRequest } from "fastify";
import { Controller, Post, Body, Patch, Param, Delete, Query, Req } from "@nestjs/common";
import { AuthData } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { CreateGoodsCombinationDTO } from "./dto/create-goods-combination.dto";
import { UpdateGoodsCombinationDTO } from "./dto/update-goods-combination.dto";
import { GoodsCombinationService } from "./goods-combination.service";

@Controller("/admin/goods/combination")
export class GoodsCombinationController {
  constructor(
    private readonly goodsCombinationService: GoodsCombinationService,
    private readonly utilService: UtilService,
  ) {}

  /* Normal routes */
  @Post()
  async create(@Body() dto: CreateGoodsCombinationDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.create(dto, authData.id);
  }

  @Post(":id/image")
  async uploadBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.uploadImage(+id, +boothId, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/image")
  async removeBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.deleteImage(+id, +boothId, authData.id);
  }

  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() dto: UpdateGoodsCombinationDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.updateInfo(+id, dto, authData.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.remove(+id, +boothId, authData.id);
  }
}
