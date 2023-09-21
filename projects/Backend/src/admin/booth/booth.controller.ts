import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { BoothService } from "./booth.service";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";

@Controller("/admin/booth")
export class BoothController {
  constructor(private readonly boothService: BoothService) {}

  /* Normal routes */
  @Post()
  create(@Body() createAdminDto: CreateBoothDTO, @AuthData() authData: IAuthPayload) {
    return this.boothService.create(createAdminDto, authData.id);
  }

  @Get()
  async findAllForCurrentAccount(@AuthData() authData: IAuthPayload) {
    return await this.boothService.findAll(authData.id);
  }

  @Get(":id")
  async findOneWithOwnerCheck(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.findBoothBelongsToAccount(+id, authData.id);
  }

  @Patch(":id")
  updateBoothInfo(@Param("id") id: string, @Body() updateBoothDto: UpdateBoothDTO, @AuthData() authData: IAuthPayload) {
    return this.boothService.updateBoothInfo(+id, updateBoothDto, authData.id);
  }

  @Patch(":id/status")
  updateBoothStatus(@Param("id") id: string, @Body() updateBoothStatusDto: UpdateBoothStatusDTO, @AuthData() authData: IAuthPayload) {
    return this.boothService.updateBoothStatus(+id, updateBoothStatusDto, authData.id);
  }

  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.findAllGoodsOfBooth(+boothId, authData.id);
  }

  @Get(":id/goods/count")
  async countAllBoothGoods(@Param("id") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.countAllGoodsOfBooth(+boothId, authData.id);
  }

  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.findAllGoodsCategoryOfBooth(+boothId, authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Delete(":id")
  async remove(@Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothService.remove(+id, authData.id);
  }

  @SuperAdmin()
  @Get("all")
  async findAll() {
    return await this.boothService.findAll();
  }
}
