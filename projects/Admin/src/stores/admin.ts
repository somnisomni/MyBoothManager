import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { emptyNumberKeyObject, emptyObject, type IAccountUserland, type IBooth, type IBoothCreateRequest, type IBoothStatusUpdateRequest, type IBoothUpdateReuqest, type IGoods, type IGoodsCategory, type IGoodsCategoryCreateRequest, type IGoodsCategoryUpdateRequest, type IGoodsCreateRequest, type IGoodsOrder, type IGoodsOrderCreateRequest, type IGoodsUpdateRequest } from "@myboothmanager/common";
import AdminAPI, { NEED_REFRESH_MESSAGE } from "@/lib/api-admin";
import router from "@/router";
import { useAuthStore } from "./auth";

const useAdminStore = defineStore("admin", () => {
  /* Dependencies (not to be exported) */
  const $authStore = useAuthStore();

  /* States */
  const currentAccount = ref<IAccountUserland | null>(null);
  const currentBoothId = ref<number>(-1);

  const isBoothDataLoaded = ref<boolean>(false);
  const isChangingBooth = ref<boolean>(false);

  const boothList: Record<number, IBooth> = reactive({});
  const boothGoodsCategoryList: Record<number, IGoodsCategory> = reactive({});
  const boothGoodsList: Record<number, IGoods> = reactive({});
  const boothGoodsOrderList: Record<number, IGoodsOrder> = reactive({});

  /* Private actions (not to be exported) */
  async function apiWrapper<T>(func: () => Promise<T>): Promise<T | string> {
    const result = await func();

    if(typeof result === "string" && result === NEED_REFRESH_MESSAGE) {
      const refreshResult = await $authStore.adminAuthRefresh();

      if(typeof refreshResult === "boolean") {
        if(refreshResult === true) {
          return await func();
        } else {
          window.location.replace(router.resolve({ name: "logout" }).href);
          return "logout";
        }
      } else {
        return refreshResult as string;
      }
    } else {
      return result;
    }
  }

  /* Actions */
  function changeBooth(boothId: number): void {
    isChangingBooth.value = true;
    currentBoothId.value = boothId;
    clearAllBoothData(false);

    isBoothDataLoaded.value = false;
  }

  function changeBoothToFirst(): void {
    isChangingBooth.value = true;
    currentBoothId.value = Object.keys(boothList).length > 0 ? parseInt(Object.keys(boothList)[0]) : -1;
    clearAllBoothData(false);

    isBoothDataLoaded.value = false;
  }

  async function fetchCurrentAccountInfo(): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.fetchCurrentAccountInfo());

    if(response && response instanceof Object) {
      currentAccount.value = response;
      return true;
    } else {
      return response;
    }
  }

  async function fetchBoothsOfCurrentAccount(setFirstBoothAsCurrent: boolean = false): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.fetchAllBooths());

    if(response && response instanceof Array) {
      if(setFirstBoothAsCurrent) {
        currentBoothId.value = response.length > 0 ? response[0].id : -1;
      }

      for(const booth of response) {
        boothList[booth.id] = booth;
      }
      return true;
    } else {
      return response;
    }
  }

  async function fetchGoodsCategoriesOfCurrentBooth(refresh: boolean = false): Promise<boolean | string> {
    if(currentBoothId.value === -1) return false;

    const response = await apiWrapper(() => AdminAPI.fetchAllGoodsCategoriesOfBooth(currentBoothId.value));

    if(response && response instanceof Array) {
      if(refresh) emptyObject(boothGoodsCategoryList);

      for(const category of response) {
        boothGoodsCategoryList[category.id] = category;
      }
      return true;
    } else {
      return response;
    }
  }

  async function fetchGoodsOfCurrentBooth(refresh: boolean = false): Promise<boolean | string> {
    if(currentBoothId.value === -1) return false;

    const response = await apiWrapper(() => AdminAPI.fetchAllGoodsOfBooth(currentBoothId.value));

    if(response && response instanceof Array) {
      if(refresh) emptyObject(boothGoodsList);

      for(const goods of response) {
        boothGoodsList[goods.id] = goods;
      }
      return true;
    } else {
      return response;
    }
  }

  async function fetchGoodsOrdersOfCurrentBooth(refresh: boolean = false): Promise<boolean | string> {
    if(currentBoothId.value === -1) return false;

    const response = await apiWrapper(() => AdminAPI.fetchAllGoodsOrdersOfBooth(currentBoothId.value));

    if(response && response instanceof Array) {
      if(refresh) emptyObject(boothGoodsList);

      for(const order of response) {
        boothGoodsOrderList[order.id] = order;
      }
      return true;
    } else {
      return response;
    }
  }

  async function createBooth(payload: IBoothCreateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.createBooth(payload));

    if(response && response instanceof Object) {
      boothList[response.id] = response;
      return true;
    } else {
      return response;
    }
  }

  async function createGoods(payload: IGoodsCreateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.createGoods(payload));

    if(response && response instanceof Object) {
      boothGoodsList[response.id] = response;
      return true;
    } else {
      return response;
    }
  }

  async function createGoodsCategory(payload: IGoodsCategoryCreateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.createGoodsCategory(payload));

    if(response && response instanceof Object) {
      boothGoodsCategoryList[response.id] = response;
      return true;
    } else {
      return response;
    }
  }

  async function createGoodsOrder(payload: IGoodsOrderCreateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.createGoodsOrder(payload));

    if(response && response instanceof Object) {
      // Nothing will be added to any list
      return true;
    } else {
      return response;
    }
  }

  async function updateGoodsInfo(goodsId: number, payload: IGoodsUpdateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.updateGoodsInfo(goodsId, payload));

    if(response && response instanceof Object) {
      boothGoodsList[goodsId] = {
        ...boothGoodsList[goodsId],
        ...response,
      };
      return true;
    } else {
      return response;
    }
  }

  async function updateGoodsCategoryInfo(categoryId: number, payload: IGoodsCategoryUpdateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.updateGoodsCategoryInfo(categoryId, payload));

    if(response && response instanceof Object) {
      boothGoodsCategoryList[categoryId] = {
        ...boothGoodsCategoryList[categoryId],
        ...response,
      };
      return true;
    } else {
      return response;
    }
  }

  async function updateCurrentBoothInfo(payload: IBoothUpdateReuqest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.updateBoothInfo(currentBoothId.value, payload));

    if(response && response instanceof Object) {
      boothList[currentBoothId.value] = {
        ...boothList[currentBoothId.value],
        ...response,
      };
      return true;
    } else {
      return response;
    }
  }

  async function updateCurrentBoothStatus(payload: IBoothStatusUpdateRequest): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.updateBoothStatus(currentBoothId.value, payload));

    if(response && response instanceof Object) {
      boothList[currentBoothId.value] = {
        ...boothList[currentBoothId.value],
        ...payload,
      };
      return true;
    } else {
      return response;
    }
  }

  async function deleteGoodsCategory(categoryId: number): Promise<boolean | string> {
    const response = await apiWrapper(() => AdminAPI.deleteGoodsCategory(categoryId));

    if(response && response instanceof Object) {
      // Force fetch goods & goods categories
      const results = [
        await fetchGoodsOfCurrentBooth(true),
        await fetchGoodsCategoriesOfCurrentBooth(true),
      ];

      return results.every((s) => typeof s === "boolean" && s === true);
    } else {
      return response;
    }
  }

  function clearAllBoothData(includeBoothList: boolean = true): void {
    if(includeBoothList) emptyNumberKeyObject(boothList);

    emptyNumberKeyObject(boothGoodsList);
    emptyNumberKeyObject(boothGoodsCategoryList);
    emptyNumberKeyObject(boothGoodsOrderList);
  }

  async function fetchAllBoothData(startup: boolean = true): Promise<boolean> {
    const responses = [];
    if(startup && !isChangingBooth.value) {
      responses.push(await fetchBoothsOfCurrentAccount(true));
    }

    responses.push(
      await fetchGoodsCategoriesOfCurrentBooth(),
      await fetchGoodsOfCurrentBooth(),
    );

    isChangingBooth.value = false;
    if(responses.every((s) => typeof s !== "string")) {
      isBoothDataLoaded.value = true;
      return true;
    } else {
      return false;
    }
  }

  return {
    currentAccount,
    currentBoothId,
    isBoothDataLoaded,
    isChangingBooth,

    boothList,
    boothGoodsCategoryList,
    boothGoodsList,
    boothGoodsOrderList,

    changeBooth,
    changeBoothToFirst,
    fetchCurrentAccountInfo,
    fetchBoothsOfCurrentAccount,
    fetchGoodsCategoriesOfCurrentBooth,
    fetchGoodsOfCurrentBooth,
    fetchGoodsOrdersOfCurrentBooth,
    updateGoodsInfo,
    updateGoodsCategoryInfo,
    updateCurrentBoothInfo,
    updateCurrentBoothStatus,
    createBooth,
    createGoods,
    createGoodsCategory,
    createGoodsOrder,
    deleteGoodsCategory,
    clearAllBoothData,
    fetchAllBoothData,
  };
});

export { useAdminStore };
