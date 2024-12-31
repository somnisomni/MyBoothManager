<template>
  <div class="order-drawer bg-background"
       :class="{ 'sm rounded-t-lg elevation-10': sm }"
       :style="{ 'max-height': sm && !smDrawerExpanded ? '60%' : '' }"
       ref="orderDrawer">
    <div v-if="sm" class="sm-handle">
      <VBtn @click.stop="smDrawerExpanded = !smDrawerExpanded"
            variant="text"
            rounded="0"
            size="large"
            class="w-100">
        <VIcon v-if="smDrawerExpanded">mdi-chevron-down</VIcon>
        <VIcon v-else>mdi-chevron-up</VIcon>
      </VBtn>
    </div>

    <VList v-show="!sm" nav class="flex-shrink-0">
      <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }"
                 :density="sm ? 'compact' : 'default'" />
    </VList>

    <div class="inner overflow-hidden d-flex flex-column h-100" style="min-height: 200px">
      <VList v-show="!sm" nav class="flex-shrink-0">
        <VListItem class="text-center">
          <div class="appname text-grey">{{ APP_NAME }}</div>
          <div class="boothname text-darken-2">{{ currentBooth.name }}</div>
          <div class="mt-1 text-h4 font-weight-bold">주문 목록</div>
        </VListItem>
      </VList>

      <!-- Goods & Goods Combination pending list -->
      <POSGoodsOrderListView class="flex-1-1"
                             :orderList="orderSimulationLayer.orderList"
                             :singleLine="sm && !smDrawerExpanded"
                             @click:item="onGoodsOrderItemClick"
                             @request:itemQuantityUpdate="onGoodsOrderQuantityUpdateRequest" />

      <VList nav class="flex-shrink-0 pa-0 pb-2">
        <VListItem v-show="!sm || smDrawerExpanded" class="px-2 py-1">
          <VBtn prepend-icon="mdi-playlist-remove"
                class="w-100"
                variant="text"
                :disabled="isOrderListEmpty || orderCreationInProgress"
                @click="showListResetConfirmDialog = true">목록 초기화</VBtn>
        </VListItem>
        <VListItem class="px-2 py-1">
          <div class="text-body-2 text-center mb-2">총 가격: <strong>{{ totalOrderWorthString }}</strong></div>
          <VBtn prepend-icon="mdi-cart-heart"
                color="primary"
                size="x-large"
                class="w-100"
                :loading="orderCreationInProgress"
                :disabled="isOrderListEmpty || orderCreationInProgress"
                @click="showOrderConfirmDialog = true">판매 등록</VBtn>
        </VListItem>
      </VList>
    </div>
  </div>

  <POSGoodsAdvancedDialog v-model="showOrderAdvancedDialog"
                          :currentOrderSimulationLayer="orderSimulationLayer"
                          :orderData="orderAdvancedDialogOrderData"
                          :isCombination="orderAdvancedDialogOrderIsCombination"
                          @deleteRequest="onOrderItemAdvancedDeleteRequest"
                          @confirm="onOrderItemAdvancedConfirm" />
  <POSListResetConfirmDialog v-model="showListResetConfirmDialog"
                             @confirm="onOrderResetRequest" />
  <POSOrderConfirmDialog v-model="showOrderConfirmDialog"
                         :orders="orderSimulationLayer.orderList"
                         @confirm="onOrderConfirm" />
</template>

<script lang="ts">
import { APP_NAME, type GoodsOrderPaymentMethod, type IGoods, type IGoodsCombination, type IGoodsOrderCreateRequest } from "@myboothmanager/common";
import { Component, Emit, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { type IGoodsOrderInternal, POSOrderSimulationLayer } from "@/pages/subpages/POSPage.lib";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import POSGoodsAdvancedDialog from "../dialogs/POSGoodsAdvancedDialog.vue";
import POSListResetConfirmDialog from "../dialogs/POSListResetConfirmDialog.vue";
import POSOrderConfirmDialog from "../dialogs/POSOrderConfirmDialog.vue";
import POSGoodsOrderListView from "./POSGoodsOrderListView.vue";

@Component({
  components: {
    POSGoodsOrderListView,
    POSGoodsAdvancedDialog,
    POSListResetConfirmDialog,
    POSOrderConfirmDialog,
  },
  emits: [
    "smDrawerHeightChanged",
    "goodsOrderQuantityUpdateRequest",
    "orderCreationStarted",
    "orderCreationSuccess",
    "orderCreationFailed",
    "orderCreationDone",
    "orderListResetRequest",
  ],
})
class POSOrderDrawer extends Vue {
  @Prop({ type: POSOrderSimulationLayer, required: true }) declare readonly orderSimulationLayer: POSOrderSimulationLayer;
  @Prop({ type: Boolean, default: false }) declare readonly sm: boolean;
  @Prop({ type: Number }) declare readonly smDrawerHeight: number;

  @Setup(() => useAdminStore().currentBooth.booth)
  declare readonly currentBooth: NonNullable<ReturnType<typeof useAdminStore>["currentBooth"]["booth"]>;

  @Setup(() => useAdminStore().currentBooth.goods)
  declare readonly currentBoothGoods: ReturnType<typeof useAdminStore>["currentBooth"]["goods"];

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  readonly APP_NAME = APP_NAME;

  smDrawerExpanded: boolean = false;

  orderCreationInProgress: boolean = false;
  showOrderConfirmDialog: boolean = false;
  showListResetConfirmDialog: boolean = false;
  showOrderAdvancedDialog: boolean = false;
  orderAdvancedDialogOrderData: IGoodsOrderInternal | null = null;
  orderAdvancedDialogOrderIsCombination?: boolean;

  get isOrderListEmpty(): boolean {
    return this.orderSimulationLayer.orderList.length() <= 0;
  }

  get totalOrderWorth(): number {
    return this.orderSimulationLayer.orderList.values().reduce(
      (acc, order) => (acc + ((order.price ?? this.getTargetOriginalInfo(order.id, order.what === "combination").price) * order.quantity)), 0);
  }

  get totalOrderWorthString(): string {
    return `${this.currencySymbol}${this.totalOrderWorth.toLocaleString()}`;
  }

  mounted() {
    new ResizeObserver((entries) => {
      this.$emit("smDrawerHeightChanged", entries[0].contentRect.height);
    }).observe(this.$refs.orderDrawer as HTMLElement);
  }

  onGoodsOrderItemClick(item: IGoodsOrderInternal & { isCombination?: true }) {
    this.showOrderAdvancedDialog = true;
    this.orderAdvancedDialogOrderData = item;
    this.orderAdvancedDialogOrderIsCombination = item.isCombination;
  }

  onOrderItemAdvancedConfirm(eventData: { id: number, isCombination?: true, newOrderData: IGoodsOrderInternal }) {
    const targetOrder = this.orderSimulationLayer.orderList.get(eventData.isCombination ? "combination" : "goods", eventData.id);
    Object.assign(targetOrder, {
      ...eventData.newOrderData,
      quantity: this.orderSimulationLayer.orderList.get(eventData.isCombination ? "combination" : "goods", eventData.id).quantity,
    });

    this.onGoodsOrderQuantityUpdateRequest({
      id: eventData.id,
      isCombination: eventData.isCombination,
      delta: eventData.newOrderData.quantity - targetOrder.quantity,
    });
  }

  onOrderItemAdvancedDeleteRequest(eventData: { id: number, isCombination?: true }) {
    this.orderSimulationLayer.deleteSingleTarget(eventData.isCombination ? "combination" : "goods", eventData.id);
  }

  @Emit("orderListResetRequest")
  onOrderResetRequest(): void { }

  getTargetOriginalInfo(id: number, isCombination: boolean): IGoods | IGoodsCombination {
    return isCombination
      ? useAdminStore().currentBooth.goodsCombinations![id]
      : useAdminStore().currentBooth.goods![id];
  }

  async onOrderConfirm(paymentMethod: GoodsOrderPaymentMethod) {
    this.orderCreationInProgress = true;
    this.$emit("orderCreationStarted");

    const data: IGoodsOrderCreateRequest = {
      boothId: this.currentBooth.id,
      totalRevenue: this.totalOrderWorth,
      order: [],
      paymentMethod,
    };

    for(const [, order] of this.orderSimulationLayer.orderList.entries()) {
      const id = order.what === "combination" ? { cId: order.id } : { gId: order.id };

      data.order.push({
        ...id,
        name: this.getTargetOriginalInfo(order.id, order.what === "combination").name,
        price: order.price ?? this.getTargetOriginalInfo(order.id, order.what === "combination").price,
        quantity: order.quantity,
      });
    }

    // API call
    const results = [
      await useAdminAPIStore().createBoothOrder(data),
      await useAdminAPIStore().fetchGoodsOfCurrentBooth(),
      await useAdminAPIStore().fetchGoodsCombinationsOfCurrentBooth(),
    ];
    if(results.every((res) => !!res)) {
      this.$emit("orderCreationSuccess", results[0]);

      // If API call success, request reset the order list
      this.$emit("orderListResetRequest");
    } else {
      this.$emit("orderCreationFailed");
    }

    this.orderCreationInProgress = false;
    this.$emit("orderCreationDone");
  }

  @Emit("goodsOrderQuantityUpdateRequest")
  onGoodsOrderQuantityUpdateRequest(eventData: { id: number, delta: number, isCombination?: true }) {
    return eventData;
  }
}

export default toNative(POSOrderDrawer);
</script>

<style lang="scss" scoped>
.order-drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1010;
  border-right: thin solid #CCC;

  display: flex;
  flex-direction: column;
  width: var(--drawer-width);
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  &.sm {
    width: calc(var(--drawer-width) * 1.5);
    height: fit-content;
    max-height: 95%;
    top: unset;
    right: 0;
    margin: 0 1rem 0 auto;

    @media screen and (max-width: 600px) {
      margin: 0 auto;
    }
  }

  .appname {
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.125rem;
    line-height: 1.33;
  }

  .boothname {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.125rem;
    line-height: 1.33;
  }
}
</style>
