import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { BoothOrderService } from "./booth-order.service";
import { AllowedFor, AuthData, UserTypes } from "../auth/auth.guard";
import { CreateBoothOrderRequestDto } from "./dto/create.dto";
import { IAuthData } from "../auth/jwt-util.service";
import { BoothOrderResponseDto } from "./dto/booth-order.dto";
import { UpdateBoothOrderStatusRequestDto } from "./dto/update-status.dto";
import { ISuccessResponse } from "@myboothmanager/common";
import { BOOTH_ID_QUERY } from "@/lib/const";

@Controller(`/booth/:${BOOTH_ID_QUERY}/order`)
@AllowedFor(UserTypes.BOOTH_ADMIN)
export class BoothOrderController {
  constructor(
    private readonly order: BoothOrderService,
  ) { }

  /* === Admin routes === */
  @Get()
  async findAll(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                @AuthData() authData: IAuthData): Promise<BoothOrderResponseDto[]> {
    return (await this.order.findAll(boothId, authData.id))
      .map((order) => new BoothOrderResponseDto(order));
  }

  @Get(":oId")
  async findOne(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                @Param("oId", ParseIntPipe) orderId: number,
                @AuthData() authData: IAuthData): Promise<BoothOrderResponseDto> {
    return new BoothOrderResponseDto(await this.order.findOne(orderId, boothId, authData.id));
  }

  @Post()
  async create(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
               @Body() createDto: CreateBoothOrderRequestDto,
               @AuthData() authData: IAuthData): Promise<BoothOrderResponseDto> {
    return new BoothOrderResponseDto(await this.order.create(createDto, boothId, authData.id));
  }

  @Patch(":oId/status")
  async updateStatus(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                     @Param("oId", ParseIntPipe) orderId: number,
                     @Body() updateStatusDto: UpdateBoothOrderStatusRequestDto,
                     @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.order.updateStatus(orderId, boothId, updateStatusDto, authData.id);
  }
}
