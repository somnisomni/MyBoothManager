<template>
  <div class="d-flex flex-column overflow-visible overflow-x-hidden">
    <!-- Combinations first -->
    <VList class="bg-transparent overflow-visible pb-1">
      <VSlideXReverseTransition group
                                leaveAbsolute>
        <VListItem v-for="item in orderList.values('combination')"
                   :key="item.id"
                   class="pa-0"
                   :height="singleLine ? '48px' : '72px'">
          <POSGoodsOrderListItem :item="item"
                                 :isCombination="true"
                                 :singleLine="singleLine"
                                 @click="onGoodsOrderItemClick"
                                 @quantityChange="onGoodsOrderQuantityUpdateRequest" />
        </VListItem>
      </VSlideXReverseTransition>
    </VList>

    <!-- Goods after -->
    <VList class="bg-transparent overflow-visible pt-1">
      <VSlideXReverseTransition group
                                leaveAbsolute>
        <VListItem v-for="item in orderList.values('goods')"
                   :key="item.id"
                   class="pa-0"
                   :height="singleLine ? '48px' : '72px'">
          <POSGoodsOrderListItem :item="item"
                                 :singleLine="singleLine"
                                 @click="onGoodsOrderItemClick"
                                 @quantityChange="onGoodsOrderQuantityUpdateRequest" />
        </VListItem>
      </VSlideXReverseTransition>
    </VList>
  </div>
</template>

<script lang="ts">
import type { POSOrderList, IGoodsOrderInternal } from "@/pages/subpages/POSPage.lib";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import POSGoodsOrderListItem from "./POSGoodsOrderListItem.vue";

@Component({
  components: { POSGoodsOrderListItem },
  emits: [ "click:item", "request:itemQuantityUpdate" ],
})
export default class POSGoodsOrderListView extends Vue {
  @Prop({ type: Object, required: true }) declare readonly orderList: POSOrderList;
  @Prop({ type: Boolean, default: false }) declare readonly singleLine: boolean;

  @Emit("click:item")
  onGoodsOrderItemClick(item: IGoodsOrderInternal & { isCombination?: true }): IGoodsOrderInternal & { isCombination?: true } {
    return item;
  }

  @Emit("request:itemQuantityUpdate")
  onGoodsOrderQuantityUpdateRequest(eventData: { id: number; delta: number; isCombination?: true }): { id: number; delta: number; isCombination?: true } {
    return eventData;
  }
}
</script>
