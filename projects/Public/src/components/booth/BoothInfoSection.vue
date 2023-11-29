<template>
  <VSheet class="booth-info-section">
    <VParallax class="booth-image" :src="'https://picsum.photos/seed/' + boothData.id + '/800/400'">
      <div class="booth-image-overlay"></div>

      <VLayout class="booth-info-content w-100 h-100 d-flex flex-column justify-end pa-2">
        <h3>이름: {{ boothData?.name }}</h3>
        <div v-if="boothData?.description">설명: {{ boothData?.description }}</div>
        <div>위치: {{ boothData?.location }}</div>
        <div>현재 운영 상태: {{ boothData?.status }}</div>
      </VLayout>
    </VParallax>
  </VSheet>
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class BoothInfoSection extends Vue {
  @Prop({ type: Object, required: true }) boothData!: IBooth;
}
</script>

<style lang="scss" scoped>
.booth-info-section {
  --booth-info-section-height: 300px;

  position: relative;
  width: 100%;
  height: var(--booth-info-section-height);

  .booth-image {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .booth-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.33) 33%, rgba(0, 0, 0, 1));
  }

  .booth-info-content {
    color: white;
    z-index: 1;
  }
}
</style>
