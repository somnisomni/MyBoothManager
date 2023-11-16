<template>
  <CommonDialog v-model="open"
                width="auto"
                :hideCloseButton="true"
                :dialogTitle="dialogTitle"
                :dialogPrimaryText="primaryText"
                :dialogCancelText="cancelText"
                :accentColor="accentColor"
                @primary="closeDialog">
    <p v-if="headlineText"><span class="text-warning font-weight-bold">{{ headlineText }}</span></p>
    <slot></slot>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import CommonDialog from "./CommonDialog.vue";

@Component({
  components: {
    CommonDialog,
  },
})
export default class CommonWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: String, default: null }) headlineText!: string | null;
  @Prop({ type: String, default: "확인" }) primaryText!: string | null;
  @Prop({ type: String, default: null }) cancelText!: string | null;
  @Prop({ type: String, default: "경고" }) dialogTitle!: string;
  @Prop({ type: String, default: "warning" }) accentColor!: string;
  @Prop({ type: Boolean, default: true }) closeOnPrimary!: boolean;

  closeDialog() { if(this.closeOnPrimary) this.open = false; }
}
</script>
