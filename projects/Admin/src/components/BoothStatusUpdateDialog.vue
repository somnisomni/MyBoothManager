<template>
  <CommonDialog v-model="open"
                :accentColor="accentColor"
                :progressActive="updateInProgress"
                :dialogTitle="dialogTitle"
                dialogCancelText="취소"
                dialogPrimaryText="변경하기"
                :onDialogCancel="onDialogCancel"
                :onDialogPrimary="onDialogConfirm">
      <!-- Description -->
      <div v-if="targetStatusIsPreparing">
        <p>부스가 운영 준비(행사 개최 대기) 상태인 경우,</p><br />
        <ul>
          <li>부스 정보 비공개 설정 시: 일반 사용자는 부스 페이지 열람 시 부스의 정보는 확인할 수 없고, 준비 중이라는 메시지만 표시됩니다.</li>
          <li>부스 정보 공개 설정 시: 일반 사용자는 부스 페이지에서 부스 정보를 확인할 수 있지만, 부스의 운영이 시작되기 전까지 상호작용을 할 수 없게 됩니다.</li>
        </ul><br/>
        <p>부스 정보 공개 여부는 부스 운영 상태를 변경한 후 설정할 수 있습니다.</p>
      </div>
      <div v-else-if="targetStatusIsClosing">
        <p>부스의 운영을 종료하면 <strong>일반 사용자는 부스 페이지 내에서 상호작용을 할 수 없게 되지만, 부스 페이지를 계속해서 열람할 수 있습니다.</strong></p>
      </div>
      <div v-else-if="targetStatusIsPausing">
        <p>부스의 운영을 일시 중지하면 <strong>일반 사용자는 일시적으로 부스 페이지 내에서 상호작용을 할 수 없게 되지만, 부스 페이지를 계속해서 열람할 수 있습니다.</strong></p>
        <p>부스에서 자리를 뜨게 되어 직접적인 운영이 잠시 불가능해지거나, 사건사고 발생, 또는 당일 부스 운영을 마치고 다음 날을 위해 준비하게 될 때 설정하는 것이 적합합니다.</p>
        <br />
        <p>부스를 일시 중지하는 사유를 선택적으로 명시할 수 있습니다.</p>
      </div>
      <div v-else>
        <p>부스를 운영하기 시작하면 <strong>일반 사용자는 부스 페이지에서 상호작용을 할 수 있게 됩니다.</strong></p>
      </div>

      <!-- Pause: optional reason input -->
      <VTextField v-if="targetStatusIsPausing"
                  v-model="pausingReason"
                  label="일시 중지 사유"
                  class="mt-4 mx-8" />
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { BoothStatus, type IBooth } from "@myboothmanager/common";

@Component({})
export default class BoothStatusUpdateDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ required: true }) targetStatus!: BoothStatus;

  updateInProgress = false;
  pausingReason = "";

  get currentBoothData(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get dialogTitle(): string {
    switch(this.targetStatus) {
    case BoothStatus.PREPARE: return "부스 운영 준비";
    case BoothStatus.CLOSE: return "부스 운영 종료";
    case BoothStatus.PAUSE: return "부스 일시 중지";
    case BoothStatus.OPEN: return "부스 운영 시작";
    default: return "<알 수 없는 상태로 변경>";
    }
  }

  get targetStatusIsPreparing(): boolean { return this.targetStatus === BoothStatus.PREPARE; }
  get targetStatusIsClosing(): boolean { return this.targetStatus === BoothStatus.CLOSE; }
  get targetStatusIsPausing(): boolean { return this.targetStatus === BoothStatus.PAUSE; }
  get accentColor(): string {
    switch(this.targetStatus) {
    case BoothStatus.PREPARE: return "green";
    case BoothStatus.CLOSE: return "red";
    case BoothStatus.PAUSE: return "orange";
    default: return "blue";
    }
  }

  @Emit("confirm")
  onDialogConfirm() {
    this.updateInProgress = true;

    // TODO: API call here

    setTimeout(() => {  // API call simulation; remove `setTimeout` in real code
      this.currentBoothData.status = this.targetStatus;
      this.currentBoothData.statusReason = this.pausingReason;

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
