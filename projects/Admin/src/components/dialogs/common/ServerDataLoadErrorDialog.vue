<template>
  <CommonDialog v-model="open"
                width="500"
                persistent
                disableCancel
                hideCloseButton
                dialogPrimaryText="새로 고침"
                dialogSecondaryText="로그아웃"
                :onDialogPrimary="onErrorDialogPrimary"
                :onDialogSecondary="onErrorDialogSecondary"
                dialogTitle="데이터 불러오기 오류"
                accentColor="green">
    <div class="text-red font-bold">서버로부터 데이터를 불러오는 중 오류가 발생했습니다. <span v-if="errorCode">({{ errorCode }})</span></div>
    <div>나중에 다시 시도하거나, <a :href="developerTwitterUrl" target="_blank">트위터 {{ developerTwitterHandle }}</a>로 문의해주세요.</div>
  </CommonDialog>
</template>

<script lang="ts">
import { DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import router from "@/plugins/router";

@Component({})
export default class ServerDataLoadErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Number, default: null }) errorCode!: number | null;

  get developerTwitterHandle(): string {
    return `@${DEVELOPER_TWITTER_HANDLE}`;
  }

  get developerTwitterUrl(): string {
    return `https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`;
  }

  onErrorDialogPrimary() {
    window.location.reload();
  }

  onErrorDialogSecondary() {
    window.location.href = router.resolve({ name: "logout" }).href || "/logout";
  }
}
</script>
