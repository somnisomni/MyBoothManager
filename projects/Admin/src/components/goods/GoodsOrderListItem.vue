<template>
  <VSheet v-ripple
          class="order-item d-flex flex-row align-center border-md w-100"
          :class="{ 'border-s-0': !smAndUp, 'border-e-0': !smAndUp, 'canceled': orderData.status === GoodsOrderStatus.CANCELED }"
          @click.stop="onItemClick">
    <div v-if="smAndUp" class="status-area position-relative overflow-hidden">
      <VIcon class="icon position-absolute"
             :class="statusIcon.class"
             :icon="statusIcon.icon"
             :color="statusIcon.color" />
    </div>

    <div class="flex-grow-1 pa-2 border-s-sm">
      <div class="mb-2 text-h6 text-sm-h5" style="line-height: 1em;">
        <VIcon v-if="!smAndUp"
               :icon="statusIcon.icon"
               :color="statusIcon.color"
               class="mr-2" />
        <span v-if="orderData.createdAt"><strong>{{ createdTimeHourMinuteString }}<small>{{ createdTimeSecondsString }}</small></strong> <small class="d-inline-block ml-2">{{ createdDateString }}</small></span>
      </div>
      <div class="text-sm-h6">판매 금액: <strong>{{ totalPriceFormatted }}</strong></div>
      <div class="text-body-2 text-sm-body-1">굿즈 <strong>{{ totalItemCount.toLocaleString() }}종</strong> / 재고 <strong>{{ totalStockQuantity.toLocaleString() }}개</strong> 판매</div>
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

@Component({
  emits: ["click"],
})
export default class GoodsOrderListItem extends Vue {
  readonly GoodsOrderStatus = GoodsOrderStatus;

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

  get createdTime(): Date | undefined {
    return new Date(this.orderData.createdAt!);
  }

  get createdTimeHourMinuteString(): string | undefined {
    return this.createdTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  get createdTimeSecondsString(): string | undefined {
    return ":" + this.createdTime?.toLocaleTimeString([], { second: "2-digit" }).padStart(2, "0");
  }

  get createdDateString(): string | undefined {
    return new Date(this.orderData.createdAt!).toLocaleDateString();
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
