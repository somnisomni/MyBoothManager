import { Controller, forwardRef, Get, Inject, Param, ParseIntPipe } from "@nestjs/common";
import { BOOTH_ID_QUERY } from "@/lib/const";
import { GoodsCombinationService } from "../goods-combination/goods-combination.service";
import { GoodsCategoryService } from "../goods-category/goods-category.service";
import { GoodsService } from "../goods/goods.service";
import { UserType, UserTypes, AuthData, UserTypeUtil } from "../auth/auth.guard";
import type { IAuthData } from "../auth/jwt-util.service";
import { GoodsResponseDto, AdminGoodsResponseDto } from "../goods/dto/goods.dto";
import { GoodsCategoryResponseDto, AdminGoodsCategoryResponseDto } from "../goods-category/dto/goods-category.dto";
import { GoodsCombinationResponseDto, AdminGoodsCombinationResponseDto } from "../goods-combination/dto/goods-combination.dto";

@Controller(`/booth/:${BOOTH_ID_QUERY}`)
export class BoothIndividualController {
  constructor(
    @Inject(forwardRef(() => GoodsService))
    private readonly goods: GoodsService,

    @Inject(forwardRef(() => GoodsCategoryService))
    private readonly goodsCategory: GoodsCategoryService,

    @Inject(forwardRef(() => GoodsCombinationService))
    private readonly goodsCombination: GoodsCombinationService,
  ) { }

  // NOTE: Booth member findAll is handled in `BoothMemberController`.
  // NOTE: Booth order findAll is handled in `BoothOrderController`.

  /* === Multi user-type routes === */
  /**
   * Find all goods
   *
   *  - for **super admin**, is handled in `GoodsController` with different routing.
   *  - for **booth admin**: returns all goods belonging to the booth
   *  - for **public user**: returns all goods belonging to the booth, with limited information for each
   */
  @Get("goods")
  async findAllGoods(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                     @UserType() userType: UserTypes,
                     @AuthData() authData?: IAuthData) : Promise<GoodsResponseDto[]> {
    // Booth admin
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return (await this.goods.findAll(boothId, true, authData.id))
        .map(goods => new AdminGoodsResponseDto(goods));
    }

    // Public
    return (await this.goods.findAll(boothId))
      .map(goods => new GoodsResponseDto(goods));
  }

  /**
   * Find all goods categories belonging to the booth
   *
   *  - for **booth admin**: returns all goods categories belonging to the booth
   *  - for **public user**: returns all goods categories belonging to the booth, with limited information for each
   */
  @Get("goods/category")
  async findAllGoodsCategory(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                             @UserType() userType: UserTypes,
                             @AuthData() authData?: IAuthData): Promise<GoodsCategoryResponseDto[]> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return (await this.goodsCategory.findAll(boothId, true, authData.id))
        .map(category => new AdminGoodsCategoryResponseDto(category));
    }

    return (await this.goodsCategory.findAll(boothId))
      .map(category => new GoodsCategoryResponseDto(category));
  }

  /**
   * Find all goods combinations belonging to the booth
   *
   *  - for **booth admin**: returns all goods combinations belonging to the booth
   *  - for **public user**: returns all goods combinations belonging to the booth, with limited information for each
   */
  @Get("goods/combination")
  async findAllGoodsCombination(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                                @UserType() userType: UserTypes,
                                @AuthData() authData?: IAuthData): Promise<GoodsCombinationResponseDto[]> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return (await this.goodsCombination.findAll(boothId, true, authData.id))
        .map(combination => new AdminGoodsCombinationResponseDto(combination));
    }

    return (await this.goodsCombination.findAll(boothId))
      .map(combination => new GoodsCombinationResponseDto(combination));
  }
}
