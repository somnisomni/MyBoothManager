<template>
  <VContainer class="mt-4 pa-0 pa-sm-2 pa-md-6">
    <h2 v-if="!orderId" class="text-error">잘못된 접근입니다.</h2>
    <VLayout v-else class="pa-2">
      {{ orderId }}
    </VLayout>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({})
export default class BoothAdminGoodsOrderDetailPage extends Vue {
  get orderId(): number {
    return parseInt(useRoute().params.id as string);
  }
}
</script>
