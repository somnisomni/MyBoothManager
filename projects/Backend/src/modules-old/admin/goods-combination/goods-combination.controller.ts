import type { FastifyRequest } from "fastify";
import { Controller, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { AuthData, AdminAuthGuard } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { CreateGoodsCombinationRequestDto } from "./dto/create-goods-combination.dto";
import { UpdateGoodsCombinationRequestDto } from "./dto/update-goods-combination.dto";
import { GoodsCombinationService } from "./goods-combination.service";
import { AdminGoodsCombinationResponseDto } from "./dto/goods-combination.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods/combination")
export class GoodsCombinationController {
  constructor(
    private readonly goodsCombinationService: GoodsCombinationService,
    private readonly utilService: UtilService,
  ) {}

  /* Normal routes */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateGoodsCombinationRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminGoodsCombinationResponseDto> {
    return new AdminGoodsCombinationResponseDto(await this.goodsCombinationService.create(dto, authData.id));
  }

  @Post(":id/image")
  async uploadBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.uploadImage(+id, +boothId, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/image")
  async removeBannerImage(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.deleteImage(+id, +boothId, authData.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async updateInfo(@Param("id") id: string, @Body() dto: UpdateGoodsCombinationRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminGoodsCombinationResponseDto> {
    return new AdminGoodsCombinationResponseDto(await this.goodsCombinationService.updateInfo(+id, dto, authData.id));
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsCombinationService.remove(+id, +boothId, authData.id);
  }
}
