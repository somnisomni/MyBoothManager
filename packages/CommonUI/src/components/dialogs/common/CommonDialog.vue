<template>
  <VDialog v-model="open"
           :persistent="progressActive || persistent"
           :width="isFullScreenOnSmallScreenEligable ? '100%' : width"
           :maxWidth="isFullScreenOnSmallScreenEligable ? '100%' : maxWidth"
           :height="isFullScreenOnSmallScreenEligable ? '100%' : ''"
           :maxHeight="isFullScreenOnSmallScreenEligable ? '100%' : ''"
           :scrollable="scrollable"
           class="dialog-common">
    <VCard :loading="progressActive"
           class="ma-0 ma-sm-4">
      <template #loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         :color="accentColor"
                         indeterminate
                         height="4" />
      </template>

      <!-- Title -->
      <VLayout class="d-flex flex-row flex-grow-0 flex-shrink-0 flex-wrap justify-end align-center pa-2"
               :class="{ 'py-4': titleExtraMargin }">
        <VCardTitle class="flex-grow-1">
          <span>{{ dialogTitle }}</span>
        </VCardTitle>

        <div class="title-area d-flex flex-row flex-nowrap">
          <VBtn v-for="btn in titleExtraButtons"
                :key="btn.icon"
                :disabled="progressActive || btn.disabled"
                :title="btn.title"
                icon
                variant="flat"
                class="mr-2"
                @click="() => { btn.onClick(); }">
            <VIcon :icon="btn.icon" />

            <VTooltip activator="parent"
                      location="bottom">
              <span>{{ btn.title }}</span>
            </VTooltip>
          </VBtn>
          <VBtn v-if="!hideCloseButton"
                :disabled="progressActive || persistent"
                :title="dialogCancelText ?? '닫기'"
                icon
                variant="flat"
                class="button-close mr-2"
                @click.stop="onCloseButtonClick">
            <VIcon icon="mdi-close" />

            <VTooltip activator="parent"
                      location="bottom">
              <span>{{ dialogCancelText ?? '닫기' }}</span>
            </VTooltip>
          </VBtn>
        </div>
      </VLayout>

      <VDivider />

      <!-- Content -->
      <VCardText :class="{ 'pa-0': contentNoPadding, 'px-6 py-4': !contentNoPadding }">
        <slot />
      </VCardText>

      <VDivider v-if="isAnyDialogActionAvailable" />

      <!-- Dialog action -->
      <VCardActions v-if="isAnyDialogActionAvailable">
        <VBtn v-if="dialogLeftButtonText"
              :disabled="progressActive || disableLeftButton"
              :color="leftButtonColor"
              variant="text"
              @click="onDialogLeftButtonClick">
          <span>{{ dialogLeftButtonText }}</span>
        </VBtn>

        <VSpacer />

        <VBtn v-if="dialogCancelText"
              :disabled="progressActive || disableCancel"
              variant="text"
              @click="onDialogCancelButtonClick">
          <span>{{ dialogCancelText }}</span>
        </VBtn>

        <VBtn v-if="dialogSecondaryText"
              :disabled="progressActive || disableSecondary"
              variant="text"
              @click="onDialogSecondaryButtonClick">
          <span>{{ dialogSecondaryText }}</span>
        </VBtn>

        <VBtn v-if="dialogPrimaryText"
              :disabled="progressActive || disablePrimary"
              :color="accentColor"
              variant="text"
              @click="onDialogPrimaryButtonClick">
          <span>{{ dialogPrimaryText }}</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";

export interface CommonDialogButtonParams {
  title: string;
  icon: string;
  disabled?: boolean;
  onClick(): void;
}

@Component({
  emits: [ "close", "primary", "secondary", "leftbutton", "cancel" ],
})
export class CommonDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly persistent: boolean;
  @Prop({ type: Boolean, default: true }) declare readonly scrollable: boolean;
  @Prop({ type: String, default: "primary" }) declare readonly accentColor: string;
  @Prop({ type: Boolean, default: false }) declare readonly fullscreenOnSmallScreen: boolean;
  @Prop({ type: String, default: "700px" }) declare readonly width: string | number;
  @Prop({ type: String, default: "100%" }) declare readonly maxWidth: string | number;
  @Prop({ type: Boolean, default: false }) declare readonly hideCloseButton: boolean;
  @Prop({ type: Object }) declare readonly titleExtraButtons: CommonDialogButtonParams[];
  @Prop({ type: Boolean, default: false }) declare readonly titleExtraMargin: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly contentNoPadding: boolean;
  @Prop({ type: String, default: "알림" }) declare readonly dialogTitle: string;
  @Prop({ type: String, default: "닫기" }) declare readonly dialogCancelText: string | null;
  @Prop({ type: String, default: null }) declare readonly dialogPrimaryText: string | null;
  @Prop({ type: String, default: null }) declare readonly dialogSecondaryText: string | null;
  @Prop({ type: String, default: null }) declare readonly dialogLeftButtonText: string | null;
  @Prop({ type: String, default: "warning" }) declare readonly leftButtonColor: string;
  @Prop({ type: Boolean, default: false }) declare readonly disableCancel: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly disablePrimary: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly disableSecondary: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly disableLeftButton: boolean;
  @Prop({ type: Boolean, default: true }) declare readonly closeOnCancel: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly progressActive: boolean;

  @Setup(() => useDisplay().smAndUp)
  smAndUp!: boolean;

  get isAnyDialogActionAvailable(): boolean {
    return (!!this.dialogPrimaryText)
      || (!!this.dialogSecondaryText)
      || (!!this.dialogCancelText && !this.closeOnCancel);
  }

  get isFullScreenOnSmallScreenEligable(): boolean {
    return this.fullscreenOnSmallScreen && !this.smAndUp;
  }

  @Emit("close")
  onCloseButtonClick(): void {
    this.open = false;
  }

  @Emit("primary")
  onDialogPrimaryButtonClick(): void { }

  @Emit("secondary")
  onDialogSecondaryButtonClick(): void { }

  @Emit("leftbutton")
  onDialogLeftButtonClick(): void { }

  @Emit("cancel")
  onDialogCancelButtonClick(): void {
    if(this.closeOnCancel) {
      this.open = false;
    }
  }
}

export default toNative(CommonDialog);
</script>
