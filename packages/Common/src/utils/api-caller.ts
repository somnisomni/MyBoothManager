import { IBooth, IGoods, IGoodsCategory, IValueResponse } from "..";

type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default class APICaller {
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  constructor(private readonly apiHost: string, private readonly apiGroup: string = "", private readonly getAuthorizationToken: (() => string) | null | undefined = null, private readonly teapotPath: string = "teapot") {}

  /* Basic fetch function */
  public async callAPI<T>(method: HTTPMethodString, path: string, payload?: Record<string, unknown>, containAuthCredential: boolean = true): Promise<T> {
    const url: string = `${this.apiHost}${this.apiGroup.length > 0 ? `/${this.apiGroup}` : ""}/${path}`;

    const response = await fetch(url, {
      ...APICaller.FETCH_COMMON_OPTIONS,
      method,
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        ...APICaller.FETCH_COMMON_OPTIONS.headers,
        ...containAuthCredential && this.getAuthorizationToken ? { Authorization: `Bearer ${this.getAuthorizationToken()}` } : { },
      },
    });

    return await response.json() as T;
  }

  /* Fetch function shortcuts */
  public async GET<T>(path: string, payload?: Record<string, unknown>, containAuthCredential = true) { return await this.callAPI<T>("GET", path, payload, containAuthCredential); }
  public async POST<T>(path: string, payload: Record<string, unknown>, containAuthCredential = true) { return await this.callAPI<T>("POST", path, payload, containAuthCredential); }
  public async PUT<T>(path: string, payload: Record<string, unknown>, containAuthCredential = true) { return await this.callAPI<T>("PUT", path, payload, containAuthCredential); }
  public async PATCH<T>(path: string, payload: Record<string, unknown>, containAuthCredential = true) { return await this.callAPI<T>("PATCH", path, payload, containAuthCredential); }
  public async DELETE<T>(path: string, payload?: Record<string, unknown>, containAuthCredential = true) { return await this.callAPI<T>("DELETE", path, payload, containAuthCredential); }

  /* Public APIs */
  private createPublicAPI = () => new APICaller(this.apiHost, "public");

  // Server
  public async checkAPIServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiHost}/${this.teapotPath}`, APICaller.FETCH_COMMON_OPTIONS);

      if(response && response.status === 418) return true;
      else return false;
    } catch(error) {
      console.debug("Can't connect to API server! ;(");
      return false;
    }
  }

  // Booth
  public async fetchAllBooths(): Promise<Array<IBooth>> {
    return await this.createPublicAPI().GET<Array<IBooth>>("booth");
  }

  public async fetchCountAllBooths(): Promise<number> {
    return +((await this.createPublicAPI().GET<IValueResponse>("booth/count")).value);
  }

  public async fetchSingleBooth(boothId: number): Promise<IBooth> {
    return await this.createPublicAPI().GET<IBooth>(`booth/${boothId}`);
  }

  public async fetchAllGoodsOfBooth(boothId: number): Promise<Array<IGoods>> {
    return await this.createPublicAPI().GET<Array<IGoods>>(`booth/${boothId}/goods`);
  }

  public async fetchCountAllGoodsOfBooth(boothId: number): Promise<number> {
    return +((await this.createPublicAPI().GET<IValueResponse>(`booth/${boothId}/goods/count`)).value);
  }

  public async fetchAllGoodsCategoryOfBooth(boothId: number): Promise<Array<IGoodsCategory>> {
    return await this.createPublicAPI().GET<Array<IGoodsCategory>>(`booth/${boothId}/goods/category`);
  }

  public async fetchCountAllGoodsCategoryOfBooth(boothId: number): Promise<number> {
    return +((await this.createPublicAPI().GET<IValueResponse>(`booth/${boothId}/goods/category/count`)).value);
  }

  // Goods
  public async fetchSingleGoods(goodsId: number): Promise<IGoods> {
    return await this.createPublicAPI().GET<IGoods>(`goods/${goodsId}`);
  }

  // Goods category
  public async fetchSingleGoodsCategory(goodsCategoryId: number): Promise<IGoodsCategory> {
    return await this.createPublicAPI().GET<IGoodsCategory>(`goods/category/${goodsCategoryId}`);
  }
}
