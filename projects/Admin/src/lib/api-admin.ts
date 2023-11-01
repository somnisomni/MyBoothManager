import * as CT from "@myboothmanager/common";
import { useAuthStore } from "@/stores/auth";

type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default class AdminAPI {
  private static readonly API_URL: string = import.meta.env.VITE_MBM_API_SERVER_URL;
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  /* Basic fetch functions */
  private static async adminAPICall(method: HTTPMethodString, path: string, payload?: Record<string, any>, containAuthCredential = true): Promise<Record<string, any>> {
    const response = await fetch(`${this.API_URL}/admin/${path}`, {
      ...this.FETCH_COMMON_OPTIONS,
      method,
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        ...this.FETCH_COMMON_OPTIONS.headers,
        Authorization: containAuthCredential ? `Bearer ${useAuthStore().authTokenData?.accessToken}` : "",
      },
    });

    return await response.json();
  }

  private static GET = async (path: string, payload?: Record<string, any>, containAuthCredential = true) => await this.adminAPICall("GET", path, payload, containAuthCredential);
  private static POST = async (path: string, payload: Record<string, any>, containAuthCredential = true) => await this.adminAPICall("POST", path, payload, containAuthCredential);
  private static PUT = async (path: string, payload: Record<string, any>, containAuthCredential = true) => await this.adminAPICall("PUT", path, payload, containAuthCredential);
  private static PATCH = async (path: string, payload: Record<string, any>, containAuthCredential = true) => await this.adminAPICall("PATCH", path, payload, containAuthCredential);
  private static DELETE = async (path: string, payload?: Record<string, any>, containAuthCredential = true) => await this.adminAPICall("DELETE", path, payload, containAuthCredential);

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
  static async checkAPIServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/teapot`, this.FETCH_COMMON_OPTIONS);

      if(response && response.status === 418) return true;
      else return false;
    } catch(error) {
      console.debug("API Server is not available!");
      return false;
    }
  }

  /* Auth */
  static async login(payload: CT.IAccountLoginRequest): Promise<CT.IAccountLoginResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(this.POST, "auth/login", payload, false);
  }

  static async refreshAuth(payload: { id: number, refreshToken: string }): Promise<CT.IAccountLoginResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(this.POST, "auth/refresh", payload, false);
  }

  /* Fetch */
  static async fetchCurrentAccountInfo(): Promise<CT.IAccount | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IAccount>(this.GET, "account");
  }

  static async fetchAllBooths(): Promise<Array<CT.IBoothResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IBoothResponse>>(this.GET, "booth");
  }

  static async fetchAllGoods(): Promise<Array<CT.IGoodsResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.GET, "goods");
  }

  static async fetchAllGoodsOfBooth(boothId: number): Promise<Array<CT.IGoodsResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.GET, `booth/${boothId}/goods`);
  }

  static async countAllGoodsOfBooth(boothId: number): Promise<CT.IValueResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IValueResponse>(this.GET, `booth/${boothId}/goods/count`);
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number): Promise<Array<CT.IGoodsCategoryResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsCategoryResponse>>(this.GET, `booth/${boothId}/goods/category`);
  }

  static async fetchAllGoodsOrdersOfBooth(boothId: number): Promise<Array<CT.IGoodsOrderResponse> | CT.ErrorCodes> {
    return await this.apiCallWrapper<Array<CT.IGoodsOrderResponse>>(this.GET, `booth/${boothId}/goods/order`);
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: CT.IBoothUpdateReuqest): Promise<CT.IBoothResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.PATCH, `booth/${boothId}`, payload);
  }

  static async updateBoothStatus(boothId: number, payload: CT.IBoothStatusUpdateRequest): Promise<CT.ISuccessResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.ISuccessResponse>(this.PATCH, `booth/${boothId}/status`, payload);
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest): Promise<CT.IGoodsResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.PATCH, `goods/${goodsId}`, payload);
  }

  static async updateGoodsCategoryInfo(categoryId: number, payload: CT.IGoodsCategoryUpdateRequest): Promise<CT.IGoodsCategoryResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(this.PATCH, `goods/category/${categoryId}`, payload);
  }

  /* Create */
  static async createAccount(currentUserData: CT.IAccountUserland, payload: CT.IAccountCreateRequest): Promise<CT.IAccountResponse | CT.ErrorCodes> {
    if(currentUserData.superAdmin)
      return await this.apiCallWrapper<CT.IAccountResponse>(this.POST, "account", payload);
    else return CT.ErrorCodes.NO_ACCESS;
  }

  static async createBooth(payload: CT.IBoothCreateRequest): Promise<CT.IBoothResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.POST, "booth", payload);
  }

  static async createGoods(payload: CT.IGoodsCreateRequest): Promise<CT.IGoodsResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.POST, "goods", payload);
  }

  static async createGoodsCategory(payload: CT.IGoodsCategoryCreateRequest): Promise<CT.IGoodsCategoryResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(this.POST, "goods/category", payload);
  }

  static async createGoodsOrder(payload: CT.IGoodsOrderCreateRequest): Promise<CT.IGoodsOrderResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.IGoodsOrderResponse>(this.POST, "goods/order", payload);
  }

  /* Delete */
  static async deleteGoodsCategory(categoryId: number): Promise<CT.ISuccessResponse | CT.ErrorCodes> {
    return await this.apiCallWrapper<CT.ISuccessResponse>(this.DELETE, `goods/category/${categoryId}`);
  }
}
