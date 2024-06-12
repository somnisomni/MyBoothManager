<template>
  <VSheet :key="boothData.id"
          v-ripple
          class="booth-item d-flex flex-row rounded-lg overflow-hidden"
          :class="{ 'hover': isPointerHovering }"
          :elevation="elevation"
          @pointerenter="isPointerHovering = true"
          @pointerleave="isPointerHovering = false"
          @click.stop="$emit('click', boothData.id)">
    <!-- *** Banner image *** -->
    <VImg class="booth-item-image flex-0-0 no-interaction-all"
          :src="bannerImageUrl"
          :lazy-src="bannerImageThumbnail"
          cover />
    <div class="booth-item-image-overlay"></div>

    <!-- *** Bottom info area *** -->
    <VLayout class="booth-info flex-grow-1 d-flex flex-row justify-start align-center align-self-end pa-3">
      <div class="flex-grow-1 overflow-hidden">
        <div class="name text-body-1 font-weight-bold" :title="boothData.name">{{ boothData.name }}</div>
        <div v-if="boothData.description" class="description text-body-2 font-weight-light" :title="boothData.description">{{ boothData.description }}</div>
      </div>

      <div v-if="shouldShowExtraInfo"
           class="d-inline-flex flex-row justify-end align-center h-100 flex-shrink-0 overflow-hidden pl-2"
           style="max-width: 6em">
        <div class="d-inline-flex flex-column justify-center align-center w-100">
          <div v-if="boothData.boothNumber"
              class="font-weight-bold"
              title="부스 번호">
            <VTooltip activator="parent"
                      location="bottom"
                      transition="fade-transition">부스 번호</VTooltip>

            <span class="booth-number">{{ boothData.boothNumber }}</span>
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
import { getUploadFileUrl } from "#imports";

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

  get bannerImageThumbnail() {
    return this.boothData.bannerImage?.thumbnailData;
  }

  get shouldShowExtraInfo(): boolean {
    return !!this.boothData.boothNumber || this.boothData.status.status !== BoothStatus.OPEN;
  }

  get shouldShowExtraInfoDivider(): boolean {
    return !!this.boothData.boothNumber && this.boothData.status.status !== BoothStatus.OPEN;
  }
}
</script>

<style lang="scss">
.booth-item {
  --booth-item-width: 300px;
  --booth-item-height: 200px;
  width: var(--booth-item-width);
  height: var(--booth-item-height);

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.33s,
              transform 0.33s cubic-bezier(0, 0, 0, 1);
  will-change: transform;

  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;

  background-color: black;

  &.hover:not(:active) {
    transform: translateY(-2.5%);
  }

  .booth-info {
    max-height: calc(var(--booth-item-height) / 2);
    color: white;

    @mixin text($line-clamp: 2) {
      display: -webkit-box;
      display:    -moz-box;
      display:         box;
      -webkit-line-clamp: $line-clamp;
         -moz-line-clamp: $line-clamp;
              line-clamp: $line-clamp;
      -webkit-box-orient: vertical;
         -moz-box-orient: vertical;
              box-orient: vertical;

      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }

    .name {
      @include text(1);
    }

    .description {
      @include text(2);
    }

    .booth-number {
      font-size: 1.25em;
    }
  }
}

.booth-item-image {
    @mixin absolute-fill {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    @include absolute-fill;

    &-overlay {
      @include absolute-fill;
      background: linear-gradient(transparent 33%, rgba(0, 0, 0, 0.85));
    }
}
</style>
