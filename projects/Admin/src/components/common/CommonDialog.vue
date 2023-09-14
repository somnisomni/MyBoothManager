<template>
  <VDialog v-model="open"
           :persistent="progressActive || persistent"
           :width="width"
           :max-width="maxWidth"
           :scrollable="scrollable"
           class="dialog-common">
    <VCard :loading="progressActive" class="ma-0 ma-sm-4">
      <template v-slot:loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         :color="accentColor"
                         indeterminate
                         height="4" />
      </template>

      <!-- Title -->
      <VRow class="pa-4" :class="{ 'py-6': titleExtraMargin }">
        <VCardTitle class="flex-grow-1">{{ dialogTitle }}</VCardTitle>

        <VBtn v-for="btn in titleExtraButtons"
              v-key="btn.icon"
              :disabled="progressActive || btn.disabled"
              icon
              variant="flat"
              class="mr-2"
              @click="() => { btn.onClick(); }"><VIcon>{{ btn.icon }}</VIcon></VBtn>
        <VBtn v-if="!hideCloseButton"
              :disabled="progressActive || persistent"
              icon
              variant="flat"
              class="mr-2"
              @click.stop="onCloseButtonClick">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VRow>

      <VDivider />

      <!-- Content -->
      <VCardText :class="{ 'pa-0': contentNoPadding, 'px-6 py-4': !contentNoPadding }">
        <slot></slot>
      </VCardText>

      <VDivider v-if="isAnyDialogActionAvailable" />

      <!-- Dialog action -->
      <VCardActions v-if="isAnyDialogActionAvailable">
        <VSpacer />

        <VBtn v-if="dialogCancelText && (onDialogCancel || closeOnCancel)"
              :disabled="progressActive || disableCancel"
              text
              @click="onDialogCancelButtonClick">{{ dialogCancelText }}</VBtn>

        <VBtn v-if="dialogSecondaryText && onDialogSecondary"
              :disabled="progressActive || disableSecondary"
              text
              @click="onDialogSecondaryButtonClick">{{ dialogSecondaryText }}</VBtn>

        <VBtn v-if="dialogPrimaryText && onDialogPrimary"
              :disabled="progressActive || disablePrimary"
              :color="accentColor"
              text
              @click="onDialogPrimaryButtonClick">{{ dialogPrimaryText }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";

export interface DialogButtonParams {
  icon: string;
  disabled?: boolean;
  onClick: () => void;
}

@Component({})
export default class CommonDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) persistent!: boolean;
  @Prop({ type: Boolean, default: true }) scrollable!: boolean;
  @Prop({ type: String, default: "primary" }) accentColor!: string;
  @Prop({ type: String, default: 700 }) width!: string | number;
  @Prop({ type: String, default: "100%" }) maxWidth!: string | number;
  @Prop({ type: Boolean, default: false }) hideCloseButton!: boolean;
  @Prop({ type: Object }) titleExtraButtons!: DialogButtonParams[];
  @Prop({ type: Boolean, default: false }) titleExtraMargin!: boolean;
  @Prop({ type: Boolean, default: false }) contentNoPadding!: boolean;
  @Prop({ type: String, default: "알림" }) dialogTitle!: string;
  @Prop({ type: String, default: "닫기" }) dialogCancelText!: string;
  @Prop({ type: String, default: "확인" }) dialogPrimaryText!: string;
  @Prop({ type: String, default: null }) dialogSecondaryText!: string | null;
  @Prop({ type: Boolean, default: false }) disableCancel!: boolean;
  @Prop({ type: Boolean, default: false }) disablePrimary!: boolean;
  @Prop({ type: Boolean, default: false }) disableSecondary!: boolean;
  @Prop({ type: Function, default: null }) onDialogCancel!: (() => void) | null;
  @Prop({ type: Function, default: null }) onDialogPrimary!: (() => void) | null;
  @Prop({ type: Function, default: null }) onDialogSecondary!: (() => void) | null;
  @Prop({ type: Boolean, default: true }) closeOnCancel!: boolean;
  @Prop({ type: Boolean, default: false }) progressActive!: boolean;

  get isAnyDialogActionAvailable(): boolean {
    return (!!this.dialogPrimaryText && !!this.onDialogPrimary) ||
           (!!this.dialogSecondaryText && !!this.onDialogSecondary) ||
           (!!this.dialogCancelText && ((this.onDialogCancel && !this.closeOnCancel) || (!this.onDialogCancel && this.closeOnCancel)));
  }

  @Emit("close")
  onCloseButtonClick() {
    this.open = false;
  }

  @Emit("primary")
  onDialogPrimaryButtonClick() {
    if(this.onDialogPrimary) this.onDialogPrimary();
  }

  @Emit("secondary")
  onDialogSecondaryButtonClick() {
    if(this.onDialogSecondary) this.onDialogSecondary();
  }

  @Emit("cancel")
  onDialogCancelButtonClick() {
    if(this.onDialogCancel) this.onDialogCancel();
    if(this.closeOnCancel) this.open = false;
  }
}
</script>

<style lang="scss">
/* Workaround */
.dialog-common > .v-overlay__content { overflow: initial !important; }
</style>
