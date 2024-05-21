<template>
  <CommonDialog v-model="open"
                :accentColor="accentColor"
                :progressActive="updateInProgress"
                :dialogTitle="dialogTitle"
                dialogCancelText="취소"
                dialogPrimaryText="변경하기"
                @cacnel="onDialogCancel"
                @primary="onDialogConfirm">
      <!-- Description -->
      <div v-if="targetStatusIsPreparing">
        <p>부스가 운영 준비(행사 개최 대기) 상태인 경우,</p><br />
        <ul>
          <li>부스 정보 비공개 설정 시: 일반 사용자는 부스 공개 페이지를 열람할 수 없습니다.</li>
          <li>부스 정보 공개 설정 시: 일반 사용자는 부스 공개 페이지를 열람하고 부스 정보를 확인할 수 있게 됩니다.</li>
        </ul><br/>
        <p>부스 정보 공개 여부는 부스 운영 상태를 변경한 후 설정할 수 있습니다.</p>
      </div>
      <div v-else-if="targetStatusIsClosing">
        <p>부스의 운영을 종료하면 <strong>메인 페이지 부스 목록에서 보여지지 않게 됩니다.</strong></p>
        <p>단, 부스 공개 페이지의 URL을 직접 입력하여 접속할 경우 계속해서 부스 정보를 열람할 수 있습니다.</p>
      </div>
      <div v-else-if="targetStatusIsPausing">
        <p>부스의 운영을 일시 중지하면 <strong>일반 사용자는 일시적으로 부스 페이지 내에서 상호작용을 할 수 없게 되지만, 부스 페이지를 계속해서 열람할 수 있습니다.</strong></p>
        <p>부스 현장에 인원이 없어 잠시 부스 운영을 중단하거나, 사건사고 발생, 또는 당일 부스 운영을 마치고 다음 날을 위해 준비하게 될 때 설정하는 것이 적합합니다.</p>
        <br />
        <p>부스 운영을 일시 중지하는 사유를 선택적으로 명시할 수 있습니다.</p>
      </div>
      <div v-else>
        <p>부스를 운영하기 시작하면 <strong>일반 사용자는 부스 공개 페이지를 열람하고 상호작용을 할 수 있게 됩니다.</strong></p>
        <p>현장 판매 모드(POS 모드)는 부스 운영 중에만 사용할 수 있습니다.</p>
      </div>

      <!-- Pause: optional reason input -->
      <VTextField v-if="targetStatusIsPausing"
                  v-model="statusReason"
                  label="일시 중지 사유"
                  class="mt-4 mx-8" />
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue, Watch } from "vue-facing-decorator";
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";

@Component({})
export default class BoothStatusUpdateDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ required: true }) targetStatus!: BoothStatus;

  updateInProgress = false;
  statusReason = "";

  get currentBoothData(): IBooth {
    return useAdminStore().currentBooth.booth!;
  }

  get dialogTitle(): string {
    switch(this.targetStatus) {
      case BoothStatus.PREPARE: return "부스 운영 준비";
      case BoothStatus.CLOSE: return "부스 운영 종료";
      case BoothStatus.PAUSE: return "부스 일시 중지";
      case BoothStatus.OPEN: return "부스 운영 시작";
      default: return "???";
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

  @Watch("open", { immediate: true }) onDialogOpen(value: boolean) { if(value) this.statusReason = ""; }

  @Emit("confirm")
  async onDialogConfirm() {
    this.updateInProgress = true;

    const result = await useAdminAPIStore().updateCurrentBoothStatus({
      status: this.targetStatus,
      reason: this.statusReason,
    });

    if(result === true) {
      this.$emit("updated");

      this.updateInProgress = false;
      this.open = false;
      return;
    } else {
      this.$emit("error");
    }

    this.updateInProgress = false;
  }

  onDialogCancel(): void {
    this.open = false;
  }
}
</script>
