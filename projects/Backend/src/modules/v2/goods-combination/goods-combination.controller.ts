import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { GoodsCombinationService } from "./goods-combination.service";
import { AdminGoodsCombinationResponseDto, GoodsCombinationResponseDto } from "./dto/goods-combination.dto";
import { CreateGoodsCombinationRequestDto } from "./dto/create.dto";
import { UpdateGoodsCombinationRequestDto } from "./dto/update.dto";
import { BOOTH_ID_QUERY } from "@/modules/root.module";
import { ISuccessResponse } from "@myboothmanager/common";
import { UserType, UserTypes, AuthData, UserTypeUtil, AllowedFor } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";

@Controller("/goods/combination")
export class GoodsCombinationController {
  constructor(
    private readonly combination: GoodsCombinationService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Find a goods combination by ID (PK)
   *
   *  - for **booth admin**: returns a goods combination belonging to the booth
   *  - for **public user**: returns a goods combination belonging to the booth, with limited information for each
   */
  @Get(":id")
  async findOne(@Param("id", new ParseIntPipe()) id: number,
                @Query(BOOTH_ID_QUERY, new ParseIntPipe()) boothId: number,
                @UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<GoodsCombinationResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN)) {
      return new AdminGoodsCombinationResponseDto(await this.combination.findOne(id, boothId, true, authData!.id));
    }

    return new GoodsCombinationResponseDto(await this.combination.findOne(id, boothId));
  }


  /* === Admin routes === */
  @Post()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async create(@Body() createDto: CreateGoodsCombinationRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsCombinationResponseDto> {
    return new AdminGoodsCombinationResponseDto(await this.combination.create(createDto, authData.id));
  }

  @Patch(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async update(@Param("id", new ParseIntPipe()) id: number,
               @Body() updateDto: UpdateGoodsCombinationRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminGoodsCombinationResponseDto> {
    return new AdminGoodsCombinationResponseDto(await this.combination.update(id, updateDto, authData.id));
  }

  @Delete(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async remove(@Param("id", new ParseIntPipe()) id: number,
               @Query(BOOTH_ID_QUERY, new ParseIntPipe()) boothId: number,
               @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.combination.remove(id, boothId, authData.id);
  }
}
