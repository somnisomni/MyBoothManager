<template>
  <div>
    <VSheet v-for="booth in boothListNormalized"
         :key="booth.id"
         v-ripple
         class="booth-item py-2 px-4"
         @click.stop="() => onBoothItemClick(booth.id)">
      {{ booth.name }}
    </VSheet>
  </div>
</template>

<script lang="ts">
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["boothItemClick"],
})
export default class BoothListView extends Vue {
  @Prop({ type: Object, required: true }) boothList!: Array<IBooth>;

  get boothListNormalized() {
    // Don't list closed booths in the booth list view
    return this.boothList.filter((booth) => booth.status !== BoothStatus.CLOSE);
  }

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
