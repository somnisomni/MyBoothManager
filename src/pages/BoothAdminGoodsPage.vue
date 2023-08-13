<template>
  <VContainer>
    <VSheet v-for="goods in goodsList"
            :key="goods.id">
      <div>Name: {{ goods.name }}</div>
      <div>Price: {{ boothCurrencySymbol }}{{ goods.price.toLocaleString() }}</div>
      <div>Stock: {{ goods.stock.current }} / {{ goods.stock.initial }}</div>
    </VSheet>
  </VContainer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothAdminGoodsPage extends Vue {
  get boothCurrencySymbol() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get goodsList() {
    return Object.values(useAdminStore().goodsList).filter((goods) => goods.boothId === useAdminStore().currentBoothId);
  }
}
</script>
