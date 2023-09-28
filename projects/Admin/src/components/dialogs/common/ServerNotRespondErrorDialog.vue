<template>
  <CommonDialog v-model="open"
                width="auto"
                persistent
                disableCancel
                hideCloseButton
                dialogTitle="서버 응답 없음"
                dialogPrimaryText="새로 고침"
                :onDialogPrimary="reloadWindow"
                accentColor="blue">
    <p><span class="text-red"><strong>서버에 연결할 수 없습니다.</strong></span></p>
    <p>네트워크 연결 상태를 확인하거나, 나중에 다시 시도해주세요.</p>
    <br />
    <p>문제가 지속되면 <a :href="developerTwitterUrl" target="_blank">트위터 {{ developerTwitterHandle }}</a>로 문의해주세요.</p>
  </CommonDialog>
</template>

<script lang="ts">
import { DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";
import { Component, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class ServerNotRespondErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  get developerTwitterHandle(): string {
    return `@${DEVELOPER_TWITTER_HANDLE}`;
  }

  get developerTwitterUrl(): string {
    return `https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`;
  }

  reloadWindow(): void {
    window.location.reload();
  }
}
</script>
