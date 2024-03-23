<template>
  <GoodsItem ref="base"
             class="selectable"
             :class="{ 'selected': selected }"
             hideDetails
             forceSize="small"
             @click="selected = !selected">
    <template #extra-top-indicator>
      <div v-if="selected" class="top-indicator selected bg-success">
        <VIcon class="mr-1"
               icon="mdi-check" />
        <span>선택됨</span>
      </div>
    </template>
  </GoodsItem>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class GoodsItemSelectable extends Vue {
  @Model({ type: Boolean, default: false }) selected!: boolean;
}
</script>
