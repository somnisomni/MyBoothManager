<template>
  <VDialog v-model="open"
           scrollable
           width="700"
           max-width="100%"
           class="booth-selection-dialog">
    <VCard class="ma-0 ma-sm-4">
      <VCardTitle class="mt-2 mb-2">관리할 부스 선택</VCardTitle>
      <VDivider />
      <VCardText class="pa-0">
        <VSheet v-for="booth in boothList"
                :key="booth.id"
                class="booth-item"
                v-ripple
                @click.stop="onBoothSelect(booth.id)">
          <div class="booth-item-image-container">
            <VImg :src="'https://picsum.photos/seed/' + booth.id + '/1500/300'" cover aspect-ratio="4/1" class="booth-item-image" />
            <div class="booth-item-image-overlay"></div>
          </div>

          <VLayout class="booth-item-info w-100 h-100 pa-3 d-flex flex-row align-end justify-start">
            <VLayout class="d-flex flex-column align-start justify-end">
              <div class="booth-item-name">{{ booth.name }}</div>
              <div class="booth-item-desc">{{ booth.description }}</div>
            </VLayout>
            <div>{{ getBoothOpenStatusString(booth.status.status) }}</div>
          </VLayout>
        </VSheet>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Vue, Component, Model } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { BoothOpenStatus } from "@/types/booth";

@Component({})
export default class BoothSelectionDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  getBoothOpenStatusString = BoothOpenStatus.getBoothOpenStatusString;

  get boothList() {
    return Object.values(useAdminStore().boothList);
  }

  onBoothSelect(boothId: number) {
    useAdminStore().currentBoothId = boothId;
    this.open = false;
  }
}
</script>

<style lang="scss" scoped>
.booth-item {
  cursor: pointer;
  position: relative;
  width: 100%;
  aspect-ratio: 4/1;

  & > * {
    position: relative;
  }

  .booth-item-image-container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;

    .booth-item-image-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .booth-item-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .booth-item-info {
    color: white;
    line-height: 1.125;

    .booth-item-name {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}
</style>

<style lang="scss">
/* Workaround */
.booth-selection-dialog > .v-overlay__content { overflow: initial !important; }
</style>
