<template>
  <DashboardPanel v-if="currentBoothStatus"
                  title="부스 운영 상태">
    <!-- Booth status text -->
    <div class="status-text">{{ getBoothStatusString(currentBoothStatus.status) }}</div>

    <!-- When status is PAUSE: Reason text if available-->
    <VExpandTransition>
      <div v-if="currentBoothStatus.status === BoothStatus.PAUSE && currentBoothStatus.reason"
           class="status-reason">
        <div class="text-grey-darken-2 reason-title">사유</div>
        <div class="reason-text">{{ currentBoothStatus.reason }}</div>
      </div>
    </VExpandTransition>

    <!-- When status is PREPARE: Content publish setting -->
    <VExpandTransition>
      <VLayout v-if="currentBoothStatus.status === BoothStatus.PREPARE || currentBoothStatus.status === BoothStatus.CLOSE"
               class="text-center flex-column">
        <div class="mt-6"><!-- Inner margin for smooth transition --></div>

        <div class="text-grey-darken-2">부스 정보 공개 상태 변경: </div>
        <VLayout class="flex-row justify-stretch mt-1">
          <VBtn :variant="currentBoothStatus.contentPublished ? 'flat' : 'outlined'"
                :disabled="currentBoothStatus.contentPublished || contentPublishStatusUpdateProgress"
                :loading="contentPublishStatusUpdateProgress"
                :color="currentBoothStatus.status === BoothStatus.CLOSE ? 'red' : 'green'"
                class="mr-1 flex-grow-1"
                @click.stop="updateContentPublishStatus(true)">
            <span>공개</span>
          </VBtn>
          <VBtn :variant="!currentBoothStatus.contentPublished ? 'flat' : 'outlined'"
                :disabled="!currentBoothStatus.contentPublished || contentPublishStatusUpdateProgress"
                :loading="contentPublishStatusUpdateProgress"
                color="grey"
                class="ml-1 flex-grow-1"
                @click.stop="updateContentPublishStatus(false)">
            <span>비공개</span>
          </VBtn>
        </VLayout>
      </VLayout>
    </VExpandTransition>

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
        <span class="ml-2">{{ getBoothStatusString(item.status) }}</span>
      </VBtn>
    </VLayout>
  </DashboardPanel>

  <BoothStatusUpdateDialog v-model="statusUpdateDialogOpen"
                           :targetStatus="statusUpdateDialogTargetStatus" />
</template>

<script lang="ts">
import type { IBoothStatus } from "@myboothmanager/common";
import { BoothStatus } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import BoothStatusUpdateDialog from "@/components/dialogs/BoothStatusUpdateDialog.vue";
import { getBoothStatusString } from "@/lib/enum-to-string";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
    BoothStatusUpdateDialog,
  },
})
export default class BoothStatusPanel extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly getBoothStatusString = getBoothStatusString;

  readonly STATUSES = [
    {
      status: BoothStatus.PREPARE,
      icon: "mdi-store-clock",
      color: "green",
    },
    {
      status: BoothStatus.OPEN,
      icon: "mdi-store-check",
      color: "blue",
    },
    {
      status: BoothStatus.PAUSE,
      icon: "mdi-store-alert",
      color: "orange-darken-1",
    },
    {
      status: BoothStatus.CLOSE,
      icon: "mdi-store-off",
      color: "red-darken-1",
    },
  ];

  contentPublishStatusUpdateProgress = false;

  statusUpdateDialogOpen = false;
  statusUpdateDialogTargetStatus: BoothStatus = BoothStatus.OPEN;

  get currentBoothStatus(): IBoothStatus | null {
    return useAdminStore().currentBooth.booth?.status ?? null;
  }

  onBoothStatusUpdateButtonClick(newStatus: BoothStatus): void {
    this.statusUpdateDialogTargetStatus = newStatus;
    this.statusUpdateDialogOpen = true;
  }

  async updateContentPublishStatus(publish: boolean): Promise<void> {
    this.contentPublishStatusUpdateProgress = true;

    await useAdminAPIStore().updateCurrentBoothStatus({
      contentPublished: publish,
    });

    this.contentPublishStatusUpdateProgress = false;
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
