import {
  HTTP_HEALTH_CHECK_STATUS_CODE,
  type IErrorResponse,
  type IBoothMemberResponse,
  type IBoothResponse,
  type IGoodsCategoryResponse,
  type IGoodsCombinationResponse,
  type IGoodsResponse,
  type ISingleValueResponse,
  type IFairResponse,
  type IFeedbackRequest,
  type ISuccessResponse,
} from "..";

type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const MAX_UPLOAD_FILE_BYTES = (1024 * 1024) * 15;  // 15MB

export interface APICallerOptions {
  host: string;
  prefix: string,
  /** @deprecated */ group: string;
  healthCheckPath: string;
  getAuthorizationToken: () => string | null | undefined;
}

export default class APICaller {
  private static readonly FETCH_COMMON_OPTIONS: Readonly<Partial<RequestInit>> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  } as const;

  constructor(private readonly options: Partial<APICallerOptions>) { }

  private get normalizedOptions(): APICallerOptions {
    return {
      host: "http://localhost:20000",
      prefix: "v2",
      healthCheckPath: "healthcheck",
      getAuthorizationToken: () => undefined,
      ...this.options,

      // deprecated
      group: "",
    };
  }

  /* Public APIs */
  private readonly createPublicAPI = () => new APICaller({ host: this.normalizedOptions.host });

  /* Basic fetch function */
  private async callAPIInternal<T>(method: HTTPMethodString, path: string, payload?: BodyInit, additionalInitOptions?: RequestInit, containAuthCookie: boolean = false, containAuthCredential: boolean = true): Promise<T | IErrorResponse> {
    const prefix = this.normalizedOptions.prefix.length > 0 ? `/${this.normalizedOptions.prefix}` : "";
    const group = this.normalizedOptions.group.length > 0 ? `/${this.normalizedOptions.group}` : "";
    const url = new URL(`${prefix}${group}/${path}`, this.normalizedOptions.host);

    const response = await fetch(url, {
      ...additionalInitOptions,
      method,
      body: payload,
      headers: {
        ...additionalInitOptions?.headers ?? { },
        ...containAuthCredential && this.normalizedOptions.getAuthorizationToken ? { Authorization: `Bearer ${this.normalizedOptions.getAuthorizationToken()}` } : { },
      },
      ...containAuthCookie ? { credentials: "include" } : { credentials: "omit" },
    });

    return await response.json() as T;
  }

  public callAPI<T>(method: HTTPMethodString, path: string, payload?: Record<never, never>, containAuthCookie: boolean = false, containAuthCredential: boolean = true): Promise<T | IErrorResponse> {
    return this.callAPIInternal<T>(
      method,
      path,
      payload ? JSON.stringify(payload) : undefined, APICaller.FETCH_COMMON_OPTIONS,
      containAuthCookie,
      containAuthCredential,
    );
  }

  /* Fetch function shortcuts */
  public async GET<T>(path: string, payload?: Record<never, never>, containAuthCookie = false, containAuthCredential = true) { return await this.callAPI<T>("GET", path, payload, containAuthCookie, containAuthCredential); }
  public async POST<T>(path: string, payload: Record<never, never>, containAuthCookie = false, containAuthCredential = true) { return await this.callAPI<T>("POST", path, payload, containAuthCookie, containAuthCredential); }
  public async PUT<T>(path: string, payload: Record<never, never>, containAuthCookie = false, containAuthCredential = true) { return await this.callAPI<T>("PUT", path, payload, containAuthCookie, containAuthCredential); }
  public async PATCH<T>(path: string, payload: Record<never, never>, containAuthCookie = false, containAuthCredential = true) { return await this.callAPI<T>("PATCH", path, payload, containAuthCookie, containAuthCredential); }
  public async DELETE<T>(path: string, payload?: Record<never, never>, containAuthCookie = false, containAuthCredential = true) { return await this.callAPI<T>("DELETE", path, payload, containAuthCookie, containAuthCredential); }

  public async POSTMultipart<T>(path: string, payload: FormData): Promise<T | IErrorResponse> {
    return this.callAPIInternal<T>("POST", path, payload, undefined, false, true);
  }

  /* API endpoints below is predefined public endpoints */
  // Server
  public async checkAPIServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.normalizedOptions.host}/${this.normalizedOptions.healthCheckPath}`, APICaller.FETCH_COMMON_OPTIONS);

      if(response && response.status === HTTP_HEALTH_CHECK_STATUS_CODE) return true;
      else return false;
    } catch(error) {
      console.debug("Can't connect to API server! ;(");
      return false;
    }
  }

  // Support
  public async sendFeedback(feedback: IFeedbackRequest) {
    return await this.createPublicAPI().POST<ISuccessResponse>("support/feedback", feedback);
  }

  // Booth
  public async checkBoothPublicAccess(boothId: number) {
    return await this.createPublicAPI().GET<ISingleValueResponse<boolean>>(`booth/${boothId}/public-access`);
  }

  public async fetchAllBooths() {
    return await this.createPublicAPI().GET<Array<IBoothResponse>>("booth");
  }

  public async fetchSingleBooth(boothId: number) {
    return await this.createPublicAPI().GET<IBoothResponse>(`booth/${boothId}`);
  }

  public async fetchAllGoodsOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsResponse>>(`booth/${boothId}/goods`);
  }

  public async fetchAllGoodsCategoryOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsCategoryResponse>>(`booth/${boothId}/goods/category`);
  }

  public async fetchAllGoodsCombinationOfBooth(boothId: number) {
    return await this.createPublicAPI().GET<Array<IGoodsCombinationResponse>>(`booth/${boothId}/goods/combination`);
  }

  public async fetchAvailableFairs() {
    return await this.createPublicAPI().GET<Array<IFairResponse>>("fair");
  }

  public async fetchSingleFair(fairId: number) {
    return await this.createPublicAPI().GET<IFairResponse>(`fair/${fairId}`);
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
