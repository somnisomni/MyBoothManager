import {
  HTTP_HEALTH_CHECK_STATUS_CODE,
  type IBackendErrorResponse,
  type IBoothMemberResponse,
  type IBoothResponse,
  type IGoodsCategoryResponse,
  type IGoodsCombinationResponse,
  type IGoodsResponse,
  type IValueResponse,
} from "..";

type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const MAX_UPLOAD_FILE_BYTES = (1024 * 1024) * 15;  // 15MB

export default class APICaller {
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  constructor(
    private readonly apiHost: string,
    private readonly apiGroup: string = "",
    private readonly getAuthorizationToken: (() => string) | null | undefined = null,
    private readonly healthCheckPath: string = "healthcheck") { }

  /* Basic fetch function */
  private async callAPIInternal<T>(method: HTTPMethodString, path: string, payload?: BodyInit, additionalInitOptions?: RequestInit, containAuthCredential: boolean = true): Promise<T | IBackendErrorResponse> {
    const url: string = `${this.apiHost}${this.apiGroup.length > 0 ? `/${this.apiGroup}` : ""}/${path}`;

    const response = await fetch(url, {
      ...additionalInitOptions,
      method,
      body: payload,
      headers: {
        ...additionalInitOptions?.headers ?? { },
        ...containAuthCredential && this.getAuthorizationToken ? { Authorization: `Bearer ${this.getAuthorizationToken()}` } : { },
      },
    });

    return await response.json() as T;
  }

  public async callAPI<T>(method: HTTPMethodString, path: string, payload?: Record<never, never>, containAuthCredential: boolean = true): Promise<T | IBackendErrorResponse> {
    return this.callAPIInternal<T>(method, path, payload ? JSON.stringify(payload) : undefined, APICaller.FETCH_COMMON_OPTIONS, containAuthCredential);
  }

  /* Fetch function shortcuts */
  public async GET<T>(path: string, payload?: Record<never, never>, containAuthCredential = true) { return await this.callAPI<T>("GET", path, payload, containAuthCredential); }
  public async POST<T>(path: string, payload: Record<never, never>, containAuthCredential = true) { return await this.callAPI<T>("POST", path, payload, containAuthCredential); }
  public async PUT<T>(path: string, payload: Record<never, never>, containAuthCredential = true) { return await this.callAPI<T>("PUT", path, payload, containAuthCredential); }
  public async PATCH<T>(path: string, payload: Record<never, never>, containAuthCredential = true) { return await this.callAPI<T>("PATCH", path, payload, containAuthCredential); }
  public async DELETE<T>(path: string, payload?: Record<never, never>, containAuthCredential = true) { return await this.callAPI<T>("DELETE", path, payload, containAuthCredential); }

  public async POSTMultipart<T>(path: string, payload: FormData): Promise<T | IBackendErrorResponse> {
    return this.callAPIInternal<T>("POST", path, payload, undefined, true);
  }

  /* Public APIs */
  private readonly createPublicAPI = () => new APICaller(this.apiHost, "public");

  // Server
  public async checkAPIServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiHost}/${this.healthCheckPath}`, APICaller.FETCH_COMMON_OPTIONS);

      if(response && response.status === HTTP_HEALTH_CHECK_STATUS_CODE) return true;
      else return false;
    } catch(error) {
      console.debug("Can't connect to API server! ;(");
      return false;
    }
  }

  // Booth
  public async fetchAllBooths() {
    return await this.createPublicAPI().GET<Array<IBoothResponse>>("booth");
  }

  public async fetchCountAllBooths() {
    const response = await this.createPublicAPI().GET<IValueResponse>("booth/count");

    if("value" in response) return +response.value;
    else return response;
  }

  public async fetchSingleBooth(boothId: number) {
    return await this.createPublicAPI().GET<IBoothResponse>(`booth/${boothId}`);
  }

  public async fetchAllGoodsOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsResponse>>(`booth/${boothId}/goods`);
  }

  public async fetchCountAllGoodsOfBooth(boothId: number) {
    const response = await this.createPublicAPI().GET<IValueResponse>(`booth/${boothId}/goods/count`);

    if("value" in response) return +response.value;
    else return response;
  }

  public async fetchAllGoodsCategoryOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsCategoryResponse>>(`booth/${boothId}/goods/category`);
  }

  public async fetchCountAllGoodsCategoryOfBooth(boothId: number) {
    const response = await this.createPublicAPI().GET<IValueResponse>(`booth/${boothId}/goods/category/count`);

    if("value" in response) return +response.value;
    else return response;
  }

  public async fetchAllGoodsCombinationOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsCombinationResponse>>(`booth/${boothId}/goods/combination`);
  }

  public async fetchCountAllGoodsCombinationOfBooth(boothId: number) {
    const response = await this.createPublicAPI().GET<IValueResponse>(`booth/${boothId}/goods/combination/count`);

    if("value" in response) return +response.value;
    else return response;
  }

  // Booth member
  public async fetchAllMembersOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IBoothMemberResponse>>(`booth/${boothId}/member`);
  }

  public async fetchSingleMemberOfBooth(boothId: number, memberId: number) {
    return await this.createPublicAPI().GET<IBoothMemberResponse>(`booth/${boothId}/member/${memberId}`);
  }

  // Goods
  public async fetchSingleGoods(goodsId: number) {
    return await this.createPublicAPI().GET<IGoodsResponse>(`goods/${goodsId}`);
  }

  // Goods category
  public async fetchSingleGoodsCategory(goodsCategoryId: number) {
    return await this.createPublicAPI().GET<IGoodsCategoryResponse>(`goods/category/${goodsCategoryId}`);
  }

  // Goods combination
  public async fetchSingleGoodsCombination(goodsCombinationId: number) {
    return await this.createPublicAPI().GET<IGoodsCombinationResponse>(`goods/combination/${goodsCombinationId}`);
  }
}
