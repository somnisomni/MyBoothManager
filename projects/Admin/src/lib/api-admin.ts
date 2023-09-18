import { type IAccountLoginRequest, type IAccountLoginResponse, type IBackendErrorResponse, type IBoothResponse, type IGoodsCategoryResponse, type IGoodsCreateRequest, type IGoodsResponse } from "@myboothmanager/common";

type HTTPMethodString = "GET" | "POST" | "PUT" | "DELETE";

export default class AdminAPI {
  private static readonly API_URL: string = import.meta.env.VITE_MBM_API_SERVER_URL;
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  /* Basic fetch functions */
  private static async adminAPICall(method: HTTPMethodString, path: string, payload?: Record<string, any>): Promise<Record<string, any>> {
    const response = await fetch(`${this.API_URL}/admin/${path}`, {
      ...this.FETCH_COMMON_OPTIONS,
      method,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    return await response.json();
  }

  static GET = async (path: string) => await this.adminAPICall("GET", path);
  static POST = async (path: string, payload: Record<string, any>) => await this.adminAPICall("POST", path, payload);
  static PUT = async (path: string, payload: Record<string, any>) => await this.adminAPICall("PUT", path, payload);
  static DELETE = async (path: string) => await this.adminAPICall("DELETE", path);

  private static async apiCallWrapper<T>(callee: Function, path: string, payload?: Record<string, any>): Promise<T | string> {
    const response = await callee(path, payload);

    if(response.message) {
      return (response as IBackendErrorResponse).message;
    } else {
      return response as T;
    }
  }

  /* Endpoints */
  static async checkAPIServerAlive(): Promise<boolean> {
    const response = await fetch(`${this.API_URL}/teapot`, this.FETCH_COMMON_OPTIONS);

    if(response && response.status === 418) return true;
    else return false;
  }

  static async login(payload: IAccountLoginRequest): Promise<IAccountLoginResponse | string> {
    return await this.apiCallWrapper<IAccountLoginResponse>(this.POST, "account/login", payload);
  }

  static async fetchAllBooths(): Promise<Array<IBoothResponse> | string> {
    return await this.apiCallWrapper<Array<IBoothResponse>>(this.GET, "booth");
  }

  static async fetchAllGoods(): Promise<Array<IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsResponse>>(this.GET, "goods");
  }

  static async fetchAllGoodsOfBooth(boothId: number): Promise<Array<IGoodsResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsResponse>>(this.GET, `booth/${boothId}/goods`);
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number): Promise<Array<IGoodsCategoryResponse> | string> {
    return await this.apiCallWrapper<Array<IGoodsCategoryResponse>>(this.GET, `booth/${boothId}/goods/category`);
  }

  static async createGoods(payload: IGoodsCreateRequest): Promise<IGoodsResponse | string> {
    return await this.apiCallWrapper<IGoodsResponse>(this.POST, "goods", payload);
  }
}
