import * as CT from "@myboothmanager/common";
import { useAuthLocalStore } from "@/plugins/stores/auth";

export class BaseAdminAPI {
  protected static readonly API: CT.APICaller = new CT.APICaller({
    host: import.meta.env.VITE_MBM_API_SERVER_URL,
    getAuthorizationToken: () => useAuthLocalStore().accessToken!,
  });

  /* Admin FE specific API call wrapper */
  protected static async apiCallWrapper<T>(callee: () => Promise<T | CT.IErrorResponse>): Promise<T | CT.ErrorCodes> {
    const response = await callee() as T | CT.IErrorResponse;

    if(typeof ((response as CT.IErrorResponse).errorCode) === "number") {
      return (response as CT.IErrorResponse).errorCode as CT.ErrorCodes;
    } else {
      return response as T;
    }
  }
}

export default class AdminAPI extends BaseAdminAPI {
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

  static async sendFeedback(payload: CT.IFeedbackRequest) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.sendFeedback(payload));
  }

  /* Auth */
  static async login(payload: CT.IAccountLoginRequest) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/login", payload, true, false));
  }

  static async logout(payload: { id: number }) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.POST("auth/logout", payload, true, false));
  }

  static async refreshAuth(payload: CT.IAccountAuthRefreshRequest) {
    return await this.apiCallWrapper<CT.IAccountLoginResponse>(() => this.API.POST("auth/refresh", payload, true, true));
  }

  static async checkAuth() {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.GET("auth/check"));
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
    return await this.apiCallWrapper<Array<CT.IBoothMemberResponse>>(() => this.API.GET(`booth/${boothId}/member`));
  }

  static async fetchAllOrdersOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsOrderResponse>>(() => this.API.GET(`booth/${boothId}/order`));
  }

  static async fetchAllGoodsOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsResponse>>(() => this.API.GET(`booth/${boothId}/goods`));
  }

  static async fetchAllGoodsCombinationOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsCombinationResponse>>(() => this.API.GET(`booth/${boothId}/goods/combination`));
  }

  static async fetchAllGoodsCategoriesOfBooth(boothId: number) {
    return await this.apiCallWrapper<Array<CT.IGoodsCategoryResponse>>(() => this.API.GET(`booth/${boothId}/goods/category`));
  }

  static async fetchAvailableFairs() {
    return await this.apiCallWrapper<Array<CT.IFairResponse>>(() => this.API.fetchAvailableFairs());
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

  static async updateBoothOrderStatus(orderId: number, boothId: number, payload: CT.IGoodsOrderStatusUpdateRequest) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.PATCH(`booth/${boothId}/order/${orderId}/status`, payload));
  }

  static async updateGoodsInfo(goodsId: number, payload: CT.IGoodsUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.PATCH(`goods/${goodsId}`, payload));
  }

  static async updateGoodsCategoryInfo(categoryId: number, payload: CT.IGoodsCategoryUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.PATCH(`goods/category/${categoryId}`, payload));
  }

  static async updateGoodsCombinationInfo(combinationId: number, payload: CT.IGoodsCombinationUpdateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCombinationResponse>(() => this.API.PATCH(`goods/combination/${combinationId}`, payload));
  }

  /* Create */
  static async createBooth(payload: CT.IBoothCreateRequest | CT.IBoothCreateWithFairRequest) {
    return await this.apiCallWrapper<CT.IBoothResponse>(() => this.API.POST("booth", payload));
  }

  static async createBoothMember(boothId: number, payload: CT.IBoothMemberCreateRequest) {
    return await this.apiCallWrapper<CT.IBoothMember>(() => this.API.POST(`booth/${boothId}/member`, payload));
  }

  static async createBoothOrder(boothId: number, payload: CT.IGoodsOrderCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsOrderResponse>(() => this.API.POST(`booth/${boothId}/order`, payload));
  }

  static async createGoods(payload: CT.IGoodsCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsResponse>(() => this.API.POST("goods", payload));
  }

  static async createGoodsCategory(payload: CT.IGoodsCategoryCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCategoryResponse>(() => this.API.POST("goods/category", payload));
  }

  static async createGoodsCombination(payload: CT.IGoodsCombinationCreateRequest) {
    return await this.apiCallWrapper<CT.IGoodsCombinationResponse>(() => this.API.POST("goods/combination", payload));
  }

  /* Upload */
  static async uploadBoothBannerImage(boothId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.ISingleValueResponse<string>>(() => this.API.POSTMultipart(`booth/${boothId}/image/banner`, formData));
  }

  static async uploadBoothInfoImage(boothId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.ISingleValueResponse<string>>(() => this.API.POSTMultipart(`booth/${boothId}/image/info`, formData));
  }

  static async uploadBoothMemberImage(boothId: number, memberId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.ISingleValueResponse<string>>(() => this.API.POSTMultipart(`booth/${boothId}/member/${memberId}/image/avatar`, formData));
  }

  static async uploadGoodsImage(boothId: number, goodsId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.ISingleValueResponse<string>>(() => this.API.POSTMultipart(`goods/${goodsId}/image/primary?bId=${boothId}`, formData));
  }

  static async uploadGoodsCombinationImage(boothId: number, combinationId: number, image: Blob) {
    const formData = new FormData();
    formData.set("0", image);
    return await this.apiCallWrapper<CT.ISingleValueResponse<string>>(() => this.API.POSTMultipart(`goods/combination/${combinationId}/image/primary?bId=${boothId}`, formData));
  }

  /* Delete */
  static async deleteBoothBannerImage(boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/image/banner`));
  }

  static async deleteBoothInfoImage(boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/image/info`));
  }

  static async deleteBoothMember(boothId: number, memberId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/member/${memberId}`));
  }

  static async deleteBoothMemberImage(boothId: number, memberId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`booth/${boothId}/member/${memberId}/image/avatar`));
  }

  static async deleteGoods(goodsId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/${goodsId}?bId=${boothId}`));
  }

  static async deleteGoodsImage(goodsId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/${goodsId}/image/primary?bId=${boothId}`));
  }

  static async deleteGoodsCategory(categoryId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/category/${categoryId}?bId=${boothId}`));
  }

  static async deleteGoodsCombination(combinationId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/combination/${combinationId}?bId=${boothId}`));
  }

  static async deleteGoodsCombinationImage(combinationId: number, boothId: number) {
    return await this.apiCallWrapper<CT.ISuccessResponse>(() => this.API.DELETE(`goods/combination/${combinationId}/image/primary?bId=${boothId}`));
  }
}
