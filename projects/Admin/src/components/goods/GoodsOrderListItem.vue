<template>
  <VSheet>
    <div><VIcon>mdi-check</VIcon></div>
    <div>totalPrice: {{ orderData.totalPrice }}</div>
    <div v-if="orderData.createdAt">createdAt: {{ orderData.createdAt }}</div>
    <div v-for="item in orderData.order" :key="item.gId">gId: {{ item.gId }}, price: {{ item.price }}, quant: {{ item.quantity }}</div>
  </VSheet>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class GoodsOrderListItem extends Vue {
  @Prop({ type: Object, required: true }) orderData!: IGoodsOrder;
}
</script>
