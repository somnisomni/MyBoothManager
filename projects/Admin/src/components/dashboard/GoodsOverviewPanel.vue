<template>
  <DashboardPanel title="굿즈 현황">
    <VContainer class="flex-column">
      <VRow>
        <VCol>
          <span>총 재고 개수: {{ totalSumStockCount }}개</span>
        </VCol>
        <VCol>
          <span>남아있는 재고 개수: {{ remainingSumStockCount }}개</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>판매 개수: {{ totalSumSellCount }}개</span>
        </VCol>
        <VCol>
          <span>무상 증정 개수: 00개</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>총 재고 가치: {{ currencySymbol }}{{ totalSumStockValue }}</span>
        </VCol>
        <VCol>
          <span>현재까지 판매된 재고 가치: {{ currencySymbol }}{{ totalSumSellValue }}</span>
        </VCol>
      </VRow>
    </VContainer>
  </DashboardPanel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
  },
})
export default class GoodsOverviewPanel extends Vue {
  // FIXME: Computed values get wrong when add new goods

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get totalSumStockCount(): string {
    let count = 0;
    Object.values(useAdminStore().boothGoodsList).forEach((goods) => { count += goods.stockInitial; });
    return count.toLocaleString();
  }

  get remainingSumStockCount(): string {
    let count = 0;
    Object.values(useAdminStore().boothGoodsList).forEach((goods) => { count += goods.stockRemaining; });
    return count.toLocaleString();
  }

  get totalSumSellCount(): string {
    let count = 0;
    Object.values(useAdminStore().boothGoodsList).forEach((goods) => { count += goods.stockInitial - goods.stockRemaining; });
    return count.toLocaleString();
  }

  get totalSumStockValue(): string {
    let value = 0;
    Object.values(useAdminStore().boothGoodsList).forEach((goods) => { value += goods.price * goods.stockInitial; });
    return value.toLocaleString();
  }

  get totalSumSellValue(): string {
    let value = 0;
    Object.values(useAdminStore().boothGoodsList).forEach((goods) => { value += goods.price * (goods.stockInitial - goods.stockRemaining); });
    return value.toLocaleString();
  }
}
</script>
