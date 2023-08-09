<template>
  <DashboardPanel title="Booth Status">
    <div class="status-text">{{ openStatusString }}</div>
    <div v-if="currentBoothStatus.status === BoothOpenStatus.PAUSE && currentBoothStatus.reason" class="status-reason">
      <div class="text-grey-darken-2 reason-title">Reason</div>
      <div class="reason-text">{{ currentBoothStatus.reason }}</div>
    </div>

    <div class="mt-6 text-center text-grey-darken-2">Mark the booth as: </div>
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
      text: "Opened",
      icon: "mdi-store-check",
      color: "blue",
    },
    {
      status: BoothOpenStatus.PAUSE,
      text: "Paused",
      icon: "mdi-store-clock",
      color: "orange-darken-1",
    },
    {
      status: BoothOpenStatus.CLOSE,
      text: "Closed",
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
        return "Opened";
      case BoothOpenStatus.PAUSE:
        return "Paused";
      case BoothOpenStatus.CLOSE:
        return "Closed";
      default:
        return "Unknown";
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
