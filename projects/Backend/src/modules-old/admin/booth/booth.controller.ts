import type { FastifyRequest } from "fastify";
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, ParseBoolPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { PublicBoothService } from "@/modules/public/booth/booth.service";
import { PublicBoothMemberService } from "@/modules/public/booth-member/booth-member.service";
import { PublicGoodsCombinationService } from "@/modules/public/goods-combination/goods-combination.service";
import { PublicGoodsCategoryService } from "@/modules/public/goods-category/goods-category.service";
import { PublicGoodsService } from "@/modules/public/goods/goods.service";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { AdminBoothMemberResponseDto } from "../booth-member/dto/booth-member.dto";
import { AdminGoodsResponseDto } from "../goods/dto/goods.dto";
import { AdminGoodsCombinationResponseDto } from "../goods-combination/dto/goods-combination.dto";
import { AdminGoodsCategoryResponseDto } from "../goods-category/dto/goods-category.dto";
import { GoodsOrderResponseDto } from "../goods-order/dto/goods-order.dto";
import { BoothService } from "./booth.service";
import { CreateBoothRequestDto } from "./dto/create-booth.dto";
import { UpdateBoothRequestDto } from "./dto/update-booth.dto";
import { UpdateBoothStatusRequestDto } from "./dto/update-booth-status.dto";
import { AdminBoothResponseDto } from "./dto/booth.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/booth")
export class BoothController {
  constructor(
    private readonly boothService: BoothService,
    private readonly publicBoothService: PublicBoothService,
    private readonly publicBoothMemberService: PublicBoothMemberService,
    private readonly publicGoodsService: PublicGoodsService,
    private readonly publicGoodsCombinationService: PublicGoodsCombinationService,
    private readonly publicGoodsCategoryService: PublicGoodsCategoryService,
    private readonly utilService: UtilService) {}

  /* Normal routes */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllForCurrentAccount(@AuthData() authData: IAuthPayload): Promise<Array<AdminBoothResponseDto>> {
    return (await this.publicBoothService.findAll(authData.id))
      .map((booth) => new AdminBoothResponseDto(booth));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string,
                @Query("setLast", new ParseBoolPipe({ optional: true })) setLast: boolean | null | undefined,
                @AuthData() authData: IAuthPayload): Promise<AdminBoothResponseDto> {
    return new AdminBoothResponseDto(await this.boothService.findOne(+id, setLast, authData.id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/member")
  async findAllBoothMember(@Param("id") boothId: string): Promise<Array<AdminBoothMemberResponseDto>> {
    return (await this.publicBoothMemberService.findAll(+boothId, true))
      .map((member) => new AdminBoothMemberResponseDto(member));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string): Promise<Array<AdminGoodsResponseDto>> {
    return (await this.publicGoodsService.findAll(+boothId, true))
      .map((goods) => new AdminGoodsResponseDto(goods));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/combination")
  async findAllBoothGoodsCombination(@Param("id") boothId: string):Promise<Array<AdminGoodsCombinationResponseDto>> {
    return (await this.publicGoodsCombinationService.findAll(+boothId, true))
      .map((combination) => new AdminGoodsCombinationResponseDto(combination));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string): Promise<Array<AdminGoodsCategoryResponseDto>> {
    return (await this.publicGoodsCategoryService.findAll(+boothId, true))
      .map((category) => new AdminGoodsCategoryResponseDto(category));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/order")
  async findAllBoothGoodsOrder(@Param("id") boothId: string, @AuthData() authData: IAuthPayload): Promise<Array<GoodsOrderResponseDto>> {
    return (await this.boothService.findAllGoodsOrderOfBooth(+boothId, authData.id))
      .map((order) => new GoodsOrderResponseDto(order));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createAdminDto: CreateBoothRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminBoothResponseDto> {
    return new AdminBoothResponseDto(await this.boothService.create(createAdminDto, authData.id));
  }

  @Post(":id/banner")
  async uploadBannerImage(@Param("id") id: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.boothService.uploadBannerImage(+id, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/banner")
  async removeBannerImage(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.deleteBannerImage(+id, authData.id);
  }

  @Post(":id/infoimage")
  async uploadInfoImage(@Param("id") id: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.boothService.uploadInfoImage(+id, await this.utilService.getFileFromRequest(req), authData.id);
  }

  @Delete(":id/infoimage")
  async removeInfoImage(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.deleteInfoImage(+id, authData.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async updateBoothInfo(@Param("id") id: string, @Body() updateBoothDto: UpdateBoothRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminBoothResponseDto> {
    return new AdminBoothResponseDto(await this.boothService.updateBoothInfo(+id, updateBoothDto, authData.id));
  }

  @Patch(":id/status")
  async updateBoothStatus(@Param("id") id: string, @Body() updateBoothStatusDto: UpdateBoothStatusRequestDto, @AuthData() authData: IAuthPayload) {
    return await this.boothService.updateBoothStatus(+id, updateBoothStatusDto, authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Delete(":id")
  async remove(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.remove(+id, authData.id);
  }
}
