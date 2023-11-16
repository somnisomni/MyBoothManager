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
    <p v-if="headlineText"><span class="text-red font-weight-bold">{{ headlineText }}</span></p>
    <slot></slot>
    <p v-if="showContacts"><br /> 문제가 지속되는 경우, <a :href="developerTwitterUrl" target="_blank">트위터 {{ developerTwitterHandle }}</a>로 문의해주세요.</p>
  </CommonDialog>
</template>

<script lang="ts">
import { DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import CommonDialog from "./CommonDialog.vue";

@Component({
  components: {
    CommonDialog,
  },
})
export default class CommonErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: String, default: null }) headlineText!: string | null;
  @Prop({ type: String, default: "오류" }) dialogTitle!: string;
  @Prop({ type: String, default: "green" }) accentColor!: string;
  @Prop({ type: Boolean, default: true }) showReloadButton!: boolean;
  @Prop({ type: Boolean, default: true }) showContacts!: boolean;
  @Prop({ type: Boolean, default: true }) closeable!: Boolean;

  get developerTwitterHandle(): string {
    return `@${DEVELOPER_TWITTER_HANDLE}`;
  }

  get developerTwitterUrl(): string {
    return `https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`;
  }

  reloadWindow() {
    window.location.reload();
  }
}
</script>
