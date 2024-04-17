import * as C from "@myboothmanager/common";
import { Goods, GoodsCombination } from "@myboothmanager/common-ui";
import { defineStore } from "pinia";
import { ref } from "vue";
import $router from "@/plugins/router";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./admin";
import { useAuthStore } from "./auth";

const useAdminAPIStore = defineStore("admin-api", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $adminStore = useAdminStore();
  const $authStore  = useAuthStore();

  /* *** States *** */
  const isAPIFetchError  = ref(false);
  const lastAPIErrorCode = ref<C.ErrorCodes | null>(null);

  /* *** Private actions (NOT TO BE EXPORTED) *** */
  async function apiWrapper<T>(func: () => Promise<T | C.ErrorCodes>): Promise<T | C.ErrorCodes> {
    isAPIFetchError.value = false;
    lastAPIErrorCode.value = null;

    /* Call(fetch) API function */
    let result;
    try {
      result = await func();
    } catch(err) {
      isAPIFetchError.value = true;
      return C.ErrorCodes.UNKNOWN_ERROR;
    }

    /* Handle API errors */
    if(typeof result === "number") {
      switch(result as C.ErrorCodes) {
        // When need auth token refresh
        case C.ErrorCodes.AUTH_TOKEN_NEED_REFRESH: {
          // Try to refresh auth token and retry API call
          const refreshResult = await $authStore.adminAuthRefresh();

          if(typeof refreshResult === "boolean" && refreshResult === true) {
            return await apiWrapper(func);
          }

          break;
        }

        // When need relogin
        case C.ErrorCodes.INVALID_AUTH_TOKEN:
        case C.ErrorCodes.NEED_RELOGIN: {
          // Force logout
          $router.replace({ name: "logout", state: { authTokenInvalid: true } });
          break;
        }
      }

      // Set error code
      lastAPIErrorCode.value = result;
    }

    return result;
  }
  async function simplifyAPICall<T>(
    apiFunc: () => Promise<T | C.ErrorCodes>,
    afterFetchFunc: (response: T) => any | Promise<any>,
  ): Promise<true | C.ErrorCodes> {
    const response = await apiWrapper(apiFunc);

    if(response && typeof response !== "number") {
      await afterFetchFunc(response);
      return true;
    } else {
      return response as C.ErrorCodes;
    }
  }

  /* *** Actions *** */
  /* Account */
  async function fetchCurrentAccountInfo(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchCurrentAccountInfo(),
      (response) => $adminStore.currentAccount = response,
    );
  }

  /* Booth */
  async function fetchSingleBoothOfCurrentAccount(boothId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchSingleBooth(boothId),
      (response) => $adminStore.currentBooth.booth = response,
    );
  }

  async function fetchAllBoothsOfCurrentAccount(): Promise<Array<C.IBooth> | C.ErrorCodes> {
    let apiResponse: Array<C.IBooth> = [];
    const errorCode = await simplifyAPICall(
      () => AdminAPI.fetchAllBooths(),
      (response) => apiResponse = response,
    );

    if(typeof errorCode === "number") return errorCode;
    return apiResponse;
  }

  async function createBooth(payload: C.IBoothCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createBooth(payload),
      (response) => $adminStore.changeBooth(response.id),
    );
  }

  async function updateCurrentBoothInfo(payload: C.IBoothUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothInfo($adminStore.currentBooth.booth!.id, payload),
      (response) => $adminStore.currentBooth.booth = response,
    );
  }

  async function updateCurrentBoothStatus(payload: C.IBoothStatusUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothStatus($adminStore.currentBooth.booth!.id, payload),
      () => $adminStore.currentBooth.booth! = { ...$adminStore.currentBooth.booth!, ...payload },
    );
  }

  async function uploadBoothBannerImage(payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothBannerImage($adminStore.currentBooth.booth!.id, payload),
      (response) => $adminStore.currentBooth.booth!.bannerImageUrl = response.value as string,
    );
  }

  async function deleteBoothBannerImage(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothBannerImage($adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.booth!.bannerImageUrl,
    );
  }

  async function uploadBoothInfoImage(payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothInfoImage($adminStore.currentBooth.booth!.id, payload),
      (response) => $adminStore.currentBooth.booth!.infoImageUrl = response.value as string,
    );
  }

  async function deleteBoothInfoImage(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothInfoImage($adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.booth!.infoImageUrl,
    );
  }

  /* Booth Member */
  async function fetchBoothMembersOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllMembersOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.boothMembers) $adminStore.currentBooth.boothMembers = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.boothMembers);
        for(const member of response) $adminStore.currentBooth.boothMembers[member.id] = member;
      },
    );
  }

  async function createBoothMember(payload: C.IBoothMemberCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createBoothMember($adminStore.currentBooth.booth!.id, payload),
      (response) => {
        if(!$adminStore.currentBooth.boothMembers) $adminStore.currentBooth.boothMembers = {};
        $adminStore.currentBooth.boothMembers[response.id] = response;
      },
    );
  }

  async function updateBoothMemberInfo(memberId: number, payload: C.IBoothMemberUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothMemberInfo($adminStore.currentBooth.booth!.id, memberId, payload),
      (response) => $adminStore.currentBooth.boothMembers![memberId] = response,
    );
  }

  async function uploadBoothMemberImage(memberId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothMemberImage($adminStore.currentBooth.booth!.id, memberId, payload),
      (response) => $adminStore.currentBooth.boothMembers![memberId].memberImageUrl = response.value as string,
    );
  }

  async function deleteBoothMemberImage(memberId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothMemberImage($adminStore.currentBooth.booth!.id, memberId),
      () => delete $adminStore.currentBooth.boothMembers![memberId].memberImageUrl,
    );
  }

  async function deleteBoothMember(memberId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothMember($adminStore.currentBooth.booth!.id, memberId),
      async () => {
        delete $adminStore.currentBooth.boothMembers![memberId];
        await fetchGoodsOfCurrentBooth();
      },
    );
  }

  /* Goods */
  async function fetchGoodsOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goods) $adminStore.currentBooth.goods = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goods);
        for(const goods of response) $adminStore.currentBooth.goods[goods.id] = new Goods(goods);
      },
    );
  }

  async function createGoods(payload: C.IGoodsCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createGoods(payload),
      (response) => {
        if(!$adminStore.currentBooth.goods) $adminStore.currentBooth.goods = {};
        $adminStore.currentBooth.goods[response.id] = new Goods(response);
      },
    );
  }

  async function updateGoodsInfo(goodsId: number, payload: C.IGoodsUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateGoodsInfo(goodsId, payload),
      async (response) => {
        $adminStore.currentBooth.goods![goodsId].update(response);
        if(response.combinationId) await fetchGoodsCombinationsOfCurrentBooth();
      },
    );
  }

  async function uploadGoodsImage(goodsId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadGoodsImage($adminStore.currentBooth.booth!.id, goodsId, payload),
      (response) => $adminStore.currentBooth.goods![goodsId].goodsImageUrl = response.value as string,
    );
  }

  async function deleteGoodsImage(goodsId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsImage(goodsId, $adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.goods![goodsId].goodsImageUrl,
    );
  }

  async function deleteGoods(goodsId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoods(goodsId, $adminStore.currentBooth.booth!.id),
      async () => {
        delete $adminStore.currentBooth.goods![goodsId];
        await fetchGoodsCombinationsOfCurrentBooth();
      },
    );
  }

  /* Goods Combination */
  async function fetchGoodsCombinationsOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsCombinationOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goodsCombinations) $adminStore.currentBooth.goodsCombinations = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goodsCombinations);
        for(const combination of response) $adminStore.currentBooth.goodsCombinations[combination.id] = new GoodsCombination(combination);
      },
    );
  }

  async function createGoodsCombination(payload: C.IGoodsCombinationCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createGoodsCombination(payload),
      async (response) => {
        if(!$adminStore.currentBooth.goodsCombinations) $adminStore.currentBooth.goodsCombinations = {};
        $adminStore.currentBooth.goodsCombinations[response.id] = new GoodsCombination(response);
        await fetchGoodsOfCurrentBooth();
      },
    );
  }

  async function updateGoodsCombinationInfo(combinationId: number, payload: C.IGoodsCombinationUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateGoodsCombinationInfo(combinationId, payload),
      async (response) => {
        $adminStore.currentBooth.goodsCombinations![combinationId].update(response);
        await fetchGoodsOfCurrentBooth();
      },
    );
  }

  async function uploadGoodsCombinationImage(combinationId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadGoodsCombinationImage($adminStore.currentBooth.booth!.id, combinationId, payload),
      (response) => $adminStore.currentBooth.goodsCombinations![combinationId].combinationImageUrl = response.value as string,
    );
  }

  async function deleteGoodsCombinationImage(combinationId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCombinationImage(combinationId, $adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.goodsCombinations![combinationId].combinationImageUrl,
    );
  }

  async function deleteGoodsCombination(combinationId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCombination(combinationId, $adminStore.currentBooth.booth!.id),
      async () => {
        delete $adminStore.currentBooth.goodsCombinations![combinationId];
        await fetchGoodsOfCurrentBooth();
      },
    );
  }

  /* Goods Category */
  async function fetchGoodsCategoriesOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsCategoriesOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goodsCategories) $adminStore.currentBooth.goodsCategories = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goodsCategories);
        for(const category of response) $adminStore.currentBooth.goodsCategories[category.id] = category;
      },
    );
  }

  async function createGoodsCategory(payload: C.IGoodsCategoryCreateRequest): Promise<{ id: number } | C.ErrorCodes> {
    let apiResponse: { id: number } | C.ErrorCodes = C.ErrorCodes.UNKNOWN_ERROR;

    await simplifyAPICall(
      () => AdminAPI.createGoodsCategory(payload),
      (response) => {
        if(!$adminStore.currentBooth.goodsCategories) $adminStore.currentBooth.goodsCategories = {};
        $adminStore.currentBooth.goodsCategories[response.id] = response;
        apiResponse = response;
      },
    );

    return apiResponse;
  }

  async function updateGoodsCategoryInfo(categoryId: number, payload: C.IGoodsCategoryUpdateRequest): Promise<{ id: number } | C.ErrorCodes> {
    let apiResponse: { id: number } | C.ErrorCodes = C.ErrorCodes.UNKNOWN_ERROR;

    await simplifyAPICall(
      () => AdminAPI.updateGoodsCategoryInfo(categoryId, payload),
      (response) => {
        $adminStore.currentBooth.goodsCategories![categoryId] = response;
        apiResponse = response;
      },
    );

    return apiResponse;
  }

  async function deleteGoodsCategory(categoryId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCategory(categoryId),
      async () => {
        delete $adminStore.currentBooth.goodsCategories![categoryId];
        await fetchGoodsOfCurrentBooth();
        await fetchGoodsCombinationsOfCurrentBooth();
      },
    );
  }

  /* Goods Order */
  async function fetchGoodsOrdersOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsOrdersOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goodsOrders) $adminStore.currentBooth.goodsOrders = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goodsOrders);
        for(const order of response) $adminStore.currentBooth.goodsOrders[order.id] = order;
      },
    );
  }

  async function createGoodsOrder(payload: C.IGoodsOrderCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createGoodsOrder(payload),
      (response) => {
        if(!$adminStore.currentBooth.goodsOrders) $adminStore.currentBooth.goodsOrders = {};
        $adminStore.currentBooth.goodsOrders[response.id] = response;
      },
    );
  }

  async function updateGoodsOrderStatus(orderId: number, payload: C.IGoodsOrderStatusUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateGoodsOrderStatus(orderId, $adminStore.currentBooth.booth!.id, payload),
      async () => {
        $adminStore.currentBooth.goodsOrders![orderId] = { ...$adminStore.currentBooth.goodsOrders![orderId], ...payload };
        await fetchGoodsOfCurrentBooth();
      },
    );
  }


  return {
    isAPIFetchError,
    lastAPIErrorCode,

    fetchCurrentAccountInfo,

    fetchSingleBoothOfCurrentAccount,
    fetchAllBoothsOfCurrentAccount,
    createBooth,
    updateCurrentBoothInfo,
    updateCurrentBoothStatus,
    uploadBoothBannerImage,
    deleteBoothBannerImage,
    uploadBoothInfoImage,
    deleteBoothInfoImage,

    fetchBoothMembersOfCurrentBooth,
    createBoothMember,
    updateBoothMemberInfo,
    uploadBoothMemberImage,
    deleteBoothMemberImage,
    deleteBoothMember,

    fetchGoodsOfCurrentBooth,
    createGoods,
    updateGoodsInfo,
    uploadGoodsImage,
    deleteGoodsImage,
    deleteGoods,

    fetchGoodsCombinationsOfCurrentBooth,
    createGoodsCombination,
    updateGoodsCombinationInfo,
    uploadGoodsCombinationImage,
    deleteGoodsCombinationImage,
    deleteGoodsCombination,

    fetchGoodsCategoriesOfCurrentBooth,
    createGoodsCategory,
    updateGoodsCategoryInfo,
    deleteGoodsCategory,

    fetchGoodsOrdersOfCurrentBooth,
    createGoodsOrder,
    updateGoodsOrderStatus,
  };
});

export { useAdminAPIStore };
