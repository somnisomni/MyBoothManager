import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { GoodsCategoryService } from "./goods-category.service";
import { AdminGoodsCategoryResponseDto, GoodsCategoryResponseDto } from "./dto/goods-category.dto";
import { BOOTH_ID_QUERY } from "@/modules/root.module";
import { UserType, UserTypes, AuthData, UserTypeUtil, AllowedFor } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";
import { CreateGoodsCategoryRequestDto } from "./dto/create.dto";
import { ISuccessResponse } from "@myboothmanager/common";

@Controller("/goods/category")
export class GoodsCategoryController {
  constructor(
    private readonly category: GoodsCategoryService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Find a goods category by ID (PK)
   *
   *  - for **booth admin**: returns a goods category belonging to the booth
   *  - for **public user**: returns a goods category belonging to the booth, with limited information for each
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number,
                @Query(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                @UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<GoodsCategoryResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN)) {
      return new AdminGoodsCategoryResponseDto(await this.category.findOne(id, boothId, true, authData!.id));
    }

    return new GoodsCategoryResponseDto(await this.category.findOne(id, boothId));
  }


  /* === Admin routes === */
  @Post()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async create(@Body() createDto: CreateGoodsCategoryRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsCategoryResponseDto> {
    return new AdminGoodsCategoryResponseDto(await this.category.create(createDto, authData.id));
  }

  @Patch(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async update(@Param("id", ParseIntPipe) id: number,
               @Body() updateDto: CreateGoodsCategoryRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsCategoryResponseDto> {
    return new AdminGoodsCategoryResponseDto(await this.category.update(id, updateDto, authData.id));
  }

  @Delete(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async remove(@Param("id", ParseIntPipe) id: number,
               @Query(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
               @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.category.remove(id, boothId, authData.id);
  }
}
