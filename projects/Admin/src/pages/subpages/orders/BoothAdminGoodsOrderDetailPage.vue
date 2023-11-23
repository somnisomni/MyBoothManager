<template>
  <VContainer class="mt-4 pa-0 pa-sm-2 pa-md-6">
    <h2 v-if="!orderId" class="text-error">잘못된 접근입니다.</h2>
    <VLayout v-else class="pa-2 flex-column">
      <h2 v-if="!orderData">유효하지 않은 판매 기록입니다.</h2>
      <div v-else>
        {{ orderId }}
        {{ orderData.status }}
        {{ orderData.totalPrice }}
        {{ orderData.createdAt }}
        <ul>
          <li v-for="order in orderData.order" :key="order.gId">
            {{ order.name }}
            {{ order.price }}
            {{ order.quantity }}
          </li>
        </ul>
      </div>
    </VLayout>
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
}
</script>
