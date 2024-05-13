<template>
  <GoodsItem ref="base"
             class="public">
    <template #extra-top-indicator>
      <!-- Out of stock indicator -->
      <div v-if="isOutOfStock" class="top-indicator out-of-stock bg-error">
        <span>품 절</span>
      </div>
    </template>
  </GoodsItem>
</template>

<script lang="ts">
import type { GoodsItem, GoodsItemProps } from "@myboothmanager/common-ui";
import { Component, Vue, Ref } from "vue-facing-decorator";

@Component({})
export default class GoodsItemPublic extends Vue {
  @Ref("base")
  readonly baseComponent!: GoodsItem;

  get baseProps(): GoodsItemProps {
    return this.baseComponent?.$props as GoodsItemProps;
  }

  get isOutOfStock(): boolean {
    return this.baseProps?.normalizedData.stockRemaining <= 0;
  }
}
</script>
