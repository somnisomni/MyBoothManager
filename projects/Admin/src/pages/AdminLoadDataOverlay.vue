<template>
  <VContainer class="position-fixed w-100 h-100 d-flex align-center justify-center flex-column bg-background"
              style="left: 0; right: 0; top: 0; bottom: 0;">
    <VProgressCircular :indeterminate="loadingTargetLength < 0"
                       :model-value="(100 / loadingTargetLength) * loadingTargetCurrentProgress"
                       size="96"
                       class="mb-4" />
    <div class="text-h6">{{ loadingTargetName }} 불러오는 중...</div>
    <div v-if="loadingTargetLength >= 0" class="text-caption">{{ loadingTargetCurrentProgress + 1}} / {{ loadingTargetLength }}</div>
  </VContainer>

  <ServerDataLoadErrorDialog v-model="apiErrorCode"
                             :errorCode="apiErrorCode" />
</template>

<script lang="ts">
import type { ErrorCodes } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";

@Component({
  emits: ["completed"],
})
export default class AdminLoadDataOverlay extends Vue {
  loadingTargetName = "";
  loadingTargetLength = -1;
  loadingTargetCurrentProgress = -1;

  apiErrorCode: ErrorCodes | null = null;

  get isBoothDataStillLoading() {
    return !useAdminStore().isBoothDataLoaded;
  }

  async mounted() {
    const $adminStore = useAdminStore();
    const $apiStore   = useAdminAPIStore();

    // Fetch current account info if not already fetched
    if(!$adminStore.currentAccount) {
      this.loadingTargetName = "계정 정보";
      const response = await $apiStore.fetchCurrentAccountInfo();
      if(typeof response === "number") {
        this.apiErrorCode = response;
        return;
      }
    }

    // Fetch account last selected booth data
    if($adminStore.isFirstLoad) {
      if(!$adminStore.currentAccount?.lastSelectedBoothId) {
        $adminStore.currentBooth.booth = null;

        // No booth available
        this.$emit("completed");
        return;
      } else {
        $adminStore.changeBooth($adminStore.currentAccount?.lastSelectedBoothId);
      }

      $adminStore.isFirstLoad = false;
    }

    // Wait for booth data to be loaded
    while(this.isBoothDataStillLoading) {
      this.loadingTargetName = "부스 정보";
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Fetch other data
    const fetchTargets: Array<[string, () => Promise<true | ErrorCodes>]> = [
      ["부스 멤버 목록", $apiStore.fetchBoothMembersOfCurrentBooth],
      ["굿즈 목록", $apiStore.fetchGoodsOfCurrentBooth],
      ["굿즈 세트 목록", $apiStore.fetchGoodsCombinationsOfCurrentBooth],
      ["굿즈 카테고리 목록", $apiStore.fetchGoodsCategoriesOfCurrentBooth],
      ["판매 기록", $apiStore.fetchGoodsOrdersOfCurrentBooth],
    ];

    this.loadingTargetLength = fetchTargets.length;
    this.loadingTargetCurrentProgress = 0;
    for(const [targetName, fetchFunc] of fetchTargets) {
      this.loadingTargetName = targetName;

      const response = await fetchFunc();
      if(typeof response === "number") {
        this.apiErrorCode = response;
        return;
      }

      this.loadingTargetCurrentProgress++;
    }

    // Emit completed event
    this.$emit("completed");
  }
}
</script>
