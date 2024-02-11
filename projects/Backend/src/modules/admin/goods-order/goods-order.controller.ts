import { Controller, Get, Post, Body, Param, Delete, Query, Patch, UseGuards } from "@nestjs/common";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsOrderService } from "./goods-order.service";
import { CreateGoodsOrderDTO } from "./dto/create-goods-order.dto";
import { UpdateGoodsOrderStatusDTO } from "./dto/update-goods-order-status.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods/order")
export class GoodsOrderController {
  constructor(private readonly goodsOrderService: GoodsOrderService) {}

  /* Normal routes */
  @Post()
  async create(@Body() createGoodsOrderDto: CreateGoodsOrderDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.create(createGoodsOrderDto, authData.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.findGoodsOrderBelongsToBooth(+id, +boothId, authData.id);
  }

  @Patch(":id/status")
  async updateStatus(@Param("id") id: string, @Query("bId") boothId: string, @Body() updateGoodsOrderStatusDto: UpdateGoodsOrderStatusDTO, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.updateStatus(+id, +boothId, updateGoodsOrderStatusDto, authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Get("all")
  async findAll() {
    return await this.goodsOrderService.findAll();
  }

  @SuperAdmin()
  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.remove(+id, parseInt(boothId), authData.id);
  }
}
