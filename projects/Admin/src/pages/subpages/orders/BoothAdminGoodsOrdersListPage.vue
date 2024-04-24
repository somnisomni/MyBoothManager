<template>
  <VContainer class="pa-0 pa-sm-2 pa-md-6">
    <VLayout class="pa-2 d-flex align-center align-sm-end flex-column flex-sm-row">
      <div>
        <div class="d-flex align-center text-body-2 text-disabled"><VIcon class="mr-1">mdi-information-box-outline</VIcon> 필터를 적용하지 않고 취소된 기록이 제외되어 계산된 값입니다.</div>

        <VLayout class="mt-2 d-flex align-center align-sm-center flex-column flex-sm-row">
          <VSheet class="mx-1"
                 variant="outlined"
                 @click.prevent>
            <VLayout class="px-2 d-inline-flex flex-column align-center">
              <small>소진된 총 재고 수량</small>
              <span class="text-h5 font-weight-bold">{{ totalSaleCount.toLocaleString() }}개</span>
            </VLayout>
          </VSheet>
          <VDivider class="my-1 my-sm-0 mx-2 w-100 w-sm-auto" :vertical="smAndUp" />
          <VSheet class="mx-1"
                 variant="outlined"
                 @click.prevent>
            <VLayout class="px-2 d-inline-flex flex-column align-center">
              <small>총 매출액</small>
              <span class="text-h5 font-weight-bold">{{ currencySymbol }}{{ totalSalePrice.toLocaleString() }}</span>
            </VLayout>
          </VSheet>
        </VLayout>
      </div>

      <VSpacer />

      <VBtn class="mt-4 align-self-end align-self-sm-auto"
            size="large"
            variant="outlined"
            prepend-icon="mdi-refresh"
            :disabled="dataLoading"
            :loading="dataLoading"
            @click="onRefreshClick">새로고침</VBtn>
    </VLayout>

    <VDivider class="my-2" />

    <VLayout class="pa-2">
      <VBtn size="large"
            variant="flat"
            prepend-icon="mdi-filter"
            @click="filterSettingDialogShown = true">필터 설정</VBtn>
    </VLayout>
    <GoodsOrderListView v-if="Object.keys(boothGoodsOrders).length > 0"
                        ref="goodsOrderListView"
                        :filter="filterSettings" />
    <h2 v-else-if="!dataLoading && Object.keys(boothGoodsOrders).length <= 0" class="text-center">등록된 판매 기록이 없습니다.</h2>

    <OrderFilterSettingDialog v-model="filterSettingDialogShown"
                              :filterSetting="filterSettings"
                              @primary="setOrderFilter" />
  </VContainer>
</template>

<script lang="ts">
import { Component, Hook, Ref, Setup, Vue } from "vue-facing-decorator";
import { GoodsOrderStatus } from "@myboothmanager/common";
import { useDisplay } from "vuetify";
import { ref } from "vue";
import { type RouteRecordRaw } from "vue-router";
import { useAdminStore } from "@/plugins/stores/admin";
import GoodsOrderListView, { type IGoodsOrderFilterSetting } from "@/components/goods/GoodsOrderListView.vue";
import { useAdminAPIStore } from "@/plugins/stores/api";
import OrderFilterSettingDialog from "@/components/dialogs/OrderFilterSettingDialog.vue";

@Component({
  components: {
    GoodsOrderListView,
    OrderFilterSettingDialog,
  },
})
export default class BoothAdminGoodsOrdersListPage extends Vue {
  dataLoading: boolean = true;

  filterSettingDialogShown: boolean = false;
  readonly filterSettings = ref({
    targetGoodsIds: [],
    onlyShowOrdersWithFreeGoods: false,
  } as IGoodsOrderFilterSetting);

  @Setup(() => useDisplay().smAndUp)
  readonly smAndUp!: boolean;

  @Ref("goodsOrderListView")
  readonly goodsOrderListView!: GoodsOrderListView;

  async mounted() {
    await this.onRefreshClick();
  }

  @Hook
  beforeRouteEnter(to: RouteRecordRaw, from: RouteRecordRaw, next: (callback?: (vm?: BoothAdminGoodsOrdersListPage) => void) => void) {
    next((vm) => {
      if(vm) {
        if(to.meta?.previousId) {
          // Need scroll to the previous position (by order ID)
          vm.goodsOrderListView.scrollIntoOrderDOMById(Number(to.meta.previousId));
        } else if(to.meta?.previousScrollOffset) {
          // Need scroll to the previous position (by saved scroll offset)
          // setTimeout is NEEDED to wait for the DOM to be fully rendered
          setTimeout(() => {
            window.scrollTo(0, Number(to.meta!.previousScrollOffset));
          }, 0);
        }
      }
    });
  }

  @Hook
  beforeRouteLeave(to: RouteRecordRaw) {
    to.meta = { previousScrollOffset: window.scrollY };
  }

  get boothGoodsOrders() {
    return useAdminStore().currentBooth.goodsOrders!;
  }

  get boothGoodsOrdersLength(): number {
    return Object.keys(this.boothGoodsOrders).length;
  }

  get totalSaleCount(): number {
    return Object.values(this.boothGoodsOrders).filter((order) => order.status !== GoodsOrderStatus.CANCELED).reduce((acc, cur) =>
      acc + cur.order.reduce((orderAcc, orderCur) =>
        orderAcc + (orderCur.cId ? orderCur.quantity * (orderCur.combinedGoods ?? []).length : orderCur.quantity), 0), 0);
  }

  get totalSalePrice(): number {
    return Object.values(this.boothGoodsOrders).filter((order) => order.status !== GoodsOrderStatus.CANCELED).reduce((acc, cur) =>
      acc + Number(cur.totalPrice), 0);
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  async onRefreshClick() {
    this.dataLoading = true;
    await useAdminAPIStore().fetchGoodsOrdersOfCurrentBooth();
    this.dataLoading = false;
  }

  setOrderFilter(filterSetting: IGoodsOrderFilterSetting) {
    this.filterSettings.value = filterSetting;
  }
}
</script>
