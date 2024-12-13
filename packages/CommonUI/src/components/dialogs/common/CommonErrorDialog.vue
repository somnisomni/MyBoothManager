<template>
  <CommonDialog v-model="open"
                width="auto"
                persistent
                :disableCancel="!closeable"
                :hideCloseButton="!closeable"
                :dialogTitle="dialogTitle"
                :dialogPrimaryText="showReloadButton ? '새로 고침' : null"
                :accentColor="accentColor"
                @primary="reloadWindow">
    <p v-if="headlineText">
      <span class="text-red font-weight-bold">{{ headlineText }}</span>
    </p>

    <slot />

    <p v-if="showContacts">
      <span><br> 문제가 지속되는 경우,</span>

      <a :href="developerTwitterUrl"
         target="_blank">트위터 {{ developerTwitterHandle }}</a>

      <span>로 문의해주세요.</span>
    </p>
  </CommonDialog>
</template>

<script lang="ts">
import { DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, toNative, Vue } from "vue-facing-decorator";
import CommonDialog from "./CommonDialog.vue";

@Component({
  emits: [ "primary" ],
  components: {
    CommonDialog,
  },
})
export class CommonErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Prop({ type: String, default: null }) declare readonly headlineText: string | null;
  @Prop({ type: String, default: "오류" }) declare readonly dialogTitle: string;
  @Prop({ type: String, default: "green" }) declare readonly accentColor: string;
  @Prop({ type: Boolean, default: true }) declare readonly showReloadButton: boolean;
  @Prop({ type: Boolean, default: true }) declare readonly showContacts: boolean;
  @Prop({ type: Boolean, default: true }) declare readonly closeable: boolean;

  get developerTwitterHandle(): string {
    return `@${DEVELOPER_TWITTER_HANDLE}`;
  }

  get developerTwitterUrl(): string {
    return `https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`;
  }

  @Emit("primary") reloadWindow() { window.location.reload(); }
}

export default toNative(CommonErrorDialog);
</script>
