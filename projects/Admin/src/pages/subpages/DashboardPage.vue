<template>
  <VContainer class="mt-4 pa-2 pa-md-6 d-flex flex-column">
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
import { useAdminStore } from "@/plugins/stores/admin";
import BoothStatusPanel from "@/components/dashboard/BoothStatusPanel.vue";
import GoodsOverviewPanel from "@/components/dashboard/GoodsOverviewPanel.vue";

@Component({
  components: {
    BoothStatusPanel,
    GoodsOverviewPanel,
  },
})
export default class DashboardPage extends Vue {
  readonly BoothStatus = BoothStatus;

  get currentBoothData(): IBooth {
    return useAdminStore().currentBooth.booth!;
  }
}
</script>
