<template>
  <DashboardPanel title="Goods Overview">
    <VContainer class="flex-column">
      <VRow>
        <VCol>
          <span>Total stocks: 00</span>
        </VCol>
        <VCol>
          <span>Available stocks: 00</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>Stocks sold: 00</span>
        </VCol>
        <VCol>
          <span>Stocks given as gift: 00</span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <span>Total worth: 00</span>
        </VCol>
        <VCol>
          <span>Sold worth: 00</span>
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
