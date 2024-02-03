<template>
  <VMain class="pos-page bg-background">
    <VList v-show="!mdAndUp" nav class="sm-back-link bg-background">
      <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }"
                 density="compact" />
    </VList>

    <POSOrderDrawer v-if="orderSimulationLayer && orderSimulationLayer.orderList"
                    :orderSimulationLayer="orderSimulationLayer"
                    :sm="!mdAndUp"
                    @smDrawerHeightChanged="onSMDrawerHeightChanged"
                    @goodsOrderQuantityUpdateRequest="updateOrderListQuantity"
                    @orderCreationSuccess="onOrderCreationSuccess"
                    @orderCreationFailed="onOrderCreationFailed"
                    @orderListResetRequest="resetSimulationLayer" />

    <VLayout class="pos-item-area d-flex flex-column flex-wrap mt-8 mt-md-0"
             :class="{ 'sm': !mdAndUp }"
             :style="{ 'padding-bottom': !mdAndUp ? `calc(${smDrawerHeight}px + 1rem)` : '' }">
      <GoodsListView :currencySymbol="currencySymbol"
                     :goodsList="Object.values(boothGoodsDict)"
                     :goodsImageUrlResolver="getUploadFilePath"
                     :goodsCategoryList="boothGoodsCategoryList"
                     :goodsCombinationList="boothGoodsCombinationList"
                     forceShowAllGoodsStock
                     @goodsClick="(goodsId: number) => updateOrderListQuantity({ id: goodsId, delta: 1 })"
                     @combinationClick="(combinationId: number) => updateOrderListQuantity({ id: combinationId, delta: 1, isCombination: true })" />
    </VLayout>

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

  <POSPageLeaveConfirmDialog v-model="showPageLeaveConfirmDialog"
                             @primary="onPageLeaveConfirm" />
</template>

<script lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { APP_NAME, BoothStatus, type IBooth, type IGoods, type IGoodsCategory, type IGoodsCombination } from "@myboothmanager/common";
import { Component, Hook, Setup, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";
import POSOrderDrawer from "@/components/pos/POSOrderDrawer.vue";
import POSPageLeaveConfirmDialog from "@/components/dialogs/POSPageLeaveConfirmDialog.vue";
import { getUploadFilePath } from "@/lib/functions";
import { POSOrderSimulationLayer } from "./BoothPOSPage.lib";

@Component({
  components: {
    POSOrderDrawer,
    POSPageLeaveConfirmDialog,
  },
})
export default class BoothPOSPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly getUploadFilePath = getUploadFilePath;

  orderSimulationLayer: POSOrderSimulationLayer | null = null;

  smDrawerHeight: number = 0;
  showStockNotEnoughSnackbar: boolean = false;
  showOrderSuccessSnackbar: boolean = false;
  showOrderFailedSnackbar: boolean = false;
  showPageLeaveConfirmDialog: boolean = false;
  pageLeaveConfirmed: boolean = false;
  private pageLeaveTarget: RouteLocationRaw | null = null;

  @Setup(() => useDisplay().mdAndUp)
  mdAndUp!: boolean;

  get currentBooth(): IBooth { return useAdminStore().boothList[useAdminStore().currentBoothId]; }
  get currencySymbol(): string { return this.currentBooth.currencySymbol; }
  get boothGoodsDict(): Record<number, IGoods> { return useAdminStore().boothGoodsList; }
  get boothGoodsCategoryList(): Array<IGoodsCategory> { return Object.values(useAdminStore().boothGoodsCategoryList); }
  get boothGoodsCombinationDict(): Record<number, IGoodsCombination> { return useAdminStore().boothGoodsCombinationList; }
  get boothGoodsCombinationList(): Array<IGoodsCombination> { return Object.values(useAdminStore().boothGoodsCombinationList); }

  mounted(): void {
    if(this.currentBooth.status !== BoothStatus.OPEN) {
      router.replace({ name: "admin" });
      return;
    }

    this.resetSimulationLayer();
  }

  @Hook()
  beforeRouteLeave(to: RouteLocationRaw, from: never, next: (to?: RouteLocationRaw | false | void) => void): void {
    if(!this.pageLeaveConfirmed) {
      next(false);
      this.showPageLeaveConfirmDialog = true;
      this.pageLeaveTarget = to;
    } else {
      next();
    }
  }

  resetSimulationLayer(): void {
    if(this.orderSimulationLayer) {
      this.orderSimulationLayer.reset(useAdminStore().boothGoodsList, useAdminStore().boothGoodsCombinationList);
    } else {
      this.orderSimulationLayer = new POSOrderSimulationLayer(useAdminStore().boothGoodsList, useAdminStore().boothGoodsCombinationList);
    }
  }

  onPageLeaveConfirm(): void {
    this.pageLeaveConfirmed = true;
    router.replace(this.pageLeaveTarget ?? { name: "admin" });
  }

  onSMDrawerHeightChanged(height: number) {
    this.smDrawerHeight = height;
  }

  // onGoodsItemClick(goodsId: number) {
  //   if(this.orderList[goodsId]) {
  //     if(this.orderList[goodsId].quantity < this.boothGoodsDict[goodsId].stockRemaining) {
  //       this.orderList[goodsId].quantity++;
  //     } else {
  //       this.showStockNotEnoughSnackbar = true;
  //     }
  //   } else {
  //     this.orderList[goodsId] = {
  //       id: goodsId,
  //       quantity: 1,
  //     };
  //   }
  // }

  updateOrderListQuantity(eventData: { id: number, delta: number, isCombination?: true }) {
    const { id, delta, isCombination } = eventData;

    try {
      this.orderSimulationLayer?.handleQuantityUpdate(isCombination ? "combination" : "goods", id, delta);
    } catch(e) {
      if(e === "UpperLimitExceeded") {
        this.showStockNotEnoughSnackbar = true;
      }
    }
  }

  onOrderCreationSuccess(): void { this.showOrderSuccessSnackbar = true; }
  onOrderCreationFailed(): void { this.showOrderFailedSnackbar = true; }
}
</script>

<style lang="scss">
.pos-page {
  --drawer-width: 300px;
}
</style>

<style lang="scss" scoped>
.pos-page {
  .sm-back-link {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1001;
  }

  .pos-item-area {
    width: 100%;
    margin: 0;
    padding: 1rem 1rem 1rem calc(var(--drawer-width) + 1rem);

    &.sm {
      padding-left: 1rem;
    }
  }
}
</style>
