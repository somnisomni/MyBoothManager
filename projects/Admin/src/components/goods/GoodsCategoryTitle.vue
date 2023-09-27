<template>
  <VBtn class="d-flex flex-row align-center justify-start text-left text-2xl mb-4 pl-2"
        variant="text"
        size="large"
        @click.stop="onTitleClick"
        @pointerenter="hasPointerEntered = true"
        @pointerleave="hasPointerEntered = false">

    <h2 class="font-bold">{{ categoryData.name }}</h2>

    <VFadeTransition>
      <VIcon v-show="hasPointerEntered" class="ml-2">mdi-pencil</VIcon>
    </VFadeTransition>
  </VBtn>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class GoodsCategoryTitle extends Vue {
  @Prop({ type: String, required: true }) categoryData!: IGoodsCategory;

  hasPointerEntered = false;

  @Emit("openEditDialog")
  onTitleClick() {
    return this.categoryData.id;
  }
}
</script>
