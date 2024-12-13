<template>
  <CommonDialog v-model="open"
                width="auto"
                :hideCloseButton="true"
                :dialogTitle="dialogTitle"
                :dialogPrimaryText="primaryText"
                :dialogCancelText="cancelText"
                :accentColor="accentColor"
                @primary="onDialogPrimary"
                @cancel="onDialogCancel">
    <p v-if="headlineText">
      <span class="text-warning font-weight-bold">{{ headlineText }}</span>
    </p>

    <slot />
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, toNative, Vue } from "vue-facing-decorator";
import CommonDialog from "./CommonDialog.vue";

@Component({
  emits: [ "primary", "cancel" ],
  components: {
    CommonDialog,
  },
})
export class CommonWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Prop({ type: String, default: null }) declare readonly headlineText: string | null;
  @Prop({ type: String, default: "확인" }) declare readonly primaryText: string | null;
  @Prop({ type: String, default: null }) declare readonly cancelText: string | null;
  @Prop({ type: String, default: "경고" }) declare readonly dialogTitle: string;
  @Prop({ type: String, default: "warning" }) declare readonly accentColor: string;
  @Prop({ type: Boolean, default: true }) declare readonly closeOnPrimary: boolean;

  @Emit("primary")
  onDialogPrimary() {
    if(this.closeOnPrimary) {
      this.open = false;
    }
  }

  @Emit("cancel")
  onDialogCancel() { }
}

export default toNative(CommonWarningDialog);
</script>
