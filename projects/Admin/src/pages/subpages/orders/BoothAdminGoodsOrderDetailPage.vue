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

      <VBtn class="mt-4" @click="cancelOrderWarningDialogShown = true">판매 기록 취소</VBtn>
    </div>
    <h2 v-else>유효하지 않은 판매 기록입니다.</h2>

    <CommonWarningDialog v-model="cancelOrderWarningDialogShown"
                         dialogTitle="판매 기록 취소 확인"
                         headlineText="판매 기록을 취소 처리하면 다시 기록 상태로 복원할 수 없습니다."
                         cancelText="취소"
                         primaryText="확인"
                         @primary="cancelOrder">
      <p>취소 처리하면 기록된 굿즈들의 재고 수량이 복구됩니다.</p>
      <p>계속하시겠습니까?</p>
    </CommonWarningDialog>
  </VContainer>
</template>

<script lang="ts">
import { GoodsOrderStatus, type IGoodsOrder } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothAdminGoodsOrderDetailPage extends Vue {
  cancelOrderWarningDialogShown = false;

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

  async cancelOrder() {
    const response = await useAdminStore().updateGoodsOrderStatus(this.orderId, { status: GoodsOrderStatus.CANCELED });

    if(response === true) {
      // TODO: further process
      alert("OK");
    } else {
      // TODO: show dialog?
      alert(response);
    }
  }
}
</script>
