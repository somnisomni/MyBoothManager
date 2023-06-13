<template>
  <VLayout class="pa-4 d-flex flex-column">
    <VCard class="mb-4">
      <VCardTitle>Booth Status</VCardTitle>

      <VCardText>
        <h1>{{ openStatusString }}</h1>
        <h3 v-if="currentBoothData.openStatusDesc" class="mt-2">Reason: {{ currentBoothData.openStatusDesc }}</h3>
      </VCardText>
    </VCard>

    <VCard class="my-4">
      <VCardTitle>Quick Actions</VCardTitle>

      <!-- Booth open status setter -->
      <VLayout class="pa-4 flex-row align-center">
        <span>Mark the booth as: </span>

        <VFadeTransition>
          <VLayout v-if="!updatingStatus.openStatus">
            <VBtn color="blue"
                  class="ml-2"
                  :variant="currentBoothData.openStatus === BoothOpenStatus.OPEN ? 'flat' : 'outlined'"
                  :disabled="currentBoothData.openStatus === BoothOpenStatus.OPEN"
                  @click="onBoothStatusUpdateButtonClick(BoothOpenStatus.OPEN)">
              <VIcon>mdi-store-check</VIcon>
              <span class="ml-2">Opened</span>
            </VBtn>

            <VBtn color="red"
                  class="ml-2"
                  :variant="currentBoothData.openStatus === BoothOpenStatus.CLOSE ? 'flat' : 'outlined'"
                  :disabled="currentBoothData.openStatus === BoothOpenStatus.CLOSE"
                  @click="onBoothStatusUpdateButtonClick(BoothOpenStatus.CLOSE)">
              <VIcon>mdi-store-off</VIcon>
              <span class="ml-2">Closed</span>
            </VBtn>
          </VLayout>

          <VProgressCircular v-if="updatingStatus.openStatus"
                             class="ml-2"
                             indeterminate />
        </VFadeTransition>
      </VLayout>
    </VCard>
  </VLayout>

  <BoothStatusUpdateDialog v-if="statusUpdateDialogOpen"
                           v-model="statusUpdateDialogOpen"
                           :targetStatus="statusUpdateDialogTargetStatus"
                           @confirm="onBoothStatusUpdateDialogConfirm" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothOpenStatus, type BoothData } from "@/types/booth";
import { useAdminStore } from "@/stores/admin";
import BoothStatusUpdateDialog from "@/components/admin/BoothStatusUpdateDialog.vue";

@Component({
  components: {
    BoothStatusUpdateDialog,
  },
})
export default class BoothAdminDashboardPage extends Vue {
  BoothOpenStatus = BoothOpenStatus;

  statusUpdateDialogOpen = false;
  statusUpdateDialogTargetStatus: BoothOpenStatus = BoothOpenStatus.OPEN;

  updatingStatus: Record<string, boolean> = {
    openStatus: false,
  };

  get currentBoothData(): BoothData {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get openStatusString(): string {
    switch(this.currentBoothData.openStatus) {
      case BoothOpenStatus.OPEN:
        return "Opened";
      case BoothOpenStatus.CLOSE:
        return "Closed";
      default:
        return "Unknown";
    }
  }

  onBoothStatusUpdateButtonClick(newStatus: BoothOpenStatus): void {
    this.statusUpdateDialogOpen = true;
    this.statusUpdateDialogTargetStatus = newStatus;
  }

  onBoothStatusUpdateDialogConfirm(statusData: { targetStatus: BoothOpenStatus, reason?: string }): void {
    this.setBoothStatus(statusData);
  }

  setBoothStatus(statusData: { targetStatus: BoothOpenStatus, reason?: string }): void {
    this.updatingStatus.openStatus = true;

    // TODO: API call here

    setTimeout(() => {  // API call simulation; remove `setTimeout` in real code
      this.currentBoothData.openStatus = statusData.targetStatus;
      this.currentBoothData.openStatusDesc = statusData.reason;
      this.updatingStatus.openStatus = false;
    }, 500);
  }
}
</script>
