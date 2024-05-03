<template>
  <VSheet :key="boothData.id"
          v-ripple
          class="booth-item d-flex flex-column rounded-lg overflow-hidden"
          :class="{ 'hover': isPointerHovering }"
          width="250px"
          height="180px"
          :elevation="elevation"
          @pointerenter="isPointerHovering = true"
          @pointerleave="isPointerHovering = false"
          @click.stop="$emit('click', boothData.id)">
    <VImg :src="bannerImageUrl"
          height="100px"
          aspect-ratio="3/1"
          cover
          class="flex-0-0 no-interaction-all" />

    <VLayout class="flex-grow-1 d-flex flex-row justify-start pa-2">
      <div class="flex-grow-1 overflow-hidden">
        <div class="text-body-1 font-weight-bold" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" :title="boothData.name">{{ boothData.name }}</div>
        <div v-if="boothData.description" class="text-body-2 font-weight-light" style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; text-overflow: ellipsis;" :title="boothData.description">{{ boothData.description }}</div>
      </div>

      <div v-if="shouldShowExtraInfo" class="d-inline-flex flex-row justify-end align-center h-100 flex-shrink-0">
        <VDivider vertical class="mx-2" />

        <div class="d-inline-flex flex-column justify-center align-center" style="max-width: 4em">
          <div v-if="boothData.boothNumber" class="font-weight-medium" style="max-width: 4em" title="부스 번호">
            <VTooltip activator="parent" location="bottom" transition="fade-transition">부스 번호</VTooltip>

            <span>{{ boothData.boothNumber }}</span>
          </div>

          <div v-if="boothData.status.status !== BoothStatus.OPEN">
            <VTooltip activator="parent" location="bottom" transition="fade-transition">
              <span      v-if="boothData.status.status === BoothStatus.PAUSE">운영 일시 중지 중</span>
              <span v-else-if="boothData.status.status === BoothStatus.PREPARE">운영 준비 중</span>
            </VTooltip>

            <VIcon v-if="boothData.status.status === BoothStatus.PAUSE"   size="x-small" icon="mdi-pause-circle-outline" />
            <VIcon v-if="boothData.status.status === BoothStatus.PREPARE" size="x-small" icon="mdi-store-cog" />
          </div>
        </div>
      </div>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";
import { getUploadFileUrl } from "@/lib/common-functions";

@Component({
  emits: ["click"],
})
export default class BoothListItem extends Vue {
  readonly BoothStatus = BoothStatus;

  @Prop({ type: Object, required: true }) boothData!: IBooth;

  isPointerHovering = false;
  readonly ELEVATION_NORMAL = 2;
  readonly ELEVATION_HOVER  = 6;

  get elevation() {
    return this.isPointerHovering ? this.ELEVATION_HOVER : this.ELEVATION_NORMAL;
  }

  get bannerImageUrl() {
    return getUploadFileUrl(this.boothData.bannerImage?.path)
      ?? `https://picsum.photos/seed/${this.boothData.id}/800/400`;
  }

  get shouldShowExtraInfo(): boolean {
    return !!this.boothData.boothNumber || this.boothData.status.status !== BoothStatus.OPEN;
  }

  get shouldShowExtraInfoDivider(): boolean {
    return !!this.boothData.boothNumber && this.boothData.status.status !== BoothStatus.OPEN;
  }
}
</script>

<style lang="scss" scoped>
.booth-item {
  cursor: pointer;
  transition: box-shadow 0.33s, transform 0.33s cubic-bezier(0, 0, 0, 1);

  &.hover:not(:active) {
    transform: translateY(-2.5%);
  }
}
</style>
