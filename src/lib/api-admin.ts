import { type IBoothResponse, type IGoodsCreateRequest, type IGoodsResponse } from "myboothmanager-common/interfaces";

type HTTPMethodString = "GET" | "POST" | "PUT" | "DELETE";

export default class AdminAPI {
  private static readonly API_URL: string = import.meta.env.VITE_MBM_API_SERVER_URL;
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  /* Basic fetch functions */
  private static async adminAPICall(method: HTTPMethodString, path: string, payload?: Record<string, any>): Promise<Record<string, any> | null> {
    const response = await fetch(`${this.API_URL}/admin/${path}`, {
      ...this.FETCH_COMMON_OPTIONS,
      method,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if(response && response.ok) {
      return await response.json();
    } else {
      return null;
    }
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

  static async fetchAllBooths(): Promise<Array<IBoothResponse> | null> {
    const response = await this.GET("booth");

    if(response) return response as Array<IBoothResponse>;
    else return null;
  }

  static async createGoods(payload: IGoodsCreateRequest): Promise<IGoodsResponse | null> {
    const response = await this.POST("goods", payload);

    if(response) return response as IGoodsResponse;
    else return null;
  }
}
