<template>
  <VList>
    <VListItem v-for="item in orderList"
               :key="item.id"
               class="my-2">
      <GoodsOrderListItem :orderData="item" />
    </VListItem>
  </VList>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsOrderListItem from "./GoodsOrderListItem.vue";

@Component({
  components: {
    GoodsOrderListItem,
  },
})
export default class GoodsOrderListView extends Vue {
  get orderList(): Record<number, IGoodsOrder> {
    return Object.values(useAdminStore().boothGoodsOrderList).sort((a, b) =>
      new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime(),
    );
  }
}
</script>
