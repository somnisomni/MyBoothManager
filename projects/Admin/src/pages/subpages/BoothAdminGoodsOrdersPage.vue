<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class BoothAdminGoodsOrdersPage extends Vue {
  dataLoading: boolean = true;

  async mounted() {
    // Fetch the goods orders while loading this page, not application first load
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();
    this.dataLoading = false;
  }

  get boothGoodsOrders() {
    return useAdminStore().boothGoodsOrderList;
  }
}
</script>
