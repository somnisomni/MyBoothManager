<template>
  <VContainer class="pa-8 d-flex flex-column">
    <VRow>
      <VCol cols="12" lg="4">
        <BoothStatusPanel />
      </VCol>
      <VCol cols="12" lg="8">
        <GoodsOverviewPanel />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import BoothStatusPanel from "@/components/dashboard/BoothStatusPanel.vue";
import GoodsOverviewPanel from "@/components/dashboard/GoodsOverviewPanel.vue";

@Component({
  components: {
    BoothStatusPanel,
    GoodsOverviewPanel,
  },
})
export default class BoothAdminDashboardPage extends Vue {
  BoothStatus = BoothStatus;

  get currentBoothData(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }
}
</script>
