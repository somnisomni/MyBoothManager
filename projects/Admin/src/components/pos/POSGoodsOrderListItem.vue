<template>
  <VImg class="order-item"
        :src="currentGoodsImageUrl"
        v-ripple
        cover
        :height="singleLine ? '48px' : '72px'"
        @click.stop="onOrderItemClick">
    <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.75)">
      <div class="d-flex flex-grow-1 flex-shrink-1" style="min-width: 0;"
           :class="{ 'flex-column': !singleLine, 'flex-row': singleLine }">
        <div class="overflow-hidden text-body-1 font-weight-bold mr-2" style="text-overflow: ellipsis">{{ boothGoodsDict[item.goodsId].name }}</div>
        <div class="text-body-2 d-flex flex-row align-center"
             :style="{ 'font-size': singleLine ? '80% !important' : '' }">
          <span><strong>{{ item.quantity }} 개</strong> · {{ calculatedGoodsPriceString }}</span>

          <!-- Free gift indicator -->
          <span v-if="calculatedGoodsPrice === 0" class="ml-2">
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
        <VBtn icon="mdi-plus" variant="text" size="small" @click.stop="onOrderQuantityChangeRequest(item.goodsId, 1)" />
        <VBtn icon="mdi-minus" variant="text" size="small" @click.stop="onOrderQuantityChangeRequest(item.goodsId, -1)" />
      </div>
    </VLayout>
  </VImg>
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import type { IGoods } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";

@Component({
  emits: ["quantityChange", "click"],
})
export default class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) item!: IGoodsOrderInternal;
  @Prop({ type: Boolean, default: false }) singleLine!: boolean;

  showAdvancedDialog: boolean = false;

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get currentGoods(): IGoods {
    return this.boothGoodsDict[this.item.goodsId];
  }

  get currentGoodsImageUrl(): string {
    return getUploadFilePath(this.currentGoods.goodsImageUrl) ?? `https://picsum.photos/seed/${this.currentGoods.id}/200/250`;
  }

  get calculatedGoodsPrice(): number {
    return (this.item.price ?? this.boothGoodsDict[this.item.goodsId].price) * this.item.quantity;
  }

  get calculatedGoodsPriceString(): string {
    return `${this.currencySymbol}${this.calculatedGoodsPrice.toLocaleString()}`;
  }

  @Emit("quantityChange")
  onOrderQuantityChangeRequest(goodsId: number, delta: number) {
    return { goodsId, delta };
  }

  @Emit("click")
  onOrderItemClick(): IGoodsOrderInternal {
    this.showAdvancedDialog = true;
    return this.item;
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
