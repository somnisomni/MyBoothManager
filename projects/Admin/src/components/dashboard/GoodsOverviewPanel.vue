<template>
  <DashboardPanel title="굿즈 현황">
    <VContainer class="flex-column">
      <VRow>
        <VCol>
          <span>총 재고 개수: {{ goodsOverviewData.totalSumStockCount.toLocaleString() }}개</span>
        </VCol>
        <VCol>
          <span>남아있는 재고 개수: {{ goodsOverviewData.remainingSumStockCount.toLocaleString() }}개</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>판매 개수: {{ goodsOverviewData.totalSumSoldCount.toLocaleString() }}개</span>
        </VCol>
        <VCol>
          <span>???</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>총 재고 가치: {{ currencySymbol }}{{ goodsOverviewData.totalSumStockValue.toLocaleString() }}</span>
        </VCol>
        <VCol>
          <span>현재까지 판매된 재고 가치: {{ currencySymbol }}{{ goodsOverviewData.totalSumSoldValue.toLocaleString() }}</span>
        </VCol>
      </VRow>
    </VContainer>
  </DashboardPanel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import DashboardPanel from "./DashboardPanel.vue";

interface IGoodsOverviewData {
  totalSumStockCount: number;
  remainingSumStockCount: number;
  totalSumStockValue: number;
  totalSumSoldCount: number;
  totalSumSoldValue: number;
}

@Component({
  components: {
    DashboardPanel,
  },
})
export default class GoodsOverviewPanel extends Vue {
  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  get goodsOverviewData(): IGoodsOverviewData {
    const data: IGoodsOverviewData = {
      totalSumStockCount: 0,
      remainingSumStockCount: 0,
      totalSumStockValue: 0,
      totalSumSoldCount: 0,
      totalSumSoldValue: 0,
    };

    for(const goods of Object.values(useAdminStore().currentBooth.goods ?? {})) {
      data.totalSumStockCount += Number(goods.stockInitial);
      data.remainingSumStockCount += Number(goods.stockRemaining);
      data.totalSumStockValue += Number(goods.price) * Number(goods.stockInitial);
      data.totalSumSoldCount += Number(goods.stockInitial) - Number(goods.stockRemaining);
      data.totalSumSoldValue += Number(goods.price) * (Number(goods.stockInitial) - Number(goods.stockRemaining));
    }

    return data;
  }
}
</script>
