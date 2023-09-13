<template>
  <VContainer class="pa-8 d-flex flex-column">
    <VRow>
      <VCol cols="12" lg="4">
        <BoothStatusPanel :currentBoothStatus="currentBoothData.status" />
      </VCol>
      <VCol cols="12" lg="8">
        <GoodsOverviewPanel />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothOpenStatus } from "@/types/booth";
import { useAdminStore } from "@/stores/admin";
import BoothStatusPanel from "@/components/dashboard/BoothStatusPanel.vue";
import GoodsOverviewPanel from "@/components/dashboard/GoodsOverviewPanel.vue";
import type { IBooth } from "@myboothmanager/common";

@Component({
  components: {
    BoothStatusPanel,
    GoodsOverviewPanel,
  },
})
export default class BoothAdminDashboardPage extends Vue {
  BoothOpenStatus = BoothOpenStatus;

  get currentBoothData(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }
}
</script>
