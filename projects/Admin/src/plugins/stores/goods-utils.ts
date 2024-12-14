import type { ComputedRef } from "vue";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useAdminStore } from "./admin";

const useAdminGoodsStore = defineStore("booth-goods", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $adminStore = useAdminStore();

  /* *** Computed States *** */
  const goodsItemCount: ComputedRef<number>
    = computed(() => Object.keys($adminStore.currentBooth.goods ?? { }).length);

  const combinationItemCount: ComputedRef<number>
    = computed(() => Object.keys($adminStore.currentBooth.goodsCombinations ?? { }).length);

  const totalGoodsInitialStockCount: ComputedRef<number>
    = computed(() => Object.values($adminStore.currentBooth.goods ?? { })
      .reduce((count, goods) => count + goods.stock.initial, 0));

  const totalGoodsWorthByInitialStock: ComputedRef<number>
    = computed(() => Object.values($adminStore.currentBooth.goods ?? { })
      .reduce((worth, goods) => worth + goods.stock.initial * goods.price, 0));

  const totalGoodsRemainingStockCount: ComputedRef<number>
    = computed(() => Object.values($adminStore.currentBooth.goods ?? { })
      .reduce((count, goods) => count + goods.stock.remaining, 0));

  const totalGoodsWorthByRemainingStock: ComputedRef<number>
    = computed(() => Object.values($adminStore.currentBooth.goods ?? { })
      .reduce((worth, goods) => worth + goods.stock.remaining * goods.price, 0));

  const totalGoodsStockDifference: ComputedRef<number>
    = computed(() => totalGoodsInitialStockCount.value - totalGoodsRemainingStockCount.value);

  return {
    goodsItemCount,
    combinationItemCount,

    totalGoodsInitialStockCount,
    totalGoodsWorthByInitialStock,
    totalGoodsRemainingStockCount,
    totalGoodsWorthByRemainingStock,
    totalGoodsStockDifference,
  };
});

export { useAdminGoodsStore };
