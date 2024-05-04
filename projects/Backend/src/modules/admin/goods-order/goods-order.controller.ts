import { Controller, Get, Post, Body, Param, Delete, Query, Patch, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { GoodsOrderService } from "./goods-order.service";
import { CreateGoodsOrderRequestDto } from "./dto/create-goods-order.dto";
import { UpdateGoodsOrderStatusRequestDto } from "./dto/update-goods-order-status.dto";
import { GoodsOrderResponseDto } from "./dto/goods-order.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/goods/order")
export class GoodsOrderController {
  constructor(private readonly goodsOrderService: GoodsOrderService) {}

  /* Normal routes */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createGoodsOrderDto: CreateGoodsOrderRequestDto, @AuthData() authData: IAuthPayload): Promise<GoodsOrderResponseDto> {
    return new GoodsOrderResponseDto(await this.goodsOrderService.create(createGoodsOrderDto, authData.id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload): Promise<GoodsOrderResponseDto> {
    return new GoodsOrderResponseDto(await this.goodsOrderService.findGoodsOrderBelongsToBooth(+id, +boothId, authData.id));
  }

  @Patch(":id/status")
  async updateStatus(@Param("id") id: string, @Query("bId") boothId: string, @Body() updateGoodsOrderStatusDto: UpdateGoodsOrderStatusRequestDto, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.updateStatus(+id, +boothId, updateGoodsOrderStatusDto, authData.id);
  }

  /* Super admin routes */
  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("all")
  async findAll(): Promise<Array<GoodsOrderResponseDto>> {
    return (await this.goodsOrderService.findAll()).map((order) => new GoodsOrderResponseDto(order));
  }

  @SuperAdmin()
  @Delete(":id")
  async remove(@Param("id") id: string, @Query("bId") boothId: string, @AuthData() authData: IAuthPayload) {
    return await this.goodsOrderService.remove(+id, parseInt(boothId), authData.id);
  }
}
