<template>
  <VContainer class="pa-0 pa-sm-2 pa-md-6">
    <h2 v-if="!orderId" class="text-error">잘못된 접근입니다.</h2>
    <VLayout v-else class="pa-2 justify-start">
      <VBtn :to="{ name: 'admin-orders' }"
            size="large"
            variant="text"
            prepend-icon="mdi-arrow-left"
            :active="false"
            replace>판매 기록 목록으로</VBtn> <!-- :active is workaround -->
    </VLayout>

    <VDivider class="my-2" />

    <div v-if="orderData">
      <h4 class="mb-2">LAYOUT IS WORK IN PROGRESS</h4>

      <div>ID: {{ orderId }}</div>
      <div>상태: {{ orderData.status }}</div>
      <div>총 판매 금액: {{ currencySymbol }}{{ orderData.totalPrice.toLocaleString() }}</div>
      <div>생성 일자: {{ new Date(orderData.createdAt!).toLocaleString() }}</div>

      <ul class="mt-4">
        <div>판매 굿즈 목록</div>

        <li v-for="order in orderData.order" :key="order.gId">
          <span>{{ order.name }}</span> /
          <span>{{ currencySymbol }}{{ order.price?.toLocaleString() }}</span> /
          <span>{{ order.quantity.toLocaleString() }}개</span>
        </li>
      </ul>
    </div>
    <h2 v-else>유효하지 않은 판매 기록입니다.</h2>
  </VContainer>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothAdminGoodsOrderDetailPage extends Vue {
  async mounted() {
    if(!this.orderData) {
      // If order data is not fetched yet, try to fetch it
      await useAdminStore().fetchGoodsOrdersOfCurrentBooth();
    }
  }

  get orderId(): number {
    return parseInt(useRoute().params.id as string);
  }

  get orderData(): IGoodsOrder {
    return useAdminStore().boothGoodsOrderList[this.orderId];
  }

  get currencySymbol(): string {
    // TODO: Use currency symbol from orderData, after backend is updated
    return useAdminStore().boothList[this.orderData.boothId].currencySymbol;
  }
}
</script>
