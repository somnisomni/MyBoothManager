import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { AllowedFor, AuthData, UserType, UserTypes, UserTypeUtil } from "../auth/auth.guard";
import { AdminGoodsResponseDto, GoodsResponseDto } from "./dto/goods.dto";
import { IAuthData } from "../auth/jwt-util.service";
import { BOOTH_ID_QUERY } from "@/modules/root.module";
import { CreateGoodsRequestDto } from "./dto/create.dto";
import { ISuccessResponse } from "@myboothmanager/common";
import { UpdateGoodsRequestDto } from "./dto/update.dto";

@Controller("/goods")
export class GoodsController {
  constructor(
    private readonly goods: GoodsService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Find a goods by ID (PK)
   *
   *  - for **booth admin**: returns a goods belonging to the booth
   *  - for **public user**: returns a goods belonging to the booth, with limited information for each
   */
  @Get(":id")
  async findOne(@Param("id", new ParseIntPipe()) id: number,
                @Query(BOOTH_ID_QUERY, new ParseIntPipe()) boothId: number,
                @UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<GoodsResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN)) {
      return new AdminGoodsResponseDto(await this.goods.findOne(id, boothId, true, authData!.id));
    }

    return new GoodsResponseDto(await this.goods.findOne(id, boothId));
  }


  /* === Admin routes === */
  @Post()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async create(@Body() createDto: CreateGoodsRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsResponseDto> {
    return new AdminGoodsResponseDto(await this.goods.create(createDto, authData.id));
  }

  @Patch(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async update(@Param("id", new ParseIntPipe()) id: number,
               @Body() updateDto: UpdateGoodsRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsResponseDto> {
    return new AdminGoodsResponseDto(await this.goods.update(id, updateDto, authData.id));
  }

  @Delete(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async remove(@Param("id", new ParseIntPipe()) id: number,
               @Query(BOOTH_ID_QUERY, new ParseIntPipe()) boothId: number,
               @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.goods.remove(id, boothId, authData.id);
  }
}
