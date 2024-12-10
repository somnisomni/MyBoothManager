<template>
  <VList class="overflow-visible bg-transparent">
    <VSlideXReverseTransition leave-absolute group>
      <VListItem v-for="item in filteredList"
                 ref="orderListDOMItems"
                 :key="item.id"
                 class="px-0 px-sm-4 py-0 py-sm-2 my-0 my-sm-2">
        <GoodsOrderListItem :orderData="item"
                            @click="onGoodsOrderItemClick" />
      </VListItem>
    </VSlideXReverseTransition>
  </VList>
</template>

<script lang="ts">
import type { VListItem } from "vuetify/components";
import { GoodsOrderStatus, type GoodsOrderPaymentMethod, type IGoodsOrder } from "@myboothmanager/common";
import { Component, Prop, Ref, Vue, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import router from "@/plugins/router";
import GoodsOrderListItem from "./GoodsOrderListItem.vue";

export interface IGoodsOrderFilterSetting {
  targetGoodsIds: Array<number>;
  onlyShowOrdersWithFreeGoods: boolean;
  paymentMethods?: Array<GoodsOrderPaymentMethod> | null;
}

export interface IGoodsOrderFilterResult {
  listCount: number;
  listCountCancelled: number;
  totalStockCount: number;
  totalRevenue: number;
}

@Component({
  emits: ["update:filter-result"],
  components: {
    GoodsOrderListItem,
  },
})
export default class GoodsOrderListView extends Vue {
  @Prop({ type: Object, default: {} }) declare readonly filter: IGoodsOrderFilterSetting;

  @Ref("orderListDOMItems") declare readonly orderListItemsRefs: VListItem[];

  get filteredList(): Array<IGoodsOrder> {
    return Object.values(useAdminStore().currentBooth.orders ?? {})
      .filter((order) => (
        ((this.filter.targetGoodsIds.length > 0) ? order.order.map((item) => item.gId).some((id) => this.filter.targetGoodsIds.includes(id!)) : true)
        && ((this.filter.onlyShowOrdersWithFreeGoods) ? order.order.some((item) => Number(item.price) <= 0 || item.price === null || item.price === undefined) : true)
        && ((this.filter.paymentMethods && this.filter.paymentMethods.length > 0) ? this.filter.paymentMethods.includes(order.paymentMethod!) : true)
      ))
      .sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
  }

  @Watch("filteredList", { deep: true, immediate: true })
  onFilteredListChange() {
    const validList = this.filteredList.filter((order) => order.status === GoodsOrderStatus.RECORDED);
    const cancelledList = this.filteredList.filter((order) => order.status === GoodsOrderStatus.CANCELED);

    this.$emit("update:filter-result", {
      listCount: validList.length,
      listCountCancelled: cancelledList.length,
      totalStockCount: validList.reduce(
        (acc, order) => acc + order.order.reduce(
          (oAcc, oItem) => oAcc + ((oItem.cId && oItem.combinedGoods ? oItem.combinedGoods.length : 1) * oItem.quantity), 0), 0),
      totalRevenue: validList.reduce((acc, order) => acc + order.totalRevenue, 0),
    } as IGoodsOrderFilterResult);
  }

  onGoodsOrderItemClick(data: IGoodsOrder) {
    router.push({
      name: "admin-order-detail",
      params: {
        id: data.id,
      },
    });
  }

  public scrollIntoOrderDOMById(orderId: number) {
    if(!this.orderListItemsRefs || this.orderListItemsRefs.length === 0) return;

    const foundItem = this.orderListItemsRefs.find(((item) => Number(item.$.vnode.key) === orderId));
    if(!foundItem) return;

    // setTimeout is NEEDED to wait for the DOM to be fully rendered
    setTimeout(() => {
      const bound = foundItem.$el.getBoundingClientRect();

      window.scrollTo({
        top: bound.top - bound.height,
        behavior: "instant",
      });
    }, 0);
  }
}
</script>
