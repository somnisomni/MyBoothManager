<template>
  <div>
    <VSheet v-for="booth in boothList"
         :key="booth.id"
         v-ripple
         class="booth-item py-2 px-4"
         @click.stop="() => onBoothItemClick(booth.id)">
      {{ booth.name }}
    </VSheet>
  </div>
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["boothItemClick"],
})
export default class BoothListView extends Vue {
  @Prop({ type: Object, required: true }) boothList!: Array<IBooth>;

  @Emit("boothItemClick")
  onBoothItemClick(boothId: number) {
    return boothId;
  }
}
</script>

<style lang="scss" scoped>
.booth-item {
  cursor: pointer;
}
</style>
