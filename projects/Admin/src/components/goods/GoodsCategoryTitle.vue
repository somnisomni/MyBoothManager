<template>
  <VBtn class="goods-category-title d-flex flex-row align-center justify-start text-left text-2xl pl-2"
        variant="text"
        size="large"
        :class="{ 'edit': editable }"
        @click.stop="onTitleClick"
        @pointerenter="hasPointerEntered = true"
        @pointerleave="hasPointerEntered = false">

    <h2 class="font-bold">{{ categoryData.name }}</h2>

    <VSlideXTransition>
      <VIcon v-if="editable" v-show="hasPointerEntered" class="ml-2">mdi-pencil</VIcon>
    </VSlideXTransition>
  </VBtn>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["click", "openEditDialog"],
})
export default class GoodsCategoryTitle extends Vue {
  @Prop({ type: String, required: true }) categoryData!: IGoodsCategory;
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  hasPointerEntered = false;

  @Emit("click")
  onTitleClick() {
    if(this.editable) this.$emit("openEditDialog", this.categoryData.id);
    return this.categoryData.id;
  }
}
</script>

<style lang="scss" scoped>
.goods-category-title {
  &:not(.edit) {
    pointer-events: none;
  }
}
</style>
