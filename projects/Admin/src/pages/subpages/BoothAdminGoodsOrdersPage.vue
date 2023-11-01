<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <VLayout class="pa-2">
      <VBtn size="large"
            :disabled="dataLoading"
            :loading="dataLoading"
            @click="onRefreshClick"><VIcon>mdi-refresh</VIcon> 새로고침</VBtn>
    </VLayout>

    <GoodsOrderListView />
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
