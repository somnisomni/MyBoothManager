<template>
  <VSheet v-ripple
          class="order-item d-flex flex-row align-center border-md w-100"
          :class="{ 'border-s-0': !smAndUp, 'border-e-0': !smAndUp }"
          @click.stop="onItemClick">
    <div v-if="smAndUp" class="status-area position-relative overflow-hidden">
      <VIcon class="icon position-absolute"
             :class="statusIcon.class"
             :icon="statusIcon.icon"
             :color="statusIcon.color" />
    </div>

    <div class="flex-grow-1 pa-2 border-s-sm">
      <div class="text-h6 text-sm-h5">
        <VIcon v-if="!smAndUp"
               :icon="statusIcon.icon"
               :color="statusIcon.color"
               class="mr-2" />
        <span v-if="orderData.createdAt"><strong>{{ createdTimeString }}</strong> <small class="d-inline-block">{{ createdDateString }}</small></span>
      </div>
      <div class="text-sm-h6">판매 금액: <strong>{{ totalPriceFormatted }}</strong></div>
      <div class="text-body-2 text-sm-body-1">굿즈 총 <strong>{{ totalItemCount }}종</strong> / 재고 총 <strong>{{ totalStockQuantity }}개</strong> 판매</div>
    </div>

    <div class="px-2">
      <VIcon>mdi-chevron-right</VIcon>
    </div>
  </VSheet>
</template>

<script lang="ts">
import { GoodsOrderStatus, type IGoodsOrder } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { unref } from "vue";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class GoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) orderData!: IGoodsOrder;

  get statusIcon(): { icon: string; color: string; class: string } {
    switch(this.orderData.status) {
      case GoodsOrderStatus.RECORDED:
        return {
          icon: "mdi-check",
          color: "green",
          class: "",
        };
      case GoodsOrderStatus.CANCELED:
        return {
          icon: "mdi-undo-variant",
          color: "pink-lighten-2",
          class: "small",
        };
      default:
        return {
          icon: "mdi-help",
          color: "grey-lighten-2",
          class: "small",
        };
    }
  }

  get smAndUp(): boolean {
    return unref(useDisplay().smAndUp);
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get createdTimeString(): string | undefined {
    return new Date(this.orderData.createdAt as Date).toLocaleTimeString();
  }

  get createdDateString(): string | undefined {
    return new Date(this.orderData.createdAt as Date).toLocaleDateString();
  }

  get totalPriceFormatted(): string {
    return `${this.currencySymbol}${this.orderData.totalPrice.toLocaleString()}`;
  }

  get totalStockQuantity(): number {
    return this.orderData.order.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  get totalItemCount(): number {
    return this.orderData.order.length;
  }

  @Emit("click")
  onItemClick() {
    return this.orderData;
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  --order-item-height: 120px;
  height: var(--order-item-height);
  cursor: pointer;

  .status-area {
    display: flex;
    align-items: center;
    width: calc(var(--order-item-height) - var(--order-item-height) / 4);
    height: var(--order-item-height);

    .icon {
      font-size: var(--order-item-height);
      right: calc(var(--order-item-height) / -4);

      &.small {
        font-size: calc(var(--order-item-height) - 20px);
        right: calc(var(--order-item-height) / -4 + 10px);
      }
    }
  }
}
</style>
