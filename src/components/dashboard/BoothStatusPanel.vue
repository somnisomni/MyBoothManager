<template>
  <DashboardPanel title="부스 운영 상태">
    <!-- Booth status text -->
    <div class="status-text">{{ getBoothOpenStatusString(currentBoothStatus.status) }}</div>

    <!-- When status is PAUSE: Reason text if available-->
    <div v-if="currentBoothStatus.status === BoothOpenStatus.PAUSE && currentBoothStatus.reason" class="status-reason">
      <div class="text-grey-darken-2 reason-title">사유</div>
      <div class="reason-text">{{ currentBoothStatus.reason }}</div>
    </div>

    <!-- When status is PREPARE: Content publish setting -->
    <VLayout v-if="currentBoothStatus.status === BoothOpenStatus.PREPARE" class="mt-6 text-center flex-column">
      <div class="text-grey-darken-2">부스 정보 공개 상태 변경: </div>
      <VLayout class="flex-row justify-stretch mt-1">
        <VBtn :variant="currentBoothStatus.contentPublish ? 'flat' : 'outlined'"
              :disabled="currentBoothStatus.contentPublish" color="green" class="mr-1 flex-grow-1">공개</VBtn>
        <VBtn :variant="!currentBoothStatus.contentPublish ? 'flat' : 'outlined'"
              :disabled="!currentBoothStatus.contentPublish" color="grey" class="ml-1 flex-grow-1">비공개</VBtn>
      </VLayout>
    </VLayout>

    <!-- Booth status changer -->
    <div class="mt-6 text-center text-grey-darken-2">부스 상태 변경: </div>
    <VLayout class="flex-column">
      <VBtn v-for="item in STATUSES"
            :key="item.status"
            :color="item.color"
            :variant="currentBoothStatus.status === item.status ? 'flat' : 'outlined'"
            :disabled="currentBoothStatus.status === item.status"
            class="my-1"
            height="42"
            @click="onBoothStatusUpdateButtonClick(item.status)">
        <VIcon>{{ item.icon }}</VIcon>
        <span class="ml-2">{{ getBoothOpenStatusString(item.status) }}</span>
      </VBtn>
    </VLayout>
  </DashboardPanel>

  <BoothStatusUpdateDialog v-model="statusUpdateDialogOpen"
                           :targetStatus="statusUpdateDialogTargetStatus"
                           @updateSuccess="onBoothStatusUpdateDialogSuccess" />
</template>

<script lang="ts">
import { BoothOpenStatus, type BoothStatusData } from "@/types/booth";
import { Component, Prop, Vue } from "vue-facing-decorator";
import BoothStatusUpdateDialog from "@/components/BoothStatusUpdateDialog.vue";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
    BoothStatusUpdateDialog,
  },
})
export default class BoothStatusPanel extends Vue {
  BoothOpenStatus = BoothOpenStatus;
  getBoothOpenStatusString = BoothOpenStatus.getBoothOpenStatusString;

  @Prop({ required: true }) currentBoothStatus!: BoothStatusData;

  readonly STATUSES = [
    {
      status: BoothOpenStatus.PREPARE,
      icon: "mdi-store-clock",
      color: "green",
    },
    {
      status: BoothOpenStatus.OPEN,
      icon: "mdi-store-check",
      color: "blue",
    },
    {
      status: BoothOpenStatus.PAUSE,
      icon: "mdi-store-alert",
      color: "orange-darken-1",
    },
    {
      status: BoothOpenStatus.CLOSE,
      icon: "mdi-store-off",
      color: "red-darken-1",
    },
  ];

  statusUpdateDialogOpen = false;
  statusUpdateDialogTargetStatus: BoothOpenStatus = BoothOpenStatus.OPEN;

  onBoothStatusUpdateButtonClick(newStatus: BoothOpenStatus): void {
    this.statusUpdateDialogTargetStatus = newStatus;
    this.statusUpdateDialogOpen = true;
  }

  onBoothStatusUpdateDialogSuccess(): void {
    console.log("success");
    // TODO?
  }

  get openStatusString(): string {
    switch(this.currentBoothStatus.status) {
      case BoothOpenStatus.OPEN:
        return "운영 중";
      case BoothOpenStatus.PAUSE:
        return "일시 중지";
      case BoothOpenStatus.CLOSE:
        return "운영 종료";
      default:
        return "알 수 없음";
    }
  }
}
</script>

<style lang="scss" scoped>
.status-text {
  text-align: center;
  font-size: 2.5em;
  font-weight: 500;
}

.status-reason {
  text-align: center;
  font-size: 1.33em;

  .reason-title {
    font-size: 0.9em;
  }

  .reason-text {
    word-break: break-word;
  }
}
</style>
