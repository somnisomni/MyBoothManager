<template>
  <div class="goods-category-title no-selection d-flex flex-row align-center mx-2 mb-2 text-2xl font-bold">
    <slot name="text"
          :categoryData="categoryData">
      <h2 class="no-interaction d-inline-block flex-0-0 max-w-100 px-2">{{ categoryData.name }}</h2>
    </slot>

    <VDivider class="ml-2" />
  </div>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";

@Component({})
class GoodsCategoryTitle extends Vue {
  @Prop({ type: Object, required: true }) readonly categoryData!: IGoodsCategory;
}

export default toNative(GoodsCategoryTitle);
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
