<template>
  <VContainer class="mt-4">
    <div v-for="category in goodsCategoryList"
         :key="category.id"
         class="mt-8">
      <h2 class="text-2xl font-bold mb-4">{{ category.name }}</h2>

      <VRow class="justify-start">
        <GoodsItem v-for="goods in findGoodsInCategory(category.id)"
                  :key="goods.id"
                  :goodsData="goods"
                  :currencySymbol="boothCurrencySymbol" />
      </VRow>
    </div>

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

  get goodsCategoryList() {
    // TODO: Filtering will be done in the backend. Remove this line when the backend is ready.
    return Object.values(useAdminStore().goodsCategoryList).filter((category) => category.boothId === useAdminStore().currentBoothId);
  }

  get goodsList() {
    // TODO: Filtering will be done in the backend. Remove this line when the backend is ready.
    return Object.values(useAdminStore().goodsList).filter((goods) => goods.boothId === useAdminStore().currentBoothId);
  }

  findGoodsInCategory(categoryId: number) {
    return this.goodsList.filter((goods) => goods.categoryId === categoryId);
  }
}
</script>
