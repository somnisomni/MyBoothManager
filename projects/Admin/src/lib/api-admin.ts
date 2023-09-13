import { type IAccountLoginResponse, type IBackendErrorResponse, type IBoothResponse, type IGoodsCreateRequest, type IGoodsResponse } from "@myboothmanager/common";

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

  /* Endpoints */
  static async checkAPIServerAlive(): Promise<boolean> {
    const response = await fetch(`${this.API_URL}/teapot`, this.FETCH_COMMON_OPTIONS);

    if(response && response.status === 418) return true;
    else return false;
  }

  static async login(payload: { loginId: string, loginPass: string }): Promise<IAccountLoginResponse | string> {
    const response = await this.POST("account/login", payload);

    if(response.token) return response as IAccountLoginResponse;
    else return (response as IBackendErrorResponse).message;
  }

  static async fetchAllBooths(): Promise<Array<IBoothResponse> | string> {
    const response = await this.GET("booth");

    if(response instanceof Array) return response as Array<IBoothResponse>;
    else return (response as IBackendErrorResponse).message;
  }

  static async createGoods(payload: IGoodsCreateRequest): Promise<IGoodsResponse | string> {
    const response = await this.POST("goods", payload);

    if(response.id) return response as IGoodsResponse;
    else return (response as IBackendErrorResponse).message;
  }
}
