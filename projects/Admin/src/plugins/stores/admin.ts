import type { GoodsAdmin, GoodsCombinationAdmin } from "@/lib/classes";
import { defineStore } from "pinia";
import { computed, ref, type ToRefs } from "vue";
import { CURRENCY_INFO, type IAccount, type IBooth, type IBoothMember, type ICurrencyInfo, type IGoodsCategory, type IGoodsOrder } from "@myboothmanager/common";
import { SnackbarContextWrapper } from "@myboothmanager/common-ui";
import { useAdminAPIStore } from "./api";

interface CurrentBoothStates {
  booth: IBooth | null;
  boothMembers: Record<number, IBoothMember> | null;
  orders: Record<number, IGoodsOrder> | null;
  goods: Record<number, GoodsAdmin> | null;
  goodsCombinations: Record<number, GoodsCombinationAdmin> | null;
  goodsCategories: Record<number, IGoodsCategory> | null;
}

const useAdminStore = defineStore("admin", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $apiStore = useAdminAPIStore();

  /* *** States *** */
  const currentAccount = ref<IAccount | null>(null);
  const currentBooth: ToRefs<CurrentBoothStates> = {
    booth: ref(null),
    boothMembers: ref(null),
    orders: ref(null),
    goods: ref(null),
    goodsCombinations: ref(null),
    goodsCategories: ref(null),
  };

  const isBoothDataLoaded = ref<boolean>(false);
  const isAllDataLoaded = ref<boolean>(false);
  const isFirstLoad = ref<boolean>(true);

  const globalSnackbarContexts = new SnackbarContextWrapper();

  /* Computed States */
  const currentBoothCurrencyInfo = computed<ICurrencyInfo>(() => CURRENCY_INFO[currentBooth.booth.value?.currencyCode ?? "KRW"]);

  /* Actions */
  function clear(exclude?: Partial<Record<"account" | keyof CurrentBoothStates, true>>): void {
    if(exclude && !exclude.account) currentAccount.value = null;

    for(const key in currentBooth) {
      const typedKey = key as keyof CurrentBoothStates;

      if(exclude && !exclude[typedKey]) continue;
      currentBooth[typedKey].value = null;
    }

    isBoothDataLoaded.value = false;
    isAllDataLoaded.value = false;
  }

  function changeBooth(boothId: number): void {
    isBoothDataLoaded.value = false;

    clear({ account: true });
    $apiStore.fetchSingleBoothOfCurrentAccount(boothId).finally(() => {
      isBoothDataLoaded.value = true;
    });
  }

  return {
    currentAccount,
    currentBooth,
    currentBoothCurrencyInfo,
    isBoothDataLoaded,
    isAllDataLoaded,
    isFirstLoad,
    globalSnackbarContexts,

    clear,
    changeBooth,
  };
});

export { useAdminStore };
