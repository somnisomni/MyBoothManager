<template>
  <VImg class="order-item"
        :src="currentTargetImageUrl"
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
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import type { IGoods, IGoodsCombination } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";

@Component({
  emits: ["quantityChange", "click"],
})
export default class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) item!: IGoodsOrderInternal;
  @Prop({ type: Boolean, default: undefined }) isCombination?: true;
  @Prop({ type: Boolean, default: false }) singleLine!: boolean;

  showAdvancedDialog: boolean = false;

  get boothGoodsDict(): Record<number, IGoods> { return useAdminStore().boothGoodsList; }
  get boothGoodsCombinationDict(): Record<number, IGoodsCombination> { return useAdminStore().boothGoodsCombinationList; }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get currentTarget(): IGoods | IGoodsCombination {
    return this.isCombination
      ? this.boothGoodsCombinationDict[this.item.id]
      : this.boothGoodsDict[this.item.id];
  }

  get currentTargetImageUrl(): string {
    return getUploadFilePath(this.isCombination
      ? this.boothGoodsCombinationDict[this.item.id].combinationImageUrl
      : this.boothGoodsDict[this.item.id].goodsImageUrl,
    ) ?? `https://picsum.photos/seed/${this.currentTarget.id}/200/250`;
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
