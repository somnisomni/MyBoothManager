<template>
  <GoodsItem ref="base"
             class="public">
    <template #extra-top-indicator>
      <!-- Out of stock indicator -->
      <div v-if="isMounted && !shouldHideStock && isOutOfStock" class="top-indicator out-of-stock bg-error">
        <span>품 절</span>
      </div>
    </template>
  </GoodsItem>
</template>

<script lang="ts">
import type { GoodsItem } from "@myboothmanager/common-ui";
import { GoodsStockVisibility } from "@myboothmanager/common";
import { Component, Vue, Ref } from "vue-facing-decorator";

@Component({})
export default class GoodsItemPublic extends Vue {
  isMounted: boolean = false;

  @Ref("base")
  readonly baseComponent!: GoodsItem;

  get isOutOfStock(): boolean {
    return this.baseComponent.normalizedData.stockRemaining <= 0;
  }

  get shouldHideStock(): boolean {
    return this.baseComponent.normalizedData.stockVisibility === GoodsStockVisibility.HIDE_ALL;
  }

  mounted() {
    this.isMounted = true;
  }
}
</script>
