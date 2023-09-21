import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { type IAccountUserland, type IBooth, type IGoods, type IGoodsCategory, type IGoodsCreateRequest } from "@myboothmanager/common";
import AdminAPI from "@/lib/api-admin";

const useAdminStore = defineStore("admin", () => {
  /* States */
  const currentAccount = ref<IAccountUserland | null>(null);
  const currentBoothId = ref<number>(-1);

  const isBoothDataLoaded = ref<boolean>(false);
  const isChangingBooth = ref<boolean>(false);

  const boothList: Record<number, IBooth> = reactive({});
  const boothGoodsCategoryList: Record<number, IGoodsCategory> = reactive({});
  const boothGoodsList: Record<number, IGoods> = reactive({});

  /* Actions */
  function changeBooth(boothId: number): void {
    isChangingBooth.value = true;
    currentBoothId.value = boothId;
    clearAllBoothData(false);

    isBoothDataLoaded.value = false;
  }

  async function fetchBoothsOfCurrentAccount(setFirstBoothAsCurrent: boolean = false): Promise<boolean | string> {
    const response = await AdminAPI.fetchAllBooths();

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

    const response = await AdminAPI.fetchAllGoodsCategoriesOfBooth(currentBoothId.value);

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

    const response = await AdminAPI.fetchAllGoodsOfBooth(currentBoothId.value);

    if(response && response instanceof Array) {
      for(const goods of response) {
        boothGoodsList[goods.id] = goods;
      }
      return true;
    } else {
      return response;
    }
  }

  async function createGoods(payload: IGoodsCreateRequest): Promise<boolean | string> {
    const response = await AdminAPI.createGoods(payload);

    if(response && response instanceof Object) {
      boothGoodsList[response.id] = response;
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

    boothList,
    boothGoodsCategoryList,
    boothGoodsList,

    changeBooth,
    fetchBoothsOfCurrentAccount,
    fetchGoodsCategoriesOfCurrentBooth,
    fetchGoodsOfCurrentBooth,
    createGoods,
    clearAllBoothData,
    fetchAllBoothData,
  };
});

export { useAdminStore };
