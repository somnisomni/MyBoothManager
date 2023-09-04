<template>
  <DashboardPanel title="굿즈 현황">
    <VContainer class="flex-column">
      <VRow>
        <VCol>
          <span>총 재고 개수: 00</span>
        </VCol>
        <VCol>
          <span>남아있는 재고 개수: 00</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>판매 개수: 00</span>
        </VCol>
        <VCol>
          <span>무상 증정 개수: 00</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>총 재고 가치: 00</span>
        </VCol>
        <VCol>
          <span>현재까지 판매된 재고 가치: 00</span>
        </VCol>
      </VRow>
    </VContainer>
  </DashboardPanel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
  },
})
export default class GoodsOverviewPanel extends Vue { }
</script>
