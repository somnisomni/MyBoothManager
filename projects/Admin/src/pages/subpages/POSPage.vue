<template>
  <VMain class="pos-page bg-background">
    <VList v-show="!mdAndUp"
           nav
           class="sm-back-link bg-background">
      <VListItem prependIcon="mdi-arrow-left"
                 title="관리 페이지로 이동"
                 :to="{ name: 'admin' }"
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
                     :goodsList="boothGoodsCombinedList"
                     :goodsCategoryList="boothGoodsCategoryList"
                     omitEmptyGoodsCategory>
        <template #goods="props">
          <GoodsItem v-bind="props"
                     :forceStockVisibility="goodsItemForceStockVisibility"
                     @click="(goodsId: number) => updateOrderListQuantity({ id: goodsId, delta: 1 })" />
        </template>
        <template #goods-combination="props">
          <GoodsItem v-bind="props"
                     :forceStockVisibility="goodsItemForceStockVisibility"
                     @click="(combinationId: number) => updateOrderListQuantity({ id: combinationId, delta: 1, isCombination: true })" />
        </template>
      </GoodsListView>
    </VLayout>
  </VMain>

  <POSPageLeaveConfirmDialog v-model="showPageLeaveConfirmDialog"
                             @primary="onPageLeaveConfirm" />
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import type { Goods, GoodsCombination, SnackbarContextWrapper } from "@myboothmanager/common-ui";
import type { RouteLocationRaw } from "vue-router";
import { APP_NAME, BoothStatus, GoodsStockVisibility } from "@myboothmanager/common";
import { Component, Hook, Setup, toNative, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import POSPageLeaveConfirmDialog from "@/components/dialogs/POSPageLeaveConfirmDialog.vue";
import POSOrderDrawer from "@/components/pos/POSOrderDrawer.vue";
import router from "@/plugins/router";
import { useAdminStore } from "@/plugins/stores/admin";
import { POSOrderSimulationLayer } from "./POSPage.lib";

@Component({
  components: {
    POSOrderDrawer,
    POSPageLeaveConfirmDialog,
  },
})
class POSPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly goodsItemForceStockVisibility = GoodsStockVisibility.SHOW_ALL;

  @Setup(() => useDisplay().mdAndUp)
  declare readonly mdAndUp: boolean;

  @Setup(() => useAdminStore().globalSnackbarContexts)
  declare readonly globalSnackbarContexts: SnackbarContextWrapper;

  @Setup(() => useAdminStore().currentBooth.booth)
  declare readonly currentBooth: NonNullable<ReturnType<typeof useAdminStore>["currentBooth"]["booth"]>;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  orderSimulationLayer: POSOrderSimulationLayer | null = null;

  smDrawerHeight: number = 0;
  showPageLeaveConfirmDialog: boolean = false;
  pageLeaveConfirmed: boolean = false;
  private pageLeaveTarget: RouteLocationRaw | null = null;

  private stockNotEnoughSnackbarId = "";
  private orderCreateSuccessSnackbarId = "";
  private orderCreateFailedSnackbarId = "";

  get boothGoodsCategoryList(): IGoodsCategory[] { return Object.values(useAdminStore().currentBooth.goodsCategories ?? {}); }
  get boothGoodsCombinedList(): Array<Goods | GoodsCombination> {
    return [
      ...Object.values(useAdminStore().currentBooth.goods ?? {}),
      ...Object.values(useAdminStore().currentBooth.goodsCombinations ?? {}),
    ];
  }

  mounted(): void {
    if(this.currentBooth.status.status !== BoothStatus.OPEN) {
      router.replace({ name: "admin" });
      return;
    }

    this.resetSimulationLayer();
  }

  @Hook()
  beforeRouteLeave(to: RouteLocationRaw, from: never, next: (to?: RouteLocationRaw | false) => void): void {
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
      this.orderSimulationLayer.reset(useAdminStore().currentBooth.goods ?? {}, useAdminStore().currentBooth.goodsCombinations ?? {});
    } else {
      this.orderSimulationLayer = new POSOrderSimulationLayer(useAdminStore().currentBooth.goods ?? {}, useAdminStore().currentBooth.goodsCombinations ?? {});
    }
  }

  onPageLeaveConfirm(): void {
    this.pageLeaveConfirmed = true;
    router.replace(this.pageLeaveTarget ?? { name: "admin" });
  }

  onSMDrawerHeightChanged(height: number): void {
    this.smDrawerHeight = height;
  }

  updateOrderListQuantity(eventData: { id: number; delta: number; isCombination?: true }): void {
    const { id, delta, isCombination } = eventData;

    try {
      this.orderSimulationLayer?.handleQuantityUpdate(isCombination ? "combination" : "goods", id, delta);
    } catch(e) {
      if(e === "UpperLimitExceeded") {
        this.onGoodsStockNotEnough();
      }
    }
  }

  onGoodsStockNotEnough(): void {
    this.globalSnackbarContexts.removeImmediate(this.stockNotEnoughSnackbarId);
    this.stockNotEnoughSnackbarId = this.globalSnackbarContexts.add({
      type: "plain",
      text: "재고가 부족합니다.",
      timeout: 2000,
      closeOnBack: true,
      closeOnContentClick: true,
    });
  }

  onOrderCreationSuccess(createdOrderId: number): void {
    this.globalSnackbarContexts.removeImmediate(this.orderCreateSuccessSnackbarId);
    this.orderCreateSuccessSnackbarId = this.globalSnackbarContexts.add({
      type: "success",
      text: `판매가 성공적으로 기록되었습니다.\n(생성된 판매 기록 ID: ${createdOrderId})`,
      timeout: 3000,
      closeOnBack: true,
      closeOnContentClick: true,
    });
  }

  onOrderCreationFailed(): void {
    this.globalSnackbarContexts.removeImmediate(this.orderCreateFailedSnackbarId);
    this.orderCreateFailedSnackbarId = this.globalSnackbarContexts.add({
      type: "error",
      text: "판매를 기록하는 중 오류가 발생했습니다.",
      timeout: 3000,
      closeOnBack: true,
      closeOnContentClick: true,
    });
  }
}

export default toNative(POSPage);
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
