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

        <div class="title-area d-flex flex-row flex-nowrap">
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
                class="button-close mr-2"
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
        <VBtn v-if="dialogLeftButtonText"
              :disabled="progressActive || disableLeftButton"
              :color="leftButtonColor"
              variant="text"
              @click="onDialogLeftButtonClick">{{ dialogLeftButtonText }}</VBtn>

        <VSpacer />

        <VBtn v-if="dialogCancelText"
              :disabled="progressActive || disableCancel"
              variant="text"
              @click="onDialogCancelButtonClick">{{ dialogCancelText }}</VBtn>

        <VBtn v-if="dialogSecondaryText"
              :disabled="progressActive || disableSecondary"
              variant="text"
              @click="onDialogSecondaryButtonClick">{{ dialogSecondaryText }}</VBtn>

        <VBtn v-if="dialogPrimaryText"
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

export interface CommonDialogButtonParams {
  title: string;
  icon: string;
  disabled?: boolean;
  onClick: () => void;
}

@Component({
  emits: ["close", "primary", "secondary", "leftbutton", "cancel"],
})
export default class CommonDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) persistent!: boolean;
  @Prop({ type: Boolean, default: true }) scrollable!: boolean;
  @Prop({ type: String, default: "primary" }) accentColor!: string;
  @Prop({ type: Boolean, default: false }) fullscreenOnSmallScreen!: boolean;
  @Prop({ type: String, default: "700px" }) width!: string | number;
  @Prop({ type: String, default: "100%" }) maxWidth!: string | number;
  @Prop({ type: Boolean, default: false }) hideCloseButton!: boolean;
  @Prop({ type: Object }) titleExtraButtons!: CommonDialogButtonParams[];
  @Prop({ type: Boolean, default: false }) titleExtraMargin!: boolean;
  @Prop({ type: Boolean, default: false }) contentNoPadding!: boolean;
  @Prop({ type: String, default: "알림" }) dialogTitle!: string;
  @Prop({ type: String, default: "닫기" }) dialogCancelText!: string | null;
  @Prop({ type: String, default: null }) dialogPrimaryText!: string | null;
  @Prop({ type: String, default: null }) dialogSecondaryText!: string | null;
  @Prop({ type: String, default: null }) dialogLeftButtonText!: string | null;
  @Prop({ type: String, default: "warning" }) leftButtonColor!: string;
  @Prop({ type: Boolean, default: false }) disableCancel!: boolean;
  @Prop({ type: Boolean, default: false }) disablePrimary!: boolean;
  @Prop({ type: Boolean, default: false }) disableSecondary!: boolean;
  @Prop({ type: Boolean, default: false }) disableLeftButton!: boolean;
  @Prop({ type: Boolean, default: true }) closeOnCancel!: boolean;
  @Prop({ type: Boolean, default: false }) progressActive!: boolean;

  get isAnyDialogActionAvailable(): boolean {
    return (!!this.dialogPrimaryText) ||
           (!!this.dialogSecondaryText) ||
           (!!this.dialogCancelText && !this.closeOnCancel);
  }

  get isFullScreenOnSmallScreenEligable(): boolean {
    return this.fullscreenOnSmallScreen && unref(useDisplay().smAndDown);
  }

  @Emit("close")
  onCloseButtonClick() {
    this.open = false;
  }

  @Emit("primary")
  onDialogPrimaryButtonClick() { }

  @Emit("secondary")
  onDialogSecondaryButtonClick() { }

  @Emit("leftbutton")
  onDialogLeftButtonClick() { }

  @Emit("cancel")
  onDialogCancelButtonClick() {
    if(this.closeOnCancel) this.open = false;
  }
}
</script>
