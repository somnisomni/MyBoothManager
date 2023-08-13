<template>
  <VDialog v-model="open"
           :persistent="updateInProgress"
           width="700"
           max-width="100%">
    <VCard :loading="updateInProgress" class="ma-0 ma-sm-4">
      <template v-slot:loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         indeterminate
                         :color="accentColor"
                         height="4" />
      </template>

      <!-- Title -->
      <VCardTitle v-if="targetStatusIsClosing">부스 운영 종료</VCardTitle>
      <VCardTitle v-else-if="targetStatusIsPausing">부스 일시 중지</VCardTitle>
      <VCardTitle v-else>부스 운영 시작</VCardTitle>

      <VDivider />

      <!-- Description -->
      <VCardText v-if="targetStatusIsClosing">
        <p>부스의 운영을 종료하면 <strong>일반 사용자는 부스 페이지 내에서 상호작용을 할 수 없게 되지만, 부스 페이지를 계속해서 열람할 수 있습니다.</strong></p>
      </VCardText>
      <VCardText v-else-if="targetStatusIsPausing">
        <p>부스의 운영을 일시 중지하면 <strong>일반 사용자는 일시적으로 부스 페이지 내에서 상호작용을 할 수 없게 되지만, 부스 페이지를 계속해서 열람할 수 있습니다.</strong></p>
        <p>부스에서 자리를 뜨게 되어 직접적인 운영이 잠시 불가능해지거나, 사건사고 발생, 또는 당일 부스 운영을 마치고 다음 날을 위해 준비하게 될 때 설정하는 것이 적합합니다.</p>
        <br />
        <p>부스를 일시 중지하는 사유를 선택적으로 명시할 수 있습니다.</p>
      </VCardText>
      <VCardText v-else>
        <p>부스를 운영하기 시작하면 <strong>일반 사용자는 부스 페이지에서 상호작용을 할 수 있게 됩니다.</strong></p>
      </VCardText>

      <!-- Pause: optional reason input -->
      <VTextField v-if="targetStatusIsPausing"
                  v-model="pausingReason"
                  label="일시 중지 사유"
                  class="mt-4 mx-8" />

      <VDivider />

      <!-- Dialog action -->
      <VCardActions>
        <VSpacer />
        <VBtn :disabled="updateInProgress" text @click="onDialogCancel">취소</VBtn>
        <VBtn :disabled="updateInProgress" :color="accentColor" text @click="onDialogConfirm">변경하기</VBtn>
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
