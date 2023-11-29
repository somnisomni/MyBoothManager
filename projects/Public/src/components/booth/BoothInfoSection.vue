<template>
  <VSheet class="w-100">
    <div>이름: {{ boothData?.name }}</div>
    <div v-if="boothData?.description">설명: {{ boothData?.description }}</div>
    <div>위치: {{ boothData?.location }}</div>
    <div>현재 운영 상태: {{ boothData?.status }}</div>
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
