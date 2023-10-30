<template>
  <VImg class="order-item" :src="'https://picsum.photos/seed/' + item.goodsId + '/200/250'" cover height="72px">
    <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.66)">
      <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="min-width: 0;">
        <span class="text-body-1 font-weight-bold">{{ boothGoodsDict[item.goodsId].name }}</span>
        <span class="text-body-2"><strong>{{ item.quantity }} 개</strong> · {{ calculateGoodsPrice(item.goodsId, item.quantity) }}</span>
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

@Component({})
export default class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) item!: IGoodsOrderInternal;
  @Prop({ type: String, required: true }) currencySymbol!: string;

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  calculateGoodsPrice(goodsId: number, quantity: number): string {
    return `${this.currencySymbol}${(this.boothGoodsDict[goodsId].price * quantity).toLocaleString()}`;
  }

  @Emit("quantityChange")
  onOrderQuantityChangeRequest(goodsId: number, delta: number) {
    return { goodsId, delta };
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  & * {
    white-space: nowrap;

    & span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
