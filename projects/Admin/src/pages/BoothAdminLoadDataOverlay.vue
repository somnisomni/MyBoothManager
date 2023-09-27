<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center flex-column bg-background">
    <VProgressCircular indeterminate size="96" class="mb-4" />
    <div class="text-h6">데이터를 불러오는 중...</div>
  </VContainer>

  <CommonDialog v-model="errorDialogShown"
                width="500"
                persistent
                disableCancel
                hideCloseButton
                dialogPrimaryText="재시도"
                dialogSecondaryText="로그아웃"
                :onDialogPrimary="onErrorDialogPrimary"
                :onDialogSecondary="onErrorDialogSecondary"
                dialogTitle="데이터 불러오기 오류"
                accentColor="green">
    <div class="text-red font-bold">서버로부터 데이터를 불러오는 중 오류가 발생했습니다.</div>
    <div>나중에 다시 시도하거나, <a :href="developerTwitterUrl" target="_blank">트위터 {{ developerTwitterHandle }}</a>로 문의해주세요.</div>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import router from "@/router";

@Component({
  emits: ["completed"],
})
export default class BoothAdminLoadDataOverlay extends Vue {
  errorDialogShown = false;

  get developerTwitterHandle(): string {
    return `@${DEVELOPER_TWITTER_HANDLE}`;
  }

  get developerTwitterUrl(): string {
    return `https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`;
  }

  async mounted() {
    if(!useAdminStore().currentAccount) {
      if(typeof (await useAdminStore().fetchCurrentAccountInfo()) === "string") {
        this.errorDialogShown = true;
        return;
      }
    }

    if(await useAdminStore().fetchAllBoothData()) {
      this.$emit("completed");
    } else {
      this.errorDialogShown = true;
    }
  }

  onErrorDialogPrimary() {
    window.location.reload();
  }

  onErrorDialogSecondary() {
    window.location.href = router.resolve({ name: "logout" }).href || "/logout";
  }
}
</script>
