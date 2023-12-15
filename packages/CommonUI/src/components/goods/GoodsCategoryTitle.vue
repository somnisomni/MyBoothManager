<template>
  <div class="goods-category-title no-selection text-2xl font-bold ml-2"
       :class="{ 'edit': editable }">
    <VBtn v-if="editable"
          class="d-flex flex-row align-center justify-start text-left pl-2"
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
    <h2 v-else class="no-interaction d-inline-block max-w-100 pl-2">{{ categoryData.name }}</h2>
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
    &__content {
      max-width: 100%;
      white-space: pre-wrap;
    }
  }
}
</style>
