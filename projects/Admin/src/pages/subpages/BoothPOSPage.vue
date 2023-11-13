<template>
  <VMain class="pos-page bg-background">
    <VList v-show="!mdAndUp" nav class="sm-back-link bg-background">
      <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }"
                 density="compact" />
    </VList>

    <POSOrderDrawer :orderList="orderList"
                    :sm="!mdAndUp"
                    @smDrawerHeightChanged="onSMDrawerHeightChanged"
                    @goodsOrderQuantityUpdateRequest="updateOrderListQuantity"
                    @orderCreationSuccess="onOrderCreationSuccess"
                    @orderCreationFailed="onOrderCreationFailed" />

    <VLayout class="pos-item-area d-flex flex-column flex-wrap mt-8 mt-md-0"
             :class="{ 'sm': !mdAndUp }"
             :style="{ 'padding-bottom': !mdAndUp ? `calc(${smDrawerHeight}px + 1rem)` : '' }">
      <GoodsListView :onGoodsClick="(goodsId: number) => updateOrderListQuantity({ goodsId, delta: 1 })" />
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
</template>

<script lang="ts">
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import { APP_NAME, BoothStatus, type IBooth, type IGoods } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { unref } from "vue";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";
import GoodsListView from "@/components/goods/GoodsListView.vue";
import POSOrderDrawer from "@/components/pos/POSOrderDrawer.vue";

@Component({
  components: {
    GoodsListView,
    POSOrderDrawer,
  },
})
export default class BoothPOSPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly orderList: Record<number, IGoodsOrderInternal> = {};

  smDrawerHeight: number = 0;
  showStockNotEnoughSnackbar: boolean = false;
  showOrderSuccessSnackbar: boolean = false;
  showOrderFailedSnackbar: boolean = false;

  get mdAndUp(): boolean { return unref(useDisplay().mdAndUp); }
  get currentBooth(): IBooth { return useAdminStore().boothList[useAdminStore().currentBoothId]; }
  get boothGoodsDict(): Record<number, IGoods> { return useAdminStore().boothGoodsList; }

  mounted(): void {
    if(this.currentBooth.status !== BoothStatus.OPEN) {
      router.replace({ name: "admin" });
    }
  }

  onSMDrawerHeightChanged(height: number) {
    this.smDrawerHeight = height;
  }

  onGoodsItemClick(goodsId: number) {
    if(this.orderList[goodsId]) {
      if(this.orderList[goodsId].quantity < this.boothGoodsDict[goodsId].stockRemaining) {
        this.orderList[goodsId].quantity++;
      } else {
        this.showStockNotEnoughSnackbar = true;
      }
    } else {
      this.orderList[goodsId] = {
        goodsId,
        quantity: 1,
      };
    }
  }

  updateOrderListQuantity(eventData: { goodsId: number, delta: number }) {
    const { goodsId, delta } = eventData;

    if(this.orderList[goodsId]) {
      if(this.orderList[goodsId].quantity + delta <= this.boothGoodsDict[goodsId].stockRemaining) {
        this.orderList[goodsId].quantity += delta;
      } else {
        this.showStockNotEnoughSnackbar = true;
      }

      if(this.orderList[goodsId].quantity <= 0) {
        delete this.orderList[goodsId];
      }
    } else {
      if(delta <= 0) return;
      if(this.boothGoodsDict[goodsId].stockRemaining <= 0) {
        this.showStockNotEnoughSnackbar = true;
        return;
      }

      this.orderList[goodsId] = {
        goodsId,
        quantity: delta,
      };
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
