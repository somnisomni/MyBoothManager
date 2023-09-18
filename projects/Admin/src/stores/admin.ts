import { defineStore } from "pinia";
import AdminAPI from "@/lib/api-admin";
import { inject, reactive, ref } from "vue";
import { type IAccountLoginRequest, type IAccountUserland, type IBooth, type IGoods, type IGoodsCategory, type IGoodsCreateRequest } from "@myboothmanager/common";
import { type VueCookies } from "vue-cookies";

const useAdminStore = defineStore("admin", () => {
  /* Dependencies (NOT TO BE EXPORTED) */
  const $cookies = inject<VueCookies>("$cookies")!;

  /* States */
  const currentAccount = ref<IAccountUserland | null>(null);
  const currentBoothId = ref<number>(1);

  const boothList: Record<number, IBooth> = reactive({});
  const goodsCategoryList: Record<number, IGoodsCategory> = reactive({});
  const boothGoodsList: Record<number, IGoods> = reactive({});

  /* Actions */
  async function adminLogin(data: IAccountLoginRequest): Promise<boolean | string> {
    const response = await AdminAPI.login(data);

    if(response && response instanceof Object) {
      currentAccount.value = {
        id: response.id,
        name: response.name,
        loginId: response.loginId,
      };
      if(response.superAdmin) currentAccount.value.superAdmin = response.superAdmin;

      $cookies.set("accessToken", response.token, response.tokenExpiresIn);
      $cookies.set("refreshToken", response.refreshToken, response.refreshTokenExpiresIn);
      return true;
    } else {
      invalidateLoginData();
      return response;
    }
  }

  function invalidateLoginData(): void {
    currentAccount.value = null;
    $cookies.remove("accessToken");
    $cookies.remove("refreshToken");
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
        goodsCategoryList[category.id] = category;
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

  async function startupFetch(): Promise<boolean> {
    const responses = [
      await fetchBoothsOfCurrentAccount(true),
      await fetchGoodsCategoriesOfCurrentBooth(),
      await fetchGoodsOfCurrentBooth(),
    ];

    return responses.every((s) => typeof s !== "string");
  }

  return {
    currentAccount,
    currentBoothId,
    boothList,
    goodsCategoryList,
    boothGoodsList,

    adminLogin,
    invalidateLoginData,
    fetchBoothsOfCurrentAccount,
    fetchGoodsCategoriesOfCurrentBooth,
    fetchGoodsOfCurrentBooth,
    createGoods,
    startupFetch,
  };
});

export { useAdminStore };
