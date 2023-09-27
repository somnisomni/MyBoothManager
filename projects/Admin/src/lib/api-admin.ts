import * as CT from "@myboothmanager/common";
import { useAuthStore } from "@/stores/auth";

type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type NeedRefreshMessage = "REFRESH";
export const NEED_REFRESH_MESSAGE: NeedRefreshMessage = "REFRESH";

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

  private static async apiCallWrapper<T>(callee: Function, path: string, payload?: Record<string, any>, containAuthCredential = true): Promise<T | NeedRefreshMessage | string> {
    try {
      const response = await callee(path, payload, containAuthCredential) as T | CT.IBackendErrorResponse | (CT.IBackendErrorResponse & CT.IAccountNeedRefreshResponse);

      if((response as CT.IAccountNeedRefreshResponse).needRefresh) {
        return NEED_REFRESH_MESSAGE;
      } else if((response as CT.IBackendErrorResponse).message) {
        return (response as CT.IBackendErrorResponse).message;
      } else {
        return response as T;
      }
    } catch(error) {
      return "API 서버 통신 실패";
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
  static async login(payload: CT.IAccountLoginRequest): Promise<CT.IAccountLoginResponse | string> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(this.POST, "auth/login", payload, false);
  }

  static async refreshAuth(payload: { id: number, refreshToken: string }): Promise<CT.IAccountLoginResponse | CT.IAccountNeedLoginResponse | string> {
    return await this.apiCallWrapper<CT.IAccountLoginResponse | { needLogin: true }>(this.POST, "auth/refresh", payload, false);
  }

  /* Fetch */
  static async fetchCurrentAccountInfo(): Promise<CT.IAccount | string> {
    return await this.apiCallWrapper<CT.IAccount>(this.GET, "account");
  }

  static async fetchAllBooths(): Promise<Array<CT.IBoothResponse> | string> {
    return await this.apiCallWrapper<Array<CT.IBoothResponse>>(this.GET, "booth");
  }

  static async fetchAllGoods(): Promise<Array<CT.IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.GET, "goods");
  }

  static async fetchAllGoodsOfBooth(boothId: number): Promise<Array<CT.IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(this.GET, `booth/${boothId}/goods`);
  }

  static async countAllGoodsOfBooth(boothId: number): Promise<CT.IValueResponse | string> {
    return await this.apiCallWrapper<CT.IValueResponse>(this.GET, `booth/${boothId}/goods/count`);
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number): Promise<Array<CT.IGoodsCategoryResponse> | string> {
    return await this.apiCallWrapper<Array<CT.IGoodsCategoryResponse>>(this.GET, `booth/${boothId}/goods/category`);
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: CT.IBoothUpdateReuqest): Promise<CT.IBoothResponse | string> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.PATCH, `booth/${boothId}`, payload);
  }

  static async updateBoothStatus(boothId: number, payload: CT.IBoothStatusUpdateRequest): Promise<CT.IStatusOKResponse | string> {
    return await this.apiCallWrapper<CT.IStatusOKResponse>(this.PATCH, `booth/${boothId}/status`, payload);
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest): Promise<CT.IGoodsResponse | string> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.PATCH, `goods/${goodsId}`, payload);
  }

  /* Create */
  static async createBooth(payload: CT.IBoothCreateRequest): Promise<CT.IBoothResponse | string> {
    return await this.apiCallWrapper<CT.IBoothResponse>(this.POST, "booth", payload);
  }

  static async createGoods(payload: CT.IGoodsCreateRequest): Promise<CT.IGoodsResponse | string> {
    return await this.apiCallWrapper<CT.IGoodsResponse>(this.POST, "goods", payload);
  }
}
