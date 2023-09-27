import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { type IAccountUserland, type IBooth, type IBoothCreateRequest, type IBoothStatusUpdateRequest, type IBoothUpdateReuqest, type IGoods, type IGoodsCategory, type IGoodsCategoryCreateRequest, type IGoodsCategoryUpdateRequest, type IGoodsCreateRequest, type IGoodsUpdateRequest } from "@myboothmanager/common";
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

  /* Private actions (not to be exported) */
  async function apiWrapper<T>(func: () => Promise<T>): Promise<T | string> {
    const result = await func();

    if(typeof result === "string" && result === NEED_REFRESH_MESSAGE) {
      const refreshResult = await $authStore.adminAuthRefresh();

      if(typeof refreshResult === "boolean") {
        if(refreshResult === true) {
          return await func();
        } else {
          router.replace({ name: "logout" });
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

  async function fetchGoodsCategoriesOfCurrentBooth(): Promise<boolean | string> {
    if(currentBoothId.value === -1) return false;

    const response = await apiWrapper(() => AdminAPI.fetchAllGoodsCategoriesOfBooth(currentBoothId.value));

    if(response && response instanceof Array) {
      for(const category of response) {
        boothGoodsCategoryList[category.id] = category;
      }
      return true;
    } else {
      return response;
    }
  }

  async function fetchGoodsOfCurrentBooth(): Promise<boolean | string> {
    if(currentBoothId.value === -1) return false;

    const response = await apiWrapper(() => AdminAPI.fetchAllGoodsOfBooth(currentBoothId.value));

    if(response && response instanceof Array) {
      for(const goods of response) {
        boothGoodsList[goods.id] = goods;
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

  function clearAllBoothData(includeBoothList: boolean = true): void {
    if(includeBoothList) Object.keys(boothList).forEach((key) => delete boothList[parseInt(key)]);

    Object.keys(boothGoodsList).forEach((key) => delete boothGoodsList[parseInt(key)]);
    Object.keys(boothGoodsCategoryList).forEach((key) => delete boothGoodsCategoryList[parseInt(key)]);
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

    changeBooth,
    changeBoothToFirst,
    fetchCurrentAccountInfo,
    fetchBoothsOfCurrentAccount,
    fetchGoodsCategoriesOfCurrentBooth,
    fetchGoodsOfCurrentBooth,
    updateGoodsInfo,
    updateGoodsCategoryInfo,
    updateCurrentBoothInfo,
    updateCurrentBoothStatus,
    createBooth,
    createGoods,
    createGoodsCategory,
    clearAllBoothData,
    fetchAllBoothData,
  };
});

export { useAdminStore };
