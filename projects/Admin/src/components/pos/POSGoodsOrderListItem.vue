<template>
  <VImg class="order-item"
        :src="'https://picsum.photos/seed/' + item.goodsId + '/200/250'"
        v-ripple
        cover
        height="72px"
        @click.stop="onOrderItemClick">
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

  <POSGoodsAdvancedDialog v-model="showAdvancedDialog"
                          :goodsId="item.goodsId"
                          :orderData="item"
                          @confirm="onGoodsAdvancedDialogConfirm" />
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import type { IGoods } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import POSGoodsAdvancedDialog from "../dialogs/POSGoodsAdvancedDialog.vue";

@Component({
  components: {
    POSGoodsAdvancedDialog,
  },
  emits: ["quantityChange", "itemClick"],
})
export default class POSGoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) item!: IGoodsOrderInternal;
  @Prop({ type: String, required: true }) currencySymbol!: string;

  showAdvancedDialog: boolean = false;

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  calculateGoodsPrice(goodsId: number, quantity: number): string {
    const singlePrice = this.item.price ?? this.boothGoodsDict[goodsId].price;
    return `${this.currencySymbol}${(singlePrice * quantity).toLocaleString()}`;
  }

  @Emit("itemAdvancedConfirm")
  onGoodsAdvancedDialogConfirm(newOrderData: IGoodsOrderInternal) {
    return newOrderData;
  }

  @Emit("quantityChange")
  onOrderQuantityChangeRequest(goodsId: number, delta: number) {
    return { goodsId, delta };
  }

  @Emit("itemClick")
  onOrderItemClick() {
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
