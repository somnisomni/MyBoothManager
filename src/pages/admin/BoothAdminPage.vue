<template>
  <VAppBar>
    <VAppBarTitle>Booth Administration</VAppBarTitle>
  </VAppBar>

  <VMain class="px-4 mt-4">
    <VCard>
      <VCardTitle>Quick Actions</VCardTitle>

      <!-- Booth open status setter -->
      <VLayout class="pa-4 flex-row align-center">
        <span>Mark the booth as: </span>

        <VFadeTransition>
          <VLayout v-if="!updatingStatus.openStatus">
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

          <VProgressCircular v-if="updatingStatus.openStatus"
                             class="ml-2"
                             indeterminate />
        </VFadeTransition>
      </VLayout>

      <!-- -->
    </VCard>
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothOpenStatus, type BoothData } from "@/types/booth";

@Component({})
export default class BoothAdminPage extends Vue {
  BoothOpenStatus = BoothOpenStatus;

  boothData: BoothData = {
    /* TEMP DATA */
    openStatus: BoothOpenStatus.OPEN,
  };

  updatingStatus: Record<string, boolean> = {
    openStatus: false,
  };

  setBoothStatus(newStatus: BoothOpenStatus): void {
    // TODO
    this.updatingStatus.openStatus = true;
    console.log("Set booth status:", newStatus);
    this.boothData.openStatus = newStatus;
    this.updatingStatus.openStatus = false;
  }
}
</script>
