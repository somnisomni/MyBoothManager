<template>
  <DashboardPanel title="부스 운영 상태">
    <div class="status-text">{{ openStatusString }}</div>
    <div v-if="currentBoothStatus.status === BoothOpenStatus.PAUSE && currentBoothStatus.reason" class="status-reason">
      <div class="text-grey-darken-2 reason-title">사유</div>
      <div class="reason-text">{{ currentBoothStatus.reason }}</div>
    </div>

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
        <span class="ml-2">{{ item.text }}</span>
      </VBtn>
    </VLayout>
  </DashboardPanel>

  <BoothStatusUpdateDialog v-model="statusUpdateDialogOpen"
                           :targetStatus="statusUpdateDialogTargetStatus"
                           @updateSuccess="onBoothStatusUpdateDialogSuccess" />
</template>

<script lang="ts">
import { BoothOpenStatus } from "@/types/booth";
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

  @Prop({ required: true }) currentBoothStatus!: {
    status: BoothOpenStatus,
    reason?: string,
  };

  readonly STATUSES = [
    {
      status: BoothOpenStatus.OPEN,
      text: "운영 중",
      icon: "mdi-store-check",
      color: "blue",
    },
    {
      status: BoothOpenStatus.PAUSE,
      text: "일시 중지",
      icon: "mdi-store-clock",
      color: "orange-darken-1",
    },
    {
      status: BoothOpenStatus.CLOSE,
      text: "운영 종료",
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
