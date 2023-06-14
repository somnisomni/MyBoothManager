<template>
  <VLayout class="pa-4 d-flex flex-column">
    <VCard class="mb-4">
      <VCardTitle>Booth Status</VCardTitle>

      <VCardText>
        <h1 class="my-2">{{ openStatusString }}</h1>
        <h3 v-if="currentBoothData.openStatus === BoothOpenStatus.PAUSE && currentBoothData.pauseReason" class="mt-4">Reason: {{ currentBoothData.pauseReason }}</h3>
      </VCardText>
    </VCard>

    <VCard class="my-4">
      <VCardTitle>Quick Actions</VCardTitle>

      <!-- Booth open status setter -->
      <VLayout class="pa-4 flex-row align-center">
        <span>Mark the booth as: </span>

        <VLayout>
          <VBtn color="blue"
                class="ml-2"
                :variant="currentBoothData.openStatus === BoothOpenStatus.OPEN ? 'flat' : 'outlined'"
                :disabled="currentBoothData.openStatus === BoothOpenStatus.OPEN"
                @click="onBoothStatusUpdateButtonClick(BoothOpenStatus.OPEN)">
            <VIcon>mdi-store-check</VIcon>
            <span class="ml-2">Opened</span>
          </VBtn>

          <VBtn color="orange-darken-1"
                class="ml-2"
                :variant="currentBoothData.openStatus === BoothOpenStatus.PAUSE ? 'flat' : 'outlined'"
                :disabled="currentBoothData.openStatus === BoothOpenStatus.PAUSE"
                @click="onBoothStatusUpdateButtonClick(BoothOpenStatus.PAUSE)">
            <VIcon>mdi-store-clock</VIcon>
            <span class="ml-2">Paused</span>
          </VBtn>

          <VBtn color="red-darken-1"
                class="ml-2"
                :variant="currentBoothData.openStatus === BoothOpenStatus.CLOSE ? 'flat' : 'outlined'"
                :disabled="currentBoothData.openStatus === BoothOpenStatus.CLOSE"
                @click="onBoothStatusUpdateButtonClick(BoothOpenStatus.CLOSE)">
            <VIcon>mdi-store-off</VIcon>
            <span class="ml-2">Closed</span>
          </VBtn>
        </VLayout>
      </VLayout>
    </VCard>
  </VLayout>

  <BoothStatusUpdateDialog v-if="statusUpdateDialogOpen"
                           v-model="statusUpdateDialogOpen"
                           :targetStatus="statusUpdateDialogTargetStatus"
                           @updateSuccess="onBoothStatusUpdateDialogSuccess" />
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

  get currentBoothData(): BoothData {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get openStatusString(): string {
    switch(this.currentBoothData.openStatus) {
      case BoothOpenStatus.OPEN:
        return "Opened";
      case BoothOpenStatus.PAUSE:
        return "Paused";
      case BoothOpenStatus.CLOSE:
        return "Closed";
      default:
        return "Unknown";
    }
  }

  onBoothStatusUpdateButtonClick(newStatus: BoothOpenStatus): void {
    this.statusUpdateDialogTargetStatus = newStatus;
    this.statusUpdateDialogOpen = true;
  }

  onBoothStatusUpdateDialogSuccess(): void {
    console.log("success");
    // TODO?
  }
}
</script>
