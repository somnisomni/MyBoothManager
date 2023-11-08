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

    <div class="inner overflow-hidden d-flex flex-column h-100">
      <VList v-show="!sm" nav class="flex-shrink-0">
        <VListItem class="text-center">
          <div class="appname text-grey">{{ APP_NAME }}</div>
          <div class="boothname text-darken-2">{{ boothName }}</div>
          <div class="mt-1 text-h4 font-weight-bold">주문 목록</div>
        </VListItem>
      </VList>

      <VList class="overflow-auto overflow-x-hidden flex-grow-1">
        <VSlideXReverseTransition group leave-absolute>
          <VListItem v-for="item in orderList"
                     :key="item.goodsId"
                     class="pa-0"
                     :height="sm && !smDrawerExpanded ? '48px' : '72px'">
            <POSGoodsOrderListItem :item="item"
                                   :singleLine="sm && !smDrawerExpanded"
                                   @click="onGoodsOrderItemClick"
                                   @quantityChange="onGoodsOrderQuantityUpdateRequest" />
          </VListItem>
        </VSlideXReverseTransition>
      </VList>

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
                @click="showOrderConfirmDialog = true">판매 확인</VBtn>
        </VListItem>
      </VList>
    </div>
  </div>

  <POSGoodsAdvancedDialog v-model="showOrderAdvancedDialog"
                          :goodsId="orderAdvancedDialogGoodsId"
                          :orderData="orderAdvancedDialogOrderData"
                          @deleteRequest="(goodsId: number) => delete orderList[goodsId]"
                          @confirm="onOrderItemAdvancedConfirm" />
  <POSListResetConfirmDialog v-model="showListResetConfirmDialog"
                             @confirm="resetOrderList" />
  <POSOrderConfirmDialog v-model="showOrderConfirmDialog"
                         :orders="orderList"
                         @confirm="onOrderConfirm" />
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import { APP_NAME, emptyNumberKeyObject, type IBooth, type IGoods, type IGoodsOrderCreateRequest } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import POSGoodsAdvancedDialog from "../dialogs/POSGoodsAdvancedDialog.vue";
import POSListResetConfirmDialog from "../dialogs/POSListResetConfirmDialog.vue";
import POSOrderConfirmDialog from "../dialogs/POSOrderConfirmDialog.vue";
import POSGoodsOrderListItem from "./POSGoodsOrderListItem.vue";

@Component({
  components: {
    POSGoodsOrderListItem,
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
  ],
})
export default class POSOrderDrawer extends Vue {
  @Prop({ type: Object, required: true }) orderList!: Record<number, IGoodsOrderInternal>;
  @Prop({ type: Boolean, default: false }) sm!: boolean;
  @Prop({ type: Number }) smDrawerHeight!: number;

  readonly APP_NAME = APP_NAME;

  smDrawerExpanded: boolean = false;

  orderCreationInProgress: boolean = false;
  showOrderConfirmDialog: boolean = false;
  showListResetConfirmDialog: boolean = false;
  showOrderAdvancedDialog: boolean = false;
  orderAdvancedDialogGoodsId: number | null = null;
  orderAdvancedDialogOrderData: IGoodsOrderInternal | null = null;

  get currentBooth(): IBooth { return useAdminStore().boothList[useAdminStore().currentBoothId]; }
  get currentBoothGoods(): Record<number, IGoods> { return useAdminStore().boothGoodsList; }
  get boothName(): string { return this.currentBooth.name; }
  get currencySymbol(): string { return this.currentBooth.currencySymbol; }
  get isOrderListEmpty(): boolean { return Object.keys(this.orderList).length <= 0; }

  get totalOrderWorth(): number {
    return Object.keys(this.orderList).reduce((acc, goodsId) => {
      const gId: number = Number(goodsId);
      return acc + (this.orderList[gId].price ?? this.currentBoothGoods[gId].price) * this.orderList[gId].quantity;
    }, 0);
  }
  get totalOrderWorthString(): string { return `${this.currencySymbol}${this.totalOrderWorth.toLocaleString()}`; }

  mounted() {
    new ResizeObserver((entries) => {
      this.$emit("smDrawerHeightChanged", entries[0].contentRect.height);
    }).observe(this.$refs.orderDrawer as HTMLElement);
  }

  onGoodsOrderItemClick(item: IGoodsOrderInternal) {
    this.showOrderAdvancedDialog = true;
    this.orderAdvancedDialogGoodsId = item.goodsId;
    this.orderAdvancedDialogOrderData = item;
  }

  onOrderItemAdvancedConfirm(eventData: { goodsId: number, newOrderData: IGoodsOrderInternal }) {
    this.orderList[eventData.goodsId] = {
      ...eventData.newOrderData,
      quantity: this.orderList[eventData.goodsId].quantity,
    };

    this.onGoodsOrderQuantityUpdateRequest({
      goodsId: eventData.goodsId,
      delta: eventData.newOrderData.quantity - this.orderList[eventData.goodsId].quantity,
    });
  }

  resetOrderList(): void {
    emptyNumberKeyObject(this.orderList);
  }

  async onOrderConfirm() {
    this.orderCreationInProgress = true;
    this.$emit("orderCreationStarted");

    const data: IGoodsOrderCreateRequest = {
      boothId: this.currentBooth.id,
      totalPrice: this.totalOrderWorth,
      order: [],
    };

    for(const goodsId in this.orderList) {
      data.order.push({
        gId: Number(goodsId),
        price: this.orderList[goodsId].price ?? this.currentBoothGoods[goodsId].price,
        quantity: this.orderList[goodsId].quantity,
      });
    }

    // API call
    const results = [await useAdminStore().createGoodsOrder(data), await useAdminStore().fetchGoodsOfCurrentBooth(true)];
    if(results.every((res) => typeof res !== "string")) {
      // If API call success, empty the order list
      this.resetOrderList();
      this.$emit("orderCreationSuccess");
    } else {
      this.$emit("orderCreationFailed");
    }

    this.orderCreationInProgress = false;
    this.$emit("orderCreationDone");
  }

  @Emit("goodsOrderQuantityUpdateRequest")
  onGoodsOrderQuantityUpdateRequest(eventData: { goodsId: number, delta: number }) {
    return eventData;
  }
}
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
    margin: 0 auto;
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
