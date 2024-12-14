<template>
  <GoodsItem ref="base"
             class="public">
    <template #extra-top-indicator>
      <!-- Out of stock indicator -->
      <div v-if="isMounted && !shouldHideStock && isOutOfStock"
           class="top-indicator out-of-stock bg-error">
        <span>품 절</span>
      </div>
    </template>
  </GoodsItem>
</template>

<script lang="ts">
import type { GoodsItem } from "@myboothmanager/common-ui";
import { GoodsStockVisibility } from "@myboothmanager/common";
import { Vue, Ref } from "vue-facing-decorator";

@NuxtComponent({})
export default class GoodsItemPublic extends Vue {
  isMounted: boolean = false;

  @Ref("base")
  declare readonly baseComponent: GoodsItem;

  get isOutOfStock(): boolean {
    return (this.baseComponent.normalizedData.stock.remaining ?? -1) <= 0;
  }

  get shouldHideStock(): boolean {
    return this.baseComponent.normalizedData.stock.visibility === GoodsStockVisibility.HIDE_ALL;
  }

  mounted(): void {
    this.isMounted = true;
  }
}
</script>
