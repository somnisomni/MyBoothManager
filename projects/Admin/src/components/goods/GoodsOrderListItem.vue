<template>
  <VSheet v-ripple
          class="order-item d-flex flex-row align-center border-md w-100"
          :class="{ 'border-s-0': !smAndUp, 'border-e-0': !smAndUp, 'canceled': orderData.status === GoodsOrderStatus.CANCELED }"
          @click.stop="onItemClick">
    <div v-if="smAndUp"
         class="status-area position-relative overflow-hidden">
      <VIcon class="icon position-absolute"
             :class="statusIcon.class"
             :icon="statusIcon.icon"
             :color="statusIcon.color" />
    </div>

    <div class="flex-grow-1 pa-2 border-s-sm">
      <div class="mb-2 text-h6 text-sm-h5"
           style="line-height: 1em;">
        <VIcon v-if="!smAndUp"
               :icon="statusIcon.icon"
               :color="statusIcon.color"
               class="mr-2" />
        <span v-if="orderData.createdAt"><strong>{{ createdTimeHourMinuteString }}<small>{{ createdTimeSecondsString }}</small></strong> <small class="d-inline-block ml-2">{{ createdDateString }}</small></span>
      </div>
      <div class="d-flex flex-row align-center text-sm-h6"
           :class="[`text-${statusIcon.textColor}`]">
        <VIcon class="mr-2"
               :icon="paymentMethodIcon" /> <strong>{{ totalRevenueFormatted }}</strong>
      </div>
      <div class="text-subtitle-2 text-sm-body-1">
        <span v-if="totalCombinationItemCount > 0">세트 <strong>{{ totalCombinationItemCount.toLocaleString() }}종</strong> / </span>
        <span>굿즈 <strong>{{ totalGoodsItemCount.toLocaleString() }}종</strong> / </span>
        <span>총 재고 <strong>{{ totalStockQuantity.toLocaleString() }}개</strong> 판매</span>
      </div>
    </div>

    <div class="d-flex align-center px-2">
      <span class="mr-1 text-disabled text-subtitle-2">#{{ orderData.id }}</span>
      <VIcon icon="mdi-chevron-right" />
    </div>
  </VSheet>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { GoodsOrderPaymentMethod, GoodsOrderStatus } from "@myboothmanager/common";
import { Component, Emit, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { getPaymentMethodIcon } from "@/lib/enum-to-string";
import { useAdminStore } from "@/plugins/stores/admin";

@Component({
  emits: [ "click" ],
})
class GoodsOrderListItem extends Vue {
  readonly GoodsOrderStatus = GoodsOrderStatus;

  @Prop({ type: Object, required: true }) declare readonly orderData: IGoodsOrder;

  @Setup(() => useDisplay().smAndUp)
  declare readonly smAndUp: boolean;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  get statusIcon(): { icon: string; color: string; textColor: string; class: string } {
    switch(this.orderData.status) {
      case GoodsOrderStatus.RECORDED:
        return {
          icon: "mdi-check",
          color: "green",
          textColor: "green-darken-2",
          class: "",
        };
      case GoodsOrderStatus.CANCELED:
        return {
          icon: "mdi-undo-variant",
          color: "pink-lighten-2",
          textColor: "pink",
          class: "small",
        };
      default:
        return {
          icon: "mdi-help",
          color: "grey-lighten-2",
          textColor: "grey",
          class: "small",
        };
    }
  }

  get paymentMethodIcon(): string {
    return getPaymentMethodIcon(this.orderData.paymentMethod ?? GoodsOrderPaymentMethod.CASH);
  }

  get createdTime(): Date | null {
    if(!this.orderData.createdAt) {
      return null;
    }

    return new Date(this.orderData.createdAt);
  }

  get createdTimeHourMinuteString(): string | undefined {
    return this.createdTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  get createdTimeSecondsString(): string | undefined {
    return `:${this.createdTime?.toLocaleTimeString([], { second: "2-digit" }).padStart(2, "0")}`;
  }

  get createdDateString(): string | null {
    if(!this.orderData.createdAt) {
      return null;
    }

    return new Date(this.orderData.createdAt).toLocaleDateString();
  }

  get totalRevenueFormatted(): string {
    return `${this.currencySymbol}${this.orderData.totalRevenue.toLocaleString()}`;
  }

  get totalStockQuantity(): number {
    return this.orderData.order.reduce((acc, cur) => {
      let quantity = cur.quantity;
      if(cur.cId && cur.combinedGoods) {
        quantity = cur.combinedGoods?.length * cur.quantity;
      }

      return acc + quantity;
    }, 0);
  }

  get totalGoodsItemCount(): number {
    return this.orderData.order.filter(order => order.gId).length;
  }

  get totalCombinationItemCount(): number {
    return this.orderData.order.filter(order => order.cId).length;
  }

  @Emit("click")
  onItemClick(): IGoodsOrder {
    return this.orderData;
  }
}

export default toNative(GoodsOrderListItem);
</script>

<style lang="scss" scoped>
.order-item {
  --order-item-height: 120px;
  height: var(--order-item-height);
  cursor: pointer;

  &.canceled > * {
    opacity: 0.5 !important;
  }

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
