<template>
  <VMain class="bg-background">
    <VNavigationDrawer permanent class="navdrawer-flex">
      <VList nav class="flex-shrink-0">
        <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }" />
        <VListItem class="text-center">
          <div class="appname text-grey">{{ APP_NAME }}</div>
          <div class="boothname text-darken-2">{{ boothName }}</div>
          <div class="mt-1 text-h4 font-weight-bold">주문 목록</div>
        </VListItem>
      </VList>

      <VList class="overflow-auto overflow-x-hidden flex-grow-1">
        <VSlideXReverseTransition group leave-absolute>
          <VListItem v-for="item in goodsInOrder"
                     :key="item.goodsId"
                     class="pa-0"
                     height="72px">
            <POSGoodsOrderListItem :item="item"
                                   :currencySymbol="currencySymbol"
                                   @quantityChange="updateGoodsInOrderQuantity"
                                   @itemAdvancedConfirm="(newGoodsData: IGoodsOrderInternal) => onOrderItemAdvancedConfirm(item.goodsId, newGoodsData)" />
          </VListItem>
        </VSlideXReverseTransition>
      </VList>

      <VList nav class="flex-shrink-0 pa-0 pb-2">
        <VListItem class="px-2 py-1">
          <VBtn prepend-icon="mdi-playlist-remove"
                class="w-100"
                variant="text"
                :disabled="isGoodsInOrderEmpty || orderCreationInProgress"
                @click="showListResetConfirmDialog = true">목록 초기화</VBtn>
        </VListItem>
        <VListItem class="px-2 py-1">
          <div class="text-body-2 text-center mb-2">총 가격: <strong>{{ totalOrderWorthString }}</strong></div>
          <VBtn prepend-icon="mdi-cart-heart"
                color="primary"
                size="x-large"
                class="w-100"
                :loading="orderCreationInProgress"
                :disabled="isGoodsInOrderEmpty || orderCreationInProgress"
                @click="showOrderConfirmDialog = true">판매 확인</VBtn>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VContainer class="d-flex flex-column flex-wrap">
      <GoodsListView :onGoodsClick="(goodsId: number) => updateGoodsInOrderQuantity({ goodsId, delta: 1 })" />
    </VContainer>

    <VSnackbar v-model="showStockNotEnoughSnackbar" :timeout="2000" close-on-back close-on-content-click location="top">
      <span class="text-body-2">재고가 부족합니다.</span>
    </VSnackbar>

    <VSnackbar v-model="showOrderSuccessSnackbar" :timeout="3000" close-on-back close-on-content-click location="top" color="success">
      <span class="text-body-2"><VIcon>mdi-check-bold</VIcon> 판매가 성공적으로 기록되었습니다.</span>
    </VSnackbar>

    <VSnackbar v-model="showOrderFailedSnackbar" :timeout="3000" close-on-back close-on-content-click location="top" color="error">
      <span class="text-body-2"><VIcon>mdi-alert</VIcon> 판매를 기록하는 중 오류가 발생했습니다.</span>
    </VSnackbar>
  </VMain>

  <POSOrderConfirmDialog v-model="showOrderConfirmDialog"
                         :orders="goodsInOrder"
                         @confirm="onOrderConfirm" />
  <POSListResetConfirmDialog v-model="showListResetConfirmDialog"
                             @confirm="onListResetConfirm" />
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import { APP_NAME, BoothStatus, emptyNumberKeyObject, type IBooth, type IGoods, type IGoodsOrderCreateRequest } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import router from "@/router";
import GoodsListView from "@/components/goods/GoodsListView.vue";
import POSOrderConfirmDialog from "@/components/dialogs/POSOrderConfirmDialog.vue";
import POSListResetConfirmDialog from "@/components/dialogs/POSListResetConfirmDialog.vue";
import POSGoodsOrderListItem from "@/components/pos/POSGoodsOrderListItem.vue";

@Component({
  components: {
    GoodsListView,
    POSGoodsOrderListItem,
    POSOrderConfirmDialog,
    POSListResetConfirmDialog,
  },
})
export default class BoothPOSPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly goodsInOrder: Record<number, IGoodsOrderInternal> = {};

  showOrderConfirmDialog: boolean = false;
  showListResetConfirmDialog: boolean = false;
  showOrderItemEditDialog: boolean = false;

  showStockNotEnoughSnackbar: boolean = false;
  showOrderSuccessSnackbar: boolean = false;
  showOrderFailedSnackbar: boolean = false;
  orderCreationInProgress: boolean = false;

  get currentBooth(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get boothName(): string {
    return this.currentBooth.name;
  }

  get currencySymbol(): string {
    return this.currentBooth.currencySymbol;
  }

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  get isGoodsInOrderEmpty(): boolean {
    return Object.keys(this.goodsInOrder).length <= 0;
  }

  get totalOrderWorth(): number {
    let total = 0;

    for(const goodsId in this.goodsInOrder) {
      total += (this.goodsInOrder[goodsId].price ?? this.boothGoodsDict[goodsId].price) * this.goodsInOrder[goodsId].quantity;
    }

    return total;
  }

  get totalOrderWorthString(): string {
    return `${this.currencySymbol}${this.totalOrderWorth.toLocaleString()}`;
  }

  mounted(): void {
    if(this.currentBooth.status !== BoothStatus.OPEN) {
      router.replace({ name: "admin" });
    }
  }

  resetOrderList(): void {
    emptyNumberKeyObject(this.goodsInOrder);
  }

  onGoodsItemClick(goodsId: number) {
    if(this.goodsInOrder[goodsId]) {
      if(this.goodsInOrder[goodsId].quantity < this.boothGoodsDict[goodsId].stockRemaining) {
        this.goodsInOrder[goodsId].quantity++;
      } else {
        this.showStockNotEnoughSnackbar = true;
      }
    } else {
      this.goodsInOrder[goodsId] = {
        goodsId,
        quantity: 1,
      };
    }
  }

  updateGoodsInOrderQuantity(eventData: { goodsId: number, delta: number }) {
    const { goodsId, delta } = eventData;

    if(this.goodsInOrder[goodsId]) {
      if(this.goodsInOrder[goodsId].quantity + delta <= this.boothGoodsDict[goodsId].stockRemaining) {
        this.goodsInOrder[goodsId].quantity += delta;
      } else {
        this.showStockNotEnoughSnackbar = true;
      }

      if(this.goodsInOrder[goodsId].quantity <= 0) {
        delete this.goodsInOrder[goodsId];
      }
    } else {
      if(delta <= 0) return;
      if(this.boothGoodsDict[goodsId].stockRemaining <= 0) {
        this.showStockNotEnoughSnackbar = true;
        return;
      }

      this.goodsInOrder[goodsId] = {
        goodsId,
        quantity: delta,
      };
    }
  }

  onOrderItemAdvancedConfirm(goodsId: number, newOrderData: IGoodsOrderInternal) {
    this.goodsInOrder[goodsId] = newOrderData;
  }

  async onOrderConfirm() {
    this.orderCreationInProgress = true;

    const data: IGoodsOrderCreateRequest = {
      boothId: this.currentBooth.id,
      totalPrice: this.totalOrderWorth,
      order: [],
    };

    for(const goodsId in this.goodsInOrder) {
      data.order.push({
        gId: Number(goodsId),
        price: this.goodsInOrder[goodsId].price ?? this.boothGoodsDict[goodsId].price,
        quantity: this.goodsInOrder[goodsId].quantity,
      });
    }

    // API call
    const results = [await useAdminStore().createGoodsOrder(data), await useAdminStore().fetchGoodsOfCurrentBooth(true)];
    if(results.every((res) => typeof res !== "string")) {
      // If API call success, empty the order list
      this.resetOrderList();
      this.showOrderSuccessSnackbar = true;
    } else {
      this.showOrderFailedSnackbar = true;
    }

    this.orderCreationInProgress = false;
  }

  onListResetConfirm(): void {
    this.resetOrderList();
  }
}
</script>

<style lang="scss" scoped>
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
</style>
