<template>
  <VDialog v-model="open"
           :persistent="updateInProgress"
           width="700"
           max-width="100%">
    <VCard :loading="updateInProgress">
      <template v-slot:loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         indeterminate
                         :color="accentColor"
                         height="4" />
      </template>

      <!-- Title -->
      <VCardTitle v-if="targetStatusIsClosing">Closing the booth</VCardTitle>
      <VCardTitle v-else-if="targetStatusIsPausing">Pausing the booth</VCardTitle>
      <VCardTitle v-else>Opening the booth</VCardTitle>

      <!-- Description -->
      <VCardText v-if="targetStatusIsClosing">
        <p>Closing the booth make the users can't interaction within the booth page, but still can view the page.</p>
      </VCardText>
      <VCardText v-else-if="targetStatusIsPausing">
        <p>Closing the booth make the users can't interaction within the booth page temporary, but still can view the page.</p>
        <p>Ideal status when you are stepping out the booth for a minute, or being ready for next day after finishing run the booth today.</p>
        <br />
        <p>You can optionally describe the reason of closing.</p>
      </VCardText>
      <VCardText v-else>
        <p>Users can interact within the booth page after opening the booth.</p>
      </VCardText>

      <!-- Pause: optional reason input -->
      <VTextField v-if="targetStatusIsPausing"
                  v-model="pausingReason"
                  label="Pausing reason"
                  class="mt-4 mx-8" />

      <!-- Dialog action -->
      <VCardActions>
        <VSpacer />
        <VBtn :disabled="updateInProgress" text @click="onDialogCancel">Cancel</VBtn>
        <VBtn :disabled="updateInProgress" :color="accentColor" text @click="onDialogConfirm">Confirm</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { BoothOpenStatus, type BoothData } from "@/types/booth";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothStatusUpdateDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ required: true }) targetStatus!: BoothOpenStatus;

  updateInProgress = false;
  pausingReason = "";

  get currentBoothData(): BoothData {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get targetStatusIsClosing(): boolean { return this.targetStatus === BoothOpenStatus.CLOSE; }
  get targetStatusIsPausing(): boolean { return this.targetStatus === BoothOpenStatus.PAUSE; }
  get accentColor(): string {
    switch(this.targetStatus) {
      case BoothOpenStatus.CLOSE: return "red";
      case BoothOpenStatus.PAUSE: return "orange";
      default: return "blue";
    }
  }

  @Emit("confirm")
  onDialogConfirm() {
    this.updateInProgress = true;

    // TODO: API call here

    setTimeout(() => {  // API call simulation; remove `setTimeout` in real code
      this.currentBoothData.status.status = this.targetStatus;
      this.currentBoothData.status.reason = this.pausingReason;

      this.updateInProgress = false;
      this.open = false;
      this.$emit("updateSuccess");
    }, 500);
  }

  onDialogCancel(): void {
    this.open = false;
  }
}
</script>
