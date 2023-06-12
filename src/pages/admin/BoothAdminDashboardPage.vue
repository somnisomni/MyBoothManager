<template>
  <VLayout class="pa-4 d-flex flex-column">
    <VCard class="mb-4">
      <VCardTitle>Booth Status</VCardTitle>

      <VCardText>
        <h1>{{ openStatusString }}</h1>
        <h3 v-if="boothData.openStatusDesc">{{ boothData.openStatusDesc }}</h3>
      </VCardText>
    </VCard>

    <VCard class="my-4">
      <VCardTitle>Quick Actions</VCardTitle>

      <!-- Booth open status setter -->
      <VLayout class="pa-4 flex-row align-center">
        <span>Mark the booth as: </span>

        <VFadeTransition>
          <VLayout v-show="!updatingStatus.openStatus">
            <VBtn color="blue"
                  class="ml-2"
                  :variant="boothData.openStatus === BoothOpenStatus.OPEN ? 'flat' : 'outlined'"
                  :disabled="boothData.openStatus === BoothOpenStatus.OPEN"
                  @click="setBoothStatus(BoothOpenStatus.OPEN)">
              <VIcon>mdi-store-check</VIcon>
              <span class="ml-2">Opened</span>
            </VBtn>

            <VBtn color="red"
                  class="ml-2"
                  :variant="boothData.openStatus === BoothOpenStatus.CLOSE ? 'flat' : 'outlined'"
                  :disabled="boothData.openStatus === BoothOpenStatus.CLOSE"
                  @click="setBoothStatus(BoothOpenStatus.CLOSE)">
              <VIcon>mdi-store-off</VIcon>
              <span class="ml-2">Closed</span>
            </VBtn>
          </VLayout>

          <VProgressCircular v-show="updatingStatus.openStatus"
                            class="ml-2"
                            indeterminate />
        </VFadeTransition>
      </VLayout>

      <!-- -->
    </VCard>
  </VLayout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothOpenStatus, type BoothData } from "@/types/booth";

@Component({})
export default class BoothAdminDashboardPage extends Vue {
  BoothOpenStatus = BoothOpenStatus;

  boothData: BoothData = {
    /* TEMP DATA */
    openStatus: BoothOpenStatus.OPEN,
  };

  updatingStatus: Record<string, boolean> = {
    openStatus: false,
  };

  get openStatusString(): string {
    if(this.boothData.openStatus === BoothOpenStatus.OPEN) {
      return "Opened";
    } else if(this.boothData.openStatus === BoothOpenStatus.CLOSE) {
      return "Closed";
    } else {
      return "Unknown";
    }
  }

  setBoothStatus(newStatus: BoothOpenStatus): void {
    // TODO
    this.updatingStatus.openStatus = true;
    console.log("Set booth status:", newStatus);

    setTimeout(() => { // simulated
      this.boothData.openStatus = newStatus;
      this.updatingStatus.openStatus = false;
    }, 500);
  }
}
</script>
