import * as C from "@myboothmanager/common";
import { defineStore } from "pinia";
import $router from "@/plugins/router";
import AdminAPI from "@/lib/api-admin";
import { GoodsAdmin, GoodsCombinationAdmin } from "@/lib/classes";
import { useAdminStore } from "./admin";
import { useAuthStore } from "./auth";

const useAdminAPIStore = defineStore("admin-api", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $adminStore = useAdminStore();
  const $authStore  = useAuthStore();

  /* *** Private states (NOT TO BE EXPORTED) *** */
  let apiFetchErrorSnackbarId = crypto.randomUUID();
  let apiErrorSnackbarId = crypto.randomUUID();

  /* *** Private actions (NOT TO BE EXPORTED) *** */
  async function apiWrapper<T>(func: () => Promise<T | C.ErrorCodes>): Promise<T | C.ErrorCodes> {
    /* Call(fetch) API function */
    let result;
    try {
      result = await func();
    } catch(err) {
      console.error(err);

      // Show API fetch error global snackbar
      $adminStore.globalSnackbarContexts.removeImmediate(apiFetchErrorSnackbarId);
      apiFetchErrorSnackbarId = $adminStore.globalSnackbarContexts.add({
        type: "error",
        text: "API를 호출할 수 없습니다. 인터넷 연결을 확인해주세요.",
        timeout: 30000,
      });

      return C.ErrorCodes.UNKNOWN_ERROR;
    }

    // If API call is successful, remove fetch error snackbar if exists
    $adminStore.globalSnackbarContexts.removeImmediate(apiFetchErrorSnackbarId);

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

        default: {
          // Show API error global snackbar
          $adminStore.globalSnackbarContexts.removeImmediate(apiErrorSnackbarId);
          apiErrorSnackbarId = $adminStore.globalSnackbarContexts.add({
            type: "error",
            text: `API 호출 중 오류가 발생했습니다. (오류 코드: ${result as C.ErrorCodes})`,
            timeout: 30000,
          });
          break;
        }
      }
    }

    return result;
  }

  async function simplifyAPICall<T>(
    apiFunc: () => Promise<T | C.ErrorCodes>,
    afterFetchFunc: (response: T) => unknown | Promise<unknown>,
    snackbarSuccessText?: string,
    snackbarErrorText?: string,
  ): Promise<true | C.ErrorCodes> {
    const response = await apiWrapper(apiFunc);

    if(response && typeof response !== "number") {
      await afterFetchFunc(response);

      if(snackbarSuccessText) {
        $adminStore.globalSnackbarContexts.add({
          type: "success",
          text: snackbarSuccessText,
          timeout: 2000,
        });
      }

      return true;
    } else {
      if(snackbarErrorText) {
        $adminStore.globalSnackbarContexts.add({
          type: "error",
          text: `${snackbarErrorText} (code: ${response})`,
          timeout: 5000,
        });
      }

      return response as C.ErrorCodes;
    }
  }

  /* *** Actions *** */
  /* Support */
  async function sendFeedback(payload: C.IFeedbackRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.sendFeedback(payload),
      () => { },
      "피드백 전송 성공. 소중한 의견 감사합니다!",
      "피드백 전송 실패",
    );
  }

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
      "부스 생성 성공",
      "부스 생성 실패",
    );
  }

  async function updateCurrentBoothInfo(payload: C.IBoothUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothInfo($adminStore.currentBooth.booth!.id, payload),
      (response) => $adminStore.currentBooth.booth = response,
      "부스 정보 업데이트 성공",
      "부스 정보 업데이트 실패",
    );
  }

  async function updateCurrentBoothStatus(payload: C.IBoothStatusUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothStatus($adminStore.currentBooth.booth!.id, payload),
      (response) => {
        $adminStore.currentBooth.booth!.status = { ...$adminStore.currentBooth.booth!.status, ...response };
      },
      "부스 운영 상태 변경 성공",
      "부스 운영 상태 변경 실패",
    );
  }

  async function updateCurrentBoothNotice(payload: string): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothNotice($adminStore.currentBooth.booth!.id, { noticeContent: payload }),
      (response) => $adminStore.currentBooth.booth!.noticeContent = response.value,
      "부스 공지사항 업데이트 성공",
      "부스 공지사항 업데이트 실패",
    );
  }

  async function uploadBoothBannerImage(payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothBannerImage($adminStore.currentBooth.booth!.id, payload),
      () => fetchSingleBoothOfCurrentAccount($adminStore.currentBooth.booth!.id),
      "부스 배너 이미지 업로드 성공",
      "부스 배너 이미지 업로드 실패",
    );
  }

  async function deleteBoothBannerImage(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothBannerImage($adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.booth!.bannerImage,
      "부스 배너 이미지 삭제 성공",
      "부스 배너 이미지 삭제 실패",
    );
  }

  async function uploadBoothInfoImage(payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothInfoImage($adminStore.currentBooth.booth!.id, payload),
      () => fetchSingleBoothOfCurrentAccount($adminStore.currentBooth.booth!.id),
      "부스 인포 이미지 업로드 성공",
      "부스 인포 이미지 업로드 실패",
    );
  }

  async function deleteBoothInfoImage(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothInfoImage($adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.booth!.infoImage,
      "부스 인포 이미지 삭제 성공",
      "부스 인포 이미지 삭제 실패",
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
      "부스 멤버 추가 성공",
      "부스 멤버 추가 실패",
    );
  }

  async function updateBoothMemberInfo(memberId: number, payload: C.IBoothMemberUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothMemberInfo($adminStore.currentBooth.booth!.id, memberId, payload),
      (response) => $adminStore.currentBooth.boothMembers![memberId] = response,
      "부스 멤버 정보 업데이트 성공",
      "부스 멤버 정보 업데이트 실패",
    );
  }

  async function uploadBoothMemberImage(memberId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadBoothMemberImage($adminStore.currentBooth.booth!.id, memberId, payload),
      () => fetchBoothMembersOfCurrentBooth(),
      "부스 멤버 이미지 업로드 성공",
      "부스 멤버 이미지 업로드 실패",
    );
  }

  async function deleteBoothMemberImage(memberId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothMemberImage($adminStore.currentBooth.booth!.id, memberId),
      () => delete $adminStore.currentBooth.boothMembers![memberId].avatarImage,
      "부스 멤버 이미지 삭제 성공",
      "부스 멤버 이미지 삭제 실패",
    );
  }

  async function deleteBoothMember(memberId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteBoothMember($adminStore.currentBooth.booth!.id, memberId),
      async () => {
        delete $adminStore.currentBooth.boothMembers![memberId];
        await fetchGoodsOfCurrentBooth();
      },
      "부스 멤버 삭제 성공",
      "부스 멤버 삭제 실패",
    );
  }

  /* Goods */
  async function fetchGoodsOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goods) $adminStore.currentBooth.goods = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goods);
        for(const goods of response) $adminStore.currentBooth.goods[goods.id] = new GoodsAdmin(goods);
      },
    );
  }

  async function createGoods(payload: C.IGoodsCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createGoods(payload),
      (response) => {
        if(!$adminStore.currentBooth.goods) $adminStore.currentBooth.goods = {};
        $adminStore.currentBooth.goods[response.id] = new GoodsAdmin(response);
      },
      "굿즈 생성 성공",
      "굿즈 생성 실패",
    );
  }

  async function updateGoodsInfo(goodsId: number, payload: C.IGoodsUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateGoodsInfo(goodsId, payload),
      async (response) => {
        $adminStore.currentBooth.goods![goodsId].update(response);
        if(response.combinationId) await fetchGoodsCombinationsOfCurrentBooth();
      },
      "굿즈 정보 업데이트 성공",
      "굿즈 정보 업데이트 실패",
    );
  }

  async function uploadGoodsImage(goodsId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadGoodsImage($adminStore.currentBooth.booth!.id, goodsId, payload),
      () => fetchGoodsOfCurrentBooth(),
      "굿즈 이미지 업로드 성공",
      "굿즈 이미지 업로드 실패",
    );
  }

  async function deleteGoodsImage(goodsId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsImage(goodsId, $adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.goods![goodsId].goodsImage,
      "굿즈 이미지 삭제 성공",
      "굿즈 이미지 삭제 실패",
    );
  }

  async function deleteGoods(goodsId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoods(goodsId, $adminStore.currentBooth.booth!.id),
      async () => {
        delete $adminStore.currentBooth.goods![goodsId];
        await fetchGoodsCombinationsOfCurrentBooth();
      },
      "굿즈 삭제 성공",
      "굿즈 삭제 실패",
    );
  }

  /* Goods Combination */
  async function fetchGoodsCombinationsOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllGoodsCombinationOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.goodsCombinations) $adminStore.currentBooth.goodsCombinations = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.goodsCombinations);
        for(const combination of response) $adminStore.currentBooth.goodsCombinations[combination.id] = new GoodsCombinationAdmin(combination);
      },
    );
  }

  async function createGoodsCombination(payload: C.IGoodsCombinationCreateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.createGoodsCombination(payload),
      async (response) => {
        if(!$adminStore.currentBooth.goodsCombinations) $adminStore.currentBooth.goodsCombinations = {};
        $adminStore.currentBooth.goodsCombinations[response.id] = new GoodsCombinationAdmin(response);
        await fetchGoodsOfCurrentBooth();
      },
      "굿즈 세트 생성 성공",
      "굿즈 세트 생성 실패",
    );
  }

  async function updateGoodsCombinationInfo(combinationId: number, payload: C.IGoodsCombinationUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateGoodsCombinationInfo(combinationId, payload),
      async (response) => {
        $adminStore.currentBooth.goodsCombinations![combinationId].update(response);
        await fetchGoodsOfCurrentBooth();
      },
      "굿즈 세트 정보 업데이트 성공",
      "굿즈 세트 정보 업데이트 실패",
    );
  }

  async function uploadGoodsCombinationImage(combinationId: number, payload: File | Blob): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.uploadGoodsCombinationImage($adminStore.currentBooth.booth!.id, combinationId, payload),
      () => fetchGoodsCombinationsOfCurrentBooth(),
      "굿즈 세트 이미지 업로드 성공",
      "굿즈 세트 이미지 업로드 실패",
    );
  }

  async function deleteGoodsCombinationImage(combinationId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCombinationImage(combinationId, $adminStore.currentBooth.booth!.id),
      () => delete $adminStore.currentBooth.goodsCombinations![combinationId].goodsImage,
      "굿즈 세트 이미지 삭제 성공",
      "굿즈 세트 이미지 삭제 실패",
    );
  }

  async function deleteGoodsCombination(combinationId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCombination(combinationId, $adminStore.currentBooth.booth!.id),
      async () => {
        delete $adminStore.currentBooth.goodsCombinations![combinationId];
        await fetchGoodsOfCurrentBooth();
      },
      "굿즈 세트 삭제 성공",
      "굿즈 세트 삭제 실패",
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
      "굿즈 카테고리 생성 성공",
      "굿즈 카테고리 생성 실패",
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
      "굿즈 카테고리 정보 업데이트 성공",
      "굿즈 카테고리 정보 업데이트 실패",
    );

    return apiResponse;
  }

  async function deleteGoodsCategory(categoryId: number): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.deleteGoodsCategory(categoryId, $adminStore.currentBooth.booth!.id),
      async () => {
        delete $adminStore.currentBooth.goodsCategories![categoryId];
        await fetchGoodsOfCurrentBooth();
        await fetchGoodsCombinationsOfCurrentBooth();
      },
      "굿즈 카테고리 삭제 성공",
      "굿즈 카테고리 삭제 실패",
    );
  }

  /* Booth Order */
  async function fetchBoothOrdersOfCurrentBooth(): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.fetchAllOrdersOfBooth($adminStore.currentBooth.booth!.id),
      (response) => {
        if(!$adminStore.currentBooth.orders) $adminStore.currentBooth.orders = {};
        C.emptyNumberKeyObject($adminStore.currentBooth.orders);
        for(const order of response) $adminStore.currentBooth.orders[order.id] = { ...order };
      },
    );
  }

  async function createBoothOrder(payload: C.IGoodsOrderCreateRequest): Promise<number | C.ErrorCodes> {
    let createdOrderId = -1;

    await simplifyAPICall(
      () => AdminAPI.createBoothOrder($adminStore.currentBooth.booth!.id, payload),
      (response) => {
        if(!$adminStore.currentBooth.orders) $adminStore.currentBooth.orders = {};
        $adminStore.currentBooth.orders[response.id] = response;
        createdOrderId = response.id;
      },
      // "굿즈 판매 기록 생성 성공",
      // "굿즈 판매 기록 생성 실패",    // Currently snackbar is being added in the component
    );

    return createdOrderId;
  }

  async function updateBoothOrderStatus(orderId: number, payload: C.IGoodsOrderStatusUpdateRequest): Promise<true | C.ErrorCodes> {
    return await simplifyAPICall(
      () => AdminAPI.updateBoothOrderStatus(orderId, $adminStore.currentBooth.booth!.id, payload),
      async () => {
        $adminStore.currentBooth.orders![orderId] = { ...$adminStore.currentBooth.orders![orderId], ...payload };
        await fetchGoodsOfCurrentBooth();
      },
      "굿즈 판매 기록 상태 변경 성공",
      "굿즈 판매 기록 상태 변경 실패",
    );
  }


  return {
    sendFeedback,

    fetchCurrentAccountInfo,

    fetchSingleBoothOfCurrentAccount,
    fetchAllBoothsOfCurrentAccount,
    createBooth,
    updateCurrentBoothInfo,
    updateCurrentBoothStatus,
    updateCurrentBoothNotice,
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

    fetchGoodsOrdersOfCurrentBooth: fetchBoothOrdersOfCurrentBooth,
    createGoodsOrder: createBoothOrder,
    updateGoodsOrderStatus: updateBoothOrderStatus,
  };
});

export { useAdminAPIStore };
