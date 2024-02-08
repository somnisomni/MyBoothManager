<template>
  <VContainer class="pa-0 pa-sm-2 pa-md-6">
    <VLayout class="pa-2 d-flex align-center align-sm-end flex-column flex-sm-row">
      <div>
        <div class="d-flex align-center text-body-2 text-disabled"><VIcon class="mr-1">mdi-information-box-outline</VIcon> 취소된 기록을 제외하여 계산된 값입니다.</div>

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

    <GoodsOrderListView v-if="Object.keys(boothGoodsOrders).length > 0" />
    <h2 v-else-if="!dataLoading && Object.keys(boothGoodsOrders).length <= 0" class="text-center">등록된 판매 기록이 없습니다.</h2>
  </VContainer>
</template>

<script lang="ts">
import { Component, Setup, Vue } from "vue-facing-decorator";
import { GoodsOrderStatus } from "@myboothmanager/common";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/stores/admin";
import GoodsOrderListView from "@/components/goods/GoodsOrderListView.vue";
import { useAdminAPIStore } from "@/stores/api";

@Component({
  components: {
    GoodsOrderListView,
  },
})
export default class BoothAdminGoodsOrdersListPage extends Vue {
  dataLoading: boolean = true;

  @Setup(() => useDisplay().smAndUp)
  smAndUp!: boolean;

  async mounted() {
    await this.onRefreshClick();
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
        orderAcc + new Number(orderCur.quantity).valueOf(), 0), 0);
  }

  get totalSalePrice(): number {
    return Object.values(this.boothGoodsOrders).filter((order) => order.status !== GoodsOrderStatus.CANCELED).reduce((acc, cur) =>
      acc + new Number(cur.totalPrice).valueOf(), 0);
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  async onRefreshClick() {
    this.dataLoading = true;
    await useAdminAPIStore().fetchGoodsOrdersOfCurrentBooth();
    this.dataLoading = false;
  }
}
</script>
