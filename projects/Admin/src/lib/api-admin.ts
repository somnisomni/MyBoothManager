import { type IAccountLoginRequest, type IAccountLoginResponse, type IBackendErrorResponse, type IBoothCreateRequest, type IBoothResponse, type IBoothStatusUpdateRequest, type IBoothUpdateReuqest, type IGoodsCategoryResponse, type IGoodsCreateRequest, type IGoodsResponse, type IStatusOKResponse, type IValueResponse } from "@myboothmanager/common";
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

  private static async apiCallWrapper<T>(callee: Function, path: string, payload?: Record<string, any>, containAuthCredential = true): Promise<T | string> {
    try {
      const response = await callee(path, payload, containAuthCredential);

      if(response.message) {
        return (response as IBackendErrorResponse).message;
      } else {
        return response as T;
      }
    } catch{
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
  static async login(payload: IAccountLoginRequest): Promise<IAccountLoginResponse | string> {
    return await this.apiCallWrapper<IAccountLoginResponse>(this.POST, "auth/login", payload, false);
  }

  /* Fetch */
  static async fetchAllBooths(): Promise<Array<IBoothResponse> | string> {
    return await this.apiCallWrapper<Array<IBoothResponse>>(this.GET, "booth");
  }

  static async fetchAllGoods(): Promise<Array<IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsResponse>>(this.GET, "goods");
  }

  static async fetchAllGoodsOfBooth(boothId: number): Promise<Array<IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsResponse>>(this.GET, `booth/${boothId}/goods`);
  }

  static async countAllGoodsOfBooth(boothId: number): Promise<IValueResponse | string> {
    return await this.apiCallWrapper<IValueResponse>(this.GET, `booth/${boothId}/goods/count`);
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number): Promise<Array<IGoodsCategoryResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsCategoryResponse>>(this.GET, `booth/${boothId}/goods/category`);
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: IBoothUpdateReuqest): Promise<IBoothResponse | string> {
    return await this.apiCallWrapper<IBoothResponse>(this.PATCH, `booth/${boothId}`, payload);
  }

  static async updateBoothStatus(boothId: number, payload: IBoothStatusUpdateRequest): Promise<IStatusOKResponse | string> {
    return await this.apiCallWrapper<IStatusOKResponse>(this.PATCH, `booth/${boothId}/status`, payload);
  }

  /* Create */
  static async createBooth(payload: IBoothCreateRequest): Promise<IBoothResponse | string> {
    return await this.apiCallWrapper<IBoothResponse>(this.POST, "booth", payload);
  }

  static async createGoods(payload: IGoodsCreateRequest): Promise<IGoodsResponse | string> {
    return await this.apiCallWrapper<IGoodsResponse>(this.POST, "goods", payload);
  }
}
