import type { FastifyRequest } from "fastify";
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from "@nestjs/common";
import { PublicBoothService } from "@/modules/public/booth/booth.service";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { BoothService } from "./booth.service";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";
import { AddBoothMemberDTO } from "./dto/add-booth-member.dto";

@Controller("/admin/booth")
export class BoothController {
  constructor(
    private readonly boothService: BoothService,
    private readonly publicBoothService: PublicBoothService,
    private readonly utilService: UtilService) {}

  /* Normal routes */
  @Get()
  async findAllForCurrentAccount(@AuthData() authData: IAuthPayload) {
    return await this.publicBoothService.findAll(authData.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.findOne(+id, authData.id);
  }

  @Post()
  async create(@Body() createAdminDto: CreateBoothDTO, @AuthData() authData: IAuthPayload) {
    return await this.boothService.create(createAdminDto, authData.id);
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

  @Put(":id/member")
  async addMember(@Param("id") boothId: string, @Body() addBoothMemberDto: AddBoothMemberDTO, @AuthData() authData: IAuthPayload) {
    return await this.boothService.addMember(+boothId, addBoothMemberDto, authData.id);
  }

  @Delete(":id/member/:memberUuid")
  async removeMember(@Param("id") boothId: string, @Param("memberUuid") memberUuid: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.removeMember(+boothId, memberUuid, authData.id);
  }

  @Patch(":id")
  async updateBoothInfo(@Param("id") id: string, @Body() updateBoothDto: UpdateBoothDTO, @AuthData() authData: IAuthPayload) {
    return await this.boothService.updateBoothInfo(+id, updateBoothDto, authData.id);
  }

  @Patch(":id/status")
  async updateBoothStatus(@Param("id") id: string, @Body() updateBoothStatusDto: UpdateBoothStatusDTO, @AuthData() authData: IAuthPayload) {
    return await this.boothService.updateBoothStatus(+id, updateBoothStatusDto, authData.id);
  }

  @Get(":id/goods/order")
  async findAllBoothGoodsOrder(@Param("id") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.findAllGoodsOrderOfBooth(+boothId, authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Delete(":id")
  async remove(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.remove(+id, authData.id);
  }
}
