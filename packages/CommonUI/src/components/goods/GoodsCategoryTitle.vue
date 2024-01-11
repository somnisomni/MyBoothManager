<template>
  <div class="goods-category-title no-selection d-flex flex-row align-center mx-2 mb-2 text-2xl font-bold"
       :class="{ 'edit': editable }">
    <VBtn v-if="editable"
          class="d-flex flex-row flex-0-0 align-center justify-start text-left px-2"
          variant="text"
          size="large"
          @click.stop="onTitleClick"
          @pointerenter="hasPointerEntered = true"
          @pointerleave="hasPointerEntered = false">

      <h2 class="d-inline-block">{{ categoryData.name }}</h2>

      <VSlideXTransition>
        <VIcon v-if="editable" v-show="hasPointerEntered" class="ml-2">mdi-pencil</VIcon>
      </VSlideXTransition>
    </VBtn>
    <h2 v-else class="no-interaction d-inline-block flex-0-0 max-w-100 px-2">{{ categoryData.name }}</h2>

    <VDivider class="ml-2" />
  </div>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["click", "editRequest"],
})
export default class GoodsCategoryTitle extends Vue {
  @Prop({ type: Object, required: true }) categoryData!: IGoodsCategory;
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  hasPointerEntered = false;

  @Emit("click")
  onTitleClick() {
    if(this.editable) this.$emit("editRequest", this.categoryData.id);
    return this.categoryData.id;
  }
}
</script>

<style lang="scss">
.goods-category-title {
  .v-btn {
    height: auto;
    min-height: calc(var(--v-btn-height));

    &__content {
      max-width: 100%;
      white-space: pre-wrap;
    }
  }
}
</style>
