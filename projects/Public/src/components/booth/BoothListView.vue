<template>
  <VLayout class="d-flex flex-row flex-wrap overflow-visible">
    <div v-if="!boothList || boothList.length < 0" class="d-inline-flex align-center text-disabled my-2">
      <VIcon class="mr-1">mdi-information-outline</VIcon> 부스가 없습니다.
    </div>

    <BoothListItem v-for="booth in boothList"
                   :key="booth.id"
                   :boothData="booth"
                   class="ma-2"
                   @click="onBoothItemClick" />
  </VLayout>
</template>

<script lang="ts">
import { type IBooth } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import BoothListItem from "./BoothListItem.vue";

@Component({
  components: {
    BoothListItem,
  },
  emits: ["click:boothItem"],
})
export default class BoothListView extends Vue {
  @Prop({ type: Array, required: true }) boothList!: Array<IBooth>;

  @Emit("click:boothItem")
  onBoothItemClick(boothId: number) {
    return boothId;
  }
}
</script>
