import * as CT from "@myboothmanager/common";
import { useAuthStore } from "@/stores/auth";

export default class AdminAPI {
  private static readonly API: CT.APICaller = new CT.APICaller(import.meta.env.VITE_MBM_API_SERVER_URL, "admin", () => useAuthStore().authTokenData!.accessToken);

  /* Admin FE specific API call wrapper */
  private static async apiCallWrapper<T>(callee: () => Promise<T | CT.IBackendErrorResponse>): Promise<T | CT.ErrorCodes> {
    const response = await callee() as T | CT.IBackendErrorResponse;

    if((response as CT.IBackendErrorResponse).errorCode) {
      return (response as CT.IBackendErrorResponse).errorCode as CT.ErrorCodes;
    } else {
      return response as T;
    }
  }

  /* == Endpoints == */
  /* Common */
  static async checkAPIServerAlive(): Promise<boolean> {
    // Try max 3 times
    for(let i = 0; i < 3; i++) {
      if(await this.API.checkAPIServerAlive()) {
        return true;
      }
    }

    return false;
  }

  /* Auth */
  static async login(payload: CT.IAccountLoginRequest) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/login", payload, false));
  }

  static async logout(payload: { id: number }) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.POST("auth/logout", payload, false));
  }

  static async refreshAuth(payload: { id: number, refreshToken: string }) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/refresh", payload));
  }

  /* Fetch */
  static async fetchCurrentAccountInfo() {
    return await this.apiCallWrapper<CT.IAccountResponse>(() => this.API.GET("account"));
  }

  static async fetchSingleBooth(boothId: number, setLast: boolean = true) {
    const setLastParam = setLast ? "?setLast=true" : "";
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.GET(`booth/${boothId}${setLastParam}`));
  }

  static async fetchAllBooths() {
    return await this.apiCallWrapper<Array<CT.IBoothResponse>>(() => this.API.GET("booth"));
  }

  static async fetchAllMembersOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllMembersOfBooth(boothId));
  }

  static async fetchAllGoodsOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllGoodsOfBooth(boothId));
  }

  static async countAllGoodsOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchCountAllGoodsOfBooth(boothId));
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllGoodsCategoryOfBooth(boothId));
  }

  static async fetchAllGoodsOrdersOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsOrderResponse>>(() => this.API.GET(`booth/${boothId}/goods/order`));
  }

  static async fetchAllGoodsCombinationOfBooth(boothId: number) {
    return await this.apiCallWrapper(() => this.API.fetchAllGoodsCombinationOfBooth(boothId));
  }

  /* Update */
  static async updateBoothInfo(boothId: number, payload: CT.IBoothUpdateRequest) {
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.PATCH(`booth/${boothId}`, payload));
  }

  static async updateBoothStatus(boothId: number, payload: CT.IBoothStatusUpdateRequest) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.PATCH(`booth/${boothId}/status`, payload));
  }

  static async updateBoothMemberInfo(boothId: number, memberId: number, payload: CT.IBoothMemberUpdateRequest) {
    return await this.apiCallWrapper<CT.IBoothMember>(() => this.API.PATCH(`booth/${boothId}/member/${memberId}`, payload));
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.PATCH(`goods/${goodsId}`, payload));
  }

  static async updateGoodsCategoryInfo(categoryId: number, payload: CT.IGoodsCategoryUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.PATCH(`goods/category/${categoryId}`, payload));
  }

  static async updateGoodsOrderStatus(orderId: number, boothId: number, payload: CT.IGoodsOrderStatusUpdateRequest) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.PATCH(`goods/order/${orderId}/status?bId=${boothId}`, payload));
  }

  static async updateGoodsCombinationInfo(combinationId: number, payload: CT.IGoodsCombinationUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCombinationResponse>(() => this.API.PATCH(`goods/combination/${combinationId}`, payload));
  }

  /* Create */
  static async createAccount(currentUserData: CT.IAccountUserland, payload: CT.IAccountCreateRequest) {
    if(currentUserData.superAdmin)
      return await this.apiCallWrapper<CT.IAccountResponse>(() => this.API.POST("account", payload));
    else return CT.ErrorCodes.NO_ACCESS;
  }

  static async createBooth(payload: CT.IBoothCreateRequest) {
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.POST("booth", payload));
  }

  static async createBoothMember(boothId: number, payload: CT.IBoothMemberCreateRequest) {
    return await this.apiCallWrapper<CT.IBoothMember>(() => this.API.POST(`booth/${boothId}/member`, payload));
  }

  static async createGoods(payload: CT.IGoodsCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.POST("goods", payload));
  }

  static async createGoodsCategory(payload: CT.IGoodsCategoryCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.POST("goods/category", payload));
  }

  static async createGoodsOrder(payload: CT.IGoodsOrderCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsOrderResponse>(() => this.API.POST("goods/order", payload));
  }

  static async createGoodsCombination(payload: CT.IGoodsCombinationCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCombinationResponse>(() => this.API.POST("goods/combination", payload));
  }

  /* Upload */
  static async uploadBoothBannerImage(boothId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.IValueResponse>(() => this.API.POSTMultipart(`booth/${boothId}/banner`, formData));
  }

  static async uploadBoothInfoImage(boothId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.IValueResponse>(() => this.API.POSTMultipart(`booth/${boothId}/infoimage`, formData));
  }

  static async uploadBoothMemberImage(boothId: number, memberId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.IValueResponse>(() => this.API.POSTMultipart(`booth/${boothId}/member/${memberId}/image`, formData));
  }

  static async uploadGoodsImage(boothId: number, goodsId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.IValueResponse>(() => this.API.POSTMultipart(`goods/${goodsId}/image?bId=${boothId}`, formData));
  }

  static async uploadGoodsCombinationImage(boothId: number, combinationId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.IValueResponse>(() => this.API.POSTMultipart(`goods/combination/${combinationId}/image?bId=${boothId}`, formData));
  }

  /* Delete */
  static async deleteBoothBannerImage(boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/banner`));
  }

  static async deleteBoothInfoImage(boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/infoimage`));
  }

  static async deleteBoothMember(boothId: number, memberId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/member/${memberId}`));
  }

  static async deleteBoothMemberImage(boothId: number, memberId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/member/${memberId}/image`));
  }

  static async deleteGoods(goodsId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/${goodsId}?bId=${boothId}`));
  }

  static async deleteGoodsImage(goodsId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/${goodsId}/image?bId=${boothId}`));
  }

  static async deleteGoodsCategory(categoryId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/category/${categoryId}`));
  }

  static async deleteGoodsCombination(combinationId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/combination/${combinationId}?bId=${boothId}`));
  }

  static async deleteGoodsCombinationImage(combinationId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/combination/${combinationId}/image?bId=${boothId}`));
  }
}
