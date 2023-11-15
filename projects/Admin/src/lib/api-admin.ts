import * as CT from "@myboothmanager/common";
import { useAuthStore } from "@/stores/auth";

export default class AdminAPI {
  private static readonly API: CT.APICaller = new CT.APICaller(import.meta.env.VITE_MBM_API_SERVER_URL, "admin", () => useAuthStore().authTokenData!.accessToken);

  /* Admin FE specific API call wrapper */
  private static async apiCallWrapper<T>(callee: Function, path: string, payload?: Record<string, any>, containAuthCredential = true): Promise<T | CT.ErrorCodes> {
    try {
      const response = await callee(path, payload, containAuthCredential) as T | CT.IBackendErrorResponse;

      if((response as CT.IBackendErrorResponse).errorCode) {
        return (response as CT.IBackendErrorResponse).errorCode as CT.ErrorCodes;
      } else {
        return response as T;
      }
    } catch(error) {
      return CT.ErrorCodes.UNKNOWN_ERROR;
    }
  }

  /* == Endpoints == */
  /* Common */
  static async checkAPIServerAlive(): Promise<boolean> { return this.API.checkAPIServerAlive(); }

  /* Auth */
  static async login(payload: CT.IAccountLoginRequest): Promise<CT.IAccountLoginResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(this.API.POST, "auth/login", payload, false);
  }

  static async refreshAuth(payload: { id: number, refreshToken: string }): Promise<CT.IAccountLoginResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(this.API.POST, "auth/refresh", payload, false);
  }

  /* Fetch */
  static async fetchCurrentAccountInfo(): Promise<CT.IAccount | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccount>(this.API.GET, "account");
  }

  static async fetchAllBooths(): Promise<Array<CT.IBoothResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IBoothResponse>>(this.API.GET, "booth");
  }

  static async fetchAllGoods(): Promise<Array<CT.IGoodsResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.API.GET, "goods");
  }

  static async fetchAllGoodsOfBooth(boothId: number): Promise<Array<CT.IGoodsResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.API.GET, `booth/${boothId}/goods`);
  }

  static async countAllGoodsOfBooth(boothId: number): Promise<CT.IValueResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IValueResponse>(this.API.GET, `booth/${boothId}/goods/count`);
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number): Promise<Array<CT.IGoodsCategoryResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsCategoryResponse>>(this.API.GET, `booth/${boothId}/goods/category`);
  }

  static async fetchAllGoodsOrdersOfBooth(boothId: number): Promise<Array<CT.IGoodsOrderResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsOrderResponse>>(this.API.GET, `booth/${boothId}/goods/order`);
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: CT.IBoothUpdateReuqest): Promise<CT.IBoothResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.API.PATCH, `booth/${boothId}`, payload);
  }

  static async updateBoothStatus(boothId: number, payload: CT.IBoothStatusUpdateRequest): Promise<CT.ISuccessResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.ISuccessResponse>(this.API.PATCH, `booth/${boothId}/status`, payload);
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest): Promise<CT.IGoodsResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.API.PATCH, `goods/${goodsId}`, payload);
  }

  static async updateGoodsCategoryInfo(categoryId: number, payload: CT.IGoodsCategoryUpdateRequest): Promise<CT.IGoodsCategoryResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(this.API.PATCH, `goods/category/${categoryId}`, payload);
  }

  /* Create */
  static async createAccount(currentUserData: CT.IAccountUserland, payload: CT.IAccountCreateRequest): Promise<CT.IAccountResponse | CT.ErrorCodes> {
    if(currentUserData.superAdmin)
      return await this.apiCallWrapper<CT.IAccountResponse>(this.API.POST, "account", payload);
    else return CT.ErrorCodes.NO_ACCESS;
  }

  static async createBooth(payload: CT.IBoothCreateRequest): Promise<CT.IBoothResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.API.POST, "booth", payload);
  }

  static async createGoods(payload: CT.IGoodsCreateRequest): Promise<CT.IGoodsResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.API.POST, "goods", payload);
  }

  static async createGoodsCategory(payload: CT.IGoodsCategoryCreateRequest): Promise<CT.IGoodsCategoryResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(this.API.POST, "goods/category", payload);
  }

  static async createGoodsOrder(payload: CT.IGoodsOrderCreateRequest): Promise<CT.IGoodsOrderResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsOrderResponse>(this.API.POST, "goods/order", payload);
  }

  /* Delete */
  static async deleteGoodsCategory(categoryId: number): Promise<CT.ISuccessResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.ISuccessResponse>(this.API.DELETE, `goods/category/${categoryId}`);
  }
}
