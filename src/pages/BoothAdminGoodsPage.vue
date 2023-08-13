<template>
  <VContainer class="mt-4">
    <VRow class="justify-center">
      <GoodsItem v-for="goods in goodsList"
                 :key="goods.id"
                 :goodsData="goods"
                 :currencySymbol="boothCurrencySymbol" />
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsItem from "@/components/goods/GoodsItem.vue";

@Component({
  components: {
    GoodsItem,
  },
})
export default class BoothAdminGoodsPage extends Vue {
  get boothCurrencySymbol() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get goodsList() {
    // TODO: Filtering will be done in the backend. Remove this line when the backend is ready.
    return Object.values(useAdminStore().goodsList).filter((goods) => goods.boothId === useAdminStore().currentBoothId);
  }
}
</script>
