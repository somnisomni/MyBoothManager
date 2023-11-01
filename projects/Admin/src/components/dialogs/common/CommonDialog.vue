<template>
  <VDialog v-model="open"
           :persistent="progressActive || persistent"
           :width="width"
           :max-width="maxWidth"
           :height="isFullScreenOnSmallScreenEligable ? '100%' : ''"
           :max-height="isFullScreenOnSmallScreenEligable ? '100%' : ''"
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
      <VLayout class="d-flex flex-row flex-grow-0 flex-shrink-0 flex-wrap justify-end align-center pa-2" :class="{ 'py-4': titleExtraMargin }">
        <VCardTitle class="flex-grow-1">{{ dialogTitle }}</VCardTitle>

        <div class="d-flex flex-row flex-nowrap">
          <VBtn v-for="btn in titleExtraButtons"
                :key="btn.icon"
                :disabled="progressActive || btn.disabled"
                :title="btn.title"
                icon
                variant="flat"
                class="mr-2"
                @click="() => { btn.onClick(); }">
            <VTooltip activator="parent" location="bottom">{{ btn.title }}</VTooltip>
            <VIcon>{{ btn.icon }}</VIcon>
          </VBtn>
          <VBtn v-if="!hideCloseButton"
                :disabled="progressActive || persistent"
                title="닫기"
                icon
                variant="flat"
                class="mr-2"
                @click.stop="onCloseButtonClick">
            <VTooltip activator="parent" location="bottom">닫기</VTooltip>
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </div>
      </VLayout>

      <VDivider />

      <!-- Content -->
      <VCardText :class="{ 'pa-0': contentNoPadding, 'px-6 py-4': !contentNoPadding }">
        <slot></slot>
      </VCardText>

      <VDivider v-if="isAnyDialogActionAvailable" />

      <!-- Dialog action -->
      <VCardActions v-if="isAnyDialogActionAvailable">
        <VBtn v-if="dialogLeftButtonText && onDialogLeftButton"
              :disabled="progressActive || disableLeftButton"
              :color="leftButtonColor"
              variant="text"
              @click="onDialogLeftButtonClick">{{ dialogLeftButtonText }}</VBtn>

        <VSpacer />

        <VBtn v-if="dialogCancelText && (onDialogCancel || closeOnCancel)"
              :disabled="progressActive || disableCancel"
              variant="text"
              @click="onDialogCancelButtonClick">{{ dialogCancelText }}</VBtn>

        <VBtn v-if="dialogSecondaryText && onDialogSecondary"
              :disabled="progressActive || disableSecondary"
              variant="text"
              @click="onDialogSecondaryButtonClick">{{ dialogSecondaryText }}</VBtn>

        <VBtn v-if="dialogPrimaryText && onDialogPrimary"
              :disabled="progressActive || disablePrimary"
              :color="accentColor"
              variant="text"
              @click="onDialogPrimaryButtonClick">{{ dialogPrimaryText }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { unref } from "vue";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";

export interface DialogButtonParams {
  title: string;
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
  @Prop({ type: Boolean, default: false }) fullscreenOnSmallScreen!: boolean;
  @Prop({ type: String, default: "700px" }) width!: string | number;
  @Prop({ type: String, default: "100%" }) maxWidth!: string | number;
  @Prop({ type: Boolean, default: false }) hideCloseButton!: boolean;
  @Prop({ type: Object }) titleExtraButtons!: DialogButtonParams[];
  @Prop({ type: Boolean, default: false }) titleExtraMargin!: boolean;
  @Prop({ type: Boolean, default: false }) contentNoPadding!: boolean;
  @Prop({ type: String, default: "알림" }) dialogTitle!: string;
  @Prop({ type: String, default: "닫기" }) dialogCancelText!: string;
  @Prop({ type: String, default: "확인" }) dialogPrimaryText!: string;
  @Prop({ type: String, default: null }) dialogSecondaryText!: string | null;
  @Prop({ type: String, default: null }) dialogLeftButtonText!: string | null;
  @Prop({ type: String, default: "warning" }) leftButtonColor!: string;
  @Prop({ type: Boolean, default: false }) disableCancel!: boolean;
  @Prop({ type: Boolean, default: false }) disablePrimary!: boolean;
  @Prop({ type: Boolean, default: false }) disableSecondary!: boolean;
  @Prop({ type: Boolean, default: false }) disableLeftButton!: boolean;
  @Prop({ type: Function, default: null }) onDialogCancel!: (() => void) | null;
  @Prop({ type: Function, default: null }) onDialogPrimary!: (() => void) | null;
  @Prop({ type: Function, default: null }) onDialogSecondary!: (() => void) | null;
  @Prop({ type: Function, default: null }) onDialogLeftButton!: (() => void) | null;
  @Prop({ type: Boolean, default: true }) closeOnCancel!: boolean;
  @Prop({ type: Boolean, default: false }) progressActive!: boolean;

  get isAnyDialogActionAvailable(): boolean {
    return (!!this.dialogPrimaryText && !!this.onDialogPrimary) ||
           (!!this.dialogSecondaryText && !!this.onDialogSecondary) ||
           (!!this.dialogCancelText && ((this.onDialogCancel && !this.closeOnCancel) || (!this.onDialogCancel && this.closeOnCancel)));
  }

  get isFullScreenOnSmallScreenEligable(): boolean {
    return this.fullscreenOnSmallScreen && unref(useDisplay().smAndDown);
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

  @Emit("leftbutton")
  onDialogLeftButtonClick() {
    if(this.onDialogLeftButton) this.onDialogLeftButton();
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
