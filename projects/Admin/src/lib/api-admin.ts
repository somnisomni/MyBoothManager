import * as CT from "@myboothmanager/common";
import { useAuthStore } from "@/stores/auth";

export default class AdminAPI {
  private static readonly API: CT.APICaller = new CT.APICaller(import.meta.env.VITE_MBM_API_SERVER_URL, "admin", () => useAuthStore().authTokenData!.accessToken);

  /* Admin FE specific API call wrapper */
  private static async apiCallWrapper<T>(callee: () => Promise<T | CT.IBackendErrorResponse>): Promise<T | CT.ErrorCodes> {
    try {
      const response = await callee() as T | CT.IBackendErrorResponse;

      if((response as CT.IBackendErrorResponse).errorCode) {
        return (response as CT.IBackendErrorResponse).errorCode as CT.ErrorCodes;
      } else {
        return response as T;
      }
    } catch(error) {
      console.error(error);
      return CT.ErrorCodes.UNKNOWN_ERROR;
    }
  }

  /* == Endpoints == */
  /* Common */
  static async checkAPIServerAlive() { return await this.API.checkAPIServerAlive(); }

  /* Auth */
  static async login(payload: CT.IAccountLoginRequest) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/login", payload, false));
  }

  static async refreshAuth(payload: { id: number, refreshToken: string }) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/refresh", payload, false));
  }

  /* Fetch */
  static async fetchCurrentAccountInfo() {
    return await this.apiCallWrapper<CT.IAccountResponse>(() => this.API.GET("account"));
  }

  static async fetchAllBooths() {
    return await this.apiCallWrapper<Array<CT.IBoothResponse>>(() => this.API.GET("booth"));
  }

  static async fetchAllGoodsOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllGoodsOfBooth(boothId));
  }

  static async countAllGoodsOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchCountAllGoodsOfBooth(boothId));
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllGoodsCategoryOfBooth(boothId));
  }

  static async fetchAllGoodsOrdersOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsOrderResponse>>(() => this.API.GET(`booth/${boothId}/goods/order`));
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: CT.IBoothUpdateReuqest) {
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.PATCH(`booth/${boothId}`, payload));
  }

  static async updateBoothStatus(boothId: number, payload: CT.IBoothStatusUpdateRequest) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.PATCH(`booth/${boothId}/status`, payload));
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.PATCH(`goods/${goodsId}`, payload));
  }

  static async updateGoodsCategoryInfo(categoryId: number, payload: CT.IGoodsCategoryUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.PATCH(`goods/category/${categoryId}`, payload));
  }

  /* Create */
  static async createAccount(currentUserData: CT.IAccountUserland, payload: CT.IAccountCreateRequest) {
    if(currentUserData.superAdmin)
      return await this.apiCallWrapper<CT.IAccountResponse>(() => this.API.POST("account", payload));
    else return CT.ErrorCodes.NO_ACCESS;
  }

  static async createBooth(payload: CT.IBoothCreateRequest) {
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.POST("booth", payload));
  }

  static async createGoods(payload: CT.IGoodsCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.POST("goods", payload));
  }

  static async createGoodsCategory(payload: CT.IGoodsCategoryCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.POST("goods/category", payload));
  }

  static async createGoodsOrder(payload: CT.IGoodsOrderCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsOrderResponse>(() => this.API.POST("goods/order", payload));
  }

  /* Delete */
  static async deleteGoods(goodsId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/${goodsId}?bId=${boothId}`));
  }

  static async deleteGoodsCategory(categoryId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/category/${categoryId}`));
  }
}
