<template>
  <VList class="overflow-visible bg-transparent">
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
import { Component, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";
import GoodsOrderListItem from "./GoodsOrderListItem.vue";

export interface IGoodsOrderFilterSetting {
  targetGoodsIds: Array<number>;
  onlyShowOrdersWithFreeGoods: boolean;
}

@Component({
  components: {
    GoodsOrderListItem,
  },
})
export default class GoodsOrderListView extends Vue {
  @Prop({ type: Object, default: {} }) filter!: IGoodsOrderFilterSetting;

  get orderList(): Record<number, IGoodsOrder> {
    return Object.values(useAdminStore().currentBooth.goodsOrders ?? {})
      .filter((order) => (
        ((this.filter.targetGoodsIds.length > 0) ? order.order.map((item) => item.gId).some((id) => this.filter.targetGoodsIds.includes(id!)) : true)
        && ((this.filter.onlyShowOrdersWithFreeGoods) ? order.order.some((item) => Number(item.price) <= 0 || item.price === null || item.price === undefined) : true)
      ))
      .sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
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
