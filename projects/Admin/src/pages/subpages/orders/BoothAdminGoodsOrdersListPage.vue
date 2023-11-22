<template>
  <VContainer class="mt-4 pa-0 pa-sm-2 pa-md-6">
    <VLayout class="pa-2">
      <VBtn size="large"
            :disabled="dataLoading"
            :loading="dataLoading"
            @click="onRefreshClick"><VIcon>mdi-refresh</VIcon> 새로고침</VBtn>
    </VLayout>

    <GoodsOrderListView v-if="Object.keys(boothGoodsOrders).length > 0" />
    <h2 v-else-if="!dataLoading && Object.keys(boothGoodsOrders).length <= 0" class="text-center">등록된 판매 기록이 없습니다.</h2>
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
export default class BoothAdminGoodsOrdersListPage extends Vue {
  dataLoading: boolean = true;

  async mounted() {
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();

    this.dataLoading = false;
  }

  get boothGoodsOrders() {
    return useAdminStore().boothGoodsOrderList;
  }

  get boothGoodsOrdersLength(): number {
    return Object.keys(this.boothGoodsOrders).length;
  }

  async onRefreshClick() {
    this.dataLoading = true;
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();
    this.dataLoading = false;
  }
}
</script>
