<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <VBtn @click="onRefreshClick">Refresh list</VBtn>
    <VProgressCircular indeterminate v-if="dataLoading" />

    <div v-for="order in boothGoodsOrders"
         :key="order.id" class="my-4">
      <div><strong>ORDER ID: {{ order.id }}</strong></div>
      <div>totalPrice: {{ order.totalPrice }}</div>

      <div v-for="item in order.order"
           :key="item.gId">
        <div>gId: {{ item.gId }}, price: {{ item.price }}, quant: {{ item.quantity }}</div>
      </div>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothAdminGoodsOrdersPage extends Vue {
  dataLoading: boolean = true;

  async mounted() {
    // Fetch the goods orders if not initialized before
    if(Object.keys(this.boothGoodsOrders).length <= 0) {
      await useAdminStore().fetchGoodsOrdersOfCurrentBooth();
    }

    this.dataLoading = false;
  }

  get boothGoodsOrders() {
    return useAdminStore().boothGoodsOrderList;
  }

  async onRefreshClick() {
    this.dataLoading = true;
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();
    this.dataLoading = false;
  }
}
</script>
