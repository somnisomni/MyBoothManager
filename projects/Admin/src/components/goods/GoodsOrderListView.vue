<template>
  <VList class="overflow-hidden bg-transparent">
    <VSlideXReverseTransition leave-absolute group>
      <VListItem v-for="item in orderList"
                 :key="item.id"
                 class="px-0 px-sm-4 py-0 py-sm-2 my-0 my-sm-2">
        <GoodsOrderListItem :orderData="item"
                            @click="onGoodsOrderItemClick" />
      </VListItem>
    </VSlideXReverseTransition>
  </VList>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";
import GoodsOrderListItem from "./GoodsOrderListItem.vue";

@Component({
  components: {
    GoodsOrderListItem,
  },
})
export default class GoodsOrderListView extends Vue {
  get orderList(): Record<number, IGoodsOrder> {
    return Object.values(useAdminStore().currentBooth.goodsOrders ?? {}).sort((a, b) =>
      new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime(),
    );
  }

  onGoodsOrderItemClick(data: IGoodsOrder) {
    router.push({
      name: "admin-order-detail",
      params: {
        id: data.id,
      },
    });
  }
}
</script>
