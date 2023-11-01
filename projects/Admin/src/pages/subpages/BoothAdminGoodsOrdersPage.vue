<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <VBtn @click="onRefreshClick">Refresh list</VBtn>

    <VProgressCircular indeterminate v-if="dataLoading" />
    <GoodsOrderListView v-else />
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsOrderListView from "@/components/goods/GoodsOrderListView.vue";

@Component({
  components: {
    GoodsOrderListView,
  },
})
export default class BoothAdminGoodsOrdersPage extends Vue {
  dataLoading: boolean = true;

  async mounted() {
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();

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
