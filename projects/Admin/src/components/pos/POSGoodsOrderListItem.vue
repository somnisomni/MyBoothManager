<template>
  <VImg class="order-item"
        :src="currentTargetImageUrl ?? undefined"
        v-ripple
        cover
        :height="singleLine ? '48px' : '72px'"
        @click.stop="onOrderItemClick">
    <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.75)">
      <div class="d-flex flex-grow-1 flex-shrink-1" style="min-width: 0;"
           :class="{ 'flex-column': !singleLine, 'flex-row': singleLine }">
        <div class="overflow-hidden text-body-1 font-weight-bold mr-2" style="text-overflow: ellipsis">
          <VIcon v-if="isCombination" size="x-small" class="mr-1">mdi-set-all</VIcon>
          <span>{{ currentTarget.name }}</span>
        </div>
        <div class="text-body-2 d-flex flex-row align-center"
             :style="{ 'font-size': singleLine ? '80% !important' : '' }">
          <span><strong>{{ item.quantity }} 개</strong> · {{ calculatedTargetPriceString }}</span>

          <!-- Free gift indicator -->
          <span v-if="calculatedTargetPrice === 0" class="ml-2">
            <VTooltip activator="parent" location="bottom">무료 증정</VTooltip>
            <VIcon size="x-small">mdi-gift</VIcon>
          </span>

          <!-- Edited indicator -->
          <span v-else-if="item.price" class="ml-2">
            <VTooltip activator="parent" location="bottom">지정 단가 적용</VTooltip>
            <VIcon size="x-small">mdi-pencil</VIcon>
          </span>
        </div>
      </div>

      <div>
        <VBtn icon="mdi-plus" variant="text" size="small" @click.stop="onOrderQuantityChangeRequest(item.id, 1, isCombination)" />
        <VBtn icon="mdi-minus" variant="text" size="small" @click.stop="onOrderQuantityChangeRequest(item.id, -1, isCombination)" />
      </div>
    </VLayout>
  </VImg>
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/pages/subpages/POSPage.lib";
import type { IGoods, IGoodsCombination } from "@myboothmanager/common";
import { Component, Emit, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { getUploadFileUrl } from "@/lib/functions";

@Component({
  emits: ["quantityChange", "click"],
})
class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) declare readonly item: IGoodsOrderInternal;
  @Prop({ type: Boolean, default: undefined }) declare readonly isCombination?: true;
  @Prop({ type: Boolean, default: false }) declare readonly singleLine: boolean;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  @Setup(() => useAdminStore().currentBooth.goods)
  declare readonly boothGoods: Record<number, IGoods>;

  @Setup(() => useAdminStore().currentBooth.goodsCombinations)
  declare readonly boothGoodsCombinations: Record<number, IGoodsCombination>;

  showAdvancedDialog: boolean = false;

  get currentTarget(): IGoods | IGoodsCombination {
    return this.isCombination
      ? this.boothGoodsCombinations[this.item.id]
      : this.boothGoods[this.item.id];
  }

  get currentTargetImageUrl() {
    return getUploadFileUrl(this.isCombination
      ? this.boothGoodsCombinations[this.item.id].goodsImage?.path
      : this.boothGoods[this.item.id].goodsImage?.path,
    );
  }

  get calculatedTargetPrice(): number {
    return (this.item.price ?? this.currentTarget.price * this.item.quantity);
  }

  get calculatedTargetPriceString(): string {
    return `${this.currencySymbol}${this.calculatedTargetPrice.toLocaleString()}`;
  }

  @Emit("quantityChange")
  onOrderQuantityChangeRequest(id: number, delta: number, isCombination?: true) {
    return { id, delta, isCombination };
  }

  @Emit("click")
  onOrderItemClick(): IGoodsOrderInternal & { isCombination?: true } {
    this.showAdvancedDialog = true;
    return {
      ...this.item,
      isCombination: this.isCombination,
    };
  }
}

export default toNative(POSGoodsOrderListItem);
</script>

<style lang="scss" scoped>
.order-item {
  cursor: pointer;

  & * {
    white-space: nowrap;

    & span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
