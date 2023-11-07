<template>
  <VImg class="order-item"
        :src="'https://picsum.photos/seed/' + item.goodsId + '/200/250'"
        v-ripple
        cover
        height="72px"
        @click.stop="onOrderItemClick">
    <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.66)">
      <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="min-width: 0;">
        <div class="text-body-1 font-weight-bold">{{ boothGoodsDict[item.goodsId].name }}</div>
        <div class="text-body-2 d-flex flex-row align-center">
          <span><strong>{{ item.quantity }} 개</strong> · {{ calculatedGoodsPriceString }}</span>

          <!-- Free gift indicator -->
          <span v-if="calculatedGoodsPrice === 0" class="ml-2">
            <VTooltip activator="parent" location="bottom">무료 증정</VTooltip>
            <VIcon size="x-small">mdi-gift</VIcon>
          </span>

          <!-- Edited indicator -->
          <span v-else-if="item.price" class="ml-2">
            <VTooltip activator="parent" location="bottom">별도 지정 단가 적용</VTooltip>
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

@Component({
  emits: ["quantityChange", "click"],
})
export default class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) item!: IGoodsOrderInternal;
  @Prop({ type: String, required: true }) currencySymbol!: string;

  showAdvancedDialog: boolean = false;

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  get currentGoods(): IGoods {
    return this.boothGoodsDict[this.item.goodsId];
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
