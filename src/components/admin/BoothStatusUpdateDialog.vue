<template>
  <VDialog v-model="open">
    <VCard>
      <!-- Title -->
      <VCardTitle v-if="targetStatusIsClosing">Closing the booth</VCardTitle>
      <VCardTitle v-else>Opening the booth</VCardTitle>

      <!-- Description -->
      <VCardText v-if="targetStatusIsClosing">
        <p>Closing the booth make the users can't interaction within the booth page, but still can view the page.</p>
        <br />
        <p>You can optionally describe the reason of closing.</p>
      </VCardText>
      <VCardText v-else>
        <p>Users can interact within the booth page after opening the booth.</p>
      </VCardText>

      <!-- Close: optional reason input -->
      <VTextField v-if="targetStatusIsClosing"
                  v-model="closingReason"
                  label="Closing reason"
                  class="mt-4 mx-8" />

      <!-- Dialog action -->
      <VCardActions>
        <VSpacer />
        <VBtn text @click="onDialogCancel">Cancel</VBtn>
        <VBtn :color="targetStatusIsClosing ? 'red' : 'blue'" text @click="onDialogConfirm">Confirm</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { BoothOpenStatus } from "@/types/booth";

@Component({})
export default class BoothStatusUpdateDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ required: true }) targetStatus!: BoothOpenStatus;

  closingReason = "";

  get targetStatusIsClosing(): boolean {
    return this.targetStatus === BoothOpenStatus.CLOSE;
  }

  @Emit("confirm")
  onDialogConfirm() {
    this.open = false;

    return {
      targetStatus: this.targetStatus,
      reason: this.targetStatusIsClosing ? this.closingReason : undefined,
    };
  }

  onDialogCancel(): void {
    this.open = false;
  }
}
</script>
