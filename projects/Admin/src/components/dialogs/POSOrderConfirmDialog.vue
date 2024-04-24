<template>
  <CommonDialog v-model="open"
                width="500px"
                dialogTitle="판매 내역 확인"
                dialogCancelText="취소">
    <p><strong>구매 대금 지불 방법을 누르면, 다음 굿즈들의 판매 내역이 기록됩니다.</strong></p>

    <div class="my-4">
      <ul style="list-style-position: inside;">
        <li v-for="order in orders.values()"
            :key="order.id">
          <span class="font-weight-medium">{{ order.what === "combination" ? "[세트]" : "" }} {{ getTargetOriginalInfo(order.id, order.what === "combination").name }}</span>
          <span class="ml-2">{{ order.quantity }}개</span>
          <span v-if="typeof order.price === 'number'" class="ml-2">
            <small><span v-if="order.price === 0">무료 증정</span><span v-else>단가 {{ currencySymbol }}{{ order.price.toLocaleString() }}</span>
            <small> ← <s>{{ currencySymbol }}{{ getTargetOriginalInfo(order.id, order.what === "combination").price.toLocaleString() }}</s></small></small>
          </span>
        </li>
      </ul>

      <p class="mt-2 text-right">총 <strong>{{ currencySymbol }}{{ orderTotalWorth.toLocaleString() }}</strong></p>
    </div>

    <VDivider class="my-4" />

    <div class="d-flex flex-column py-2">
      <VRow v-if="isOrderTotalWorthZero" justify="center" align="start" class="pb-2">
        <p class="text-caption-1 font-weight-light mb-2"><small>※ 합계 금액이 {{ currencySymbol }}0 입니다. 아래 버튼을 눌러 판매 내역 등록을 진행하세요.</small></p>
        <VBtn stacked
              width="150px"
              height="150px"
              color="primary"
              size="large"
              prepend-icon="mdi-check"
              @click="confirmOrder(GoodsOrderPaymentMethod.CASH)">판매 내역 등록</VBtn>
      </VRow>
      <VRow v-else justify="center" align="start">
        <VCol v-for="info in paymentMethodsInfo"
              :key="info.key"
              class="text-center">
          <VBtn stacked
                width="120px"
                height="120px"
                color="primary"
                size="large"
                :prepend-icon="info.icon"
                @click="confirmOrder(info.key)">{{ info.text }}</VBtn>
        </VCol>
      </VRow>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import type { POSOrderList } from "@/pages/subpages/BoothPOSPage.lib";
import { type IGoods, type IGoodsCombination, GoodsOrderPaymentMethod } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { getPaymentMethodIcon, getPaymentMethodString } from "@/lib/enum-to-string";

@Component({
  emits: ["confirm"],
})
export default class POSOrderConfirmDialog extends Vue {
  readonly GoodsOrderPaymentMethod = GoodsOrderPaymentMethod;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, required: true }) orders!: POSOrderList;

  get paymentMethodsInfo() {
    const data = [];
    for(const item of Object.values(GoodsOrderPaymentMethod)) {
      data.push({
        key: item,
        icon: getPaymentMethodIcon(item),
        text: getPaymentMethodString(item),
      });
    }
    return data;
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  get orderTotalWorth(): number {
    return this.orders.values()
      .reduce((acc, order) => (acc + ((order.price ?? this.getTargetOriginalInfo(order.id, order.what === "combination").price) * order.quantity)), 0);
  }

  get isOrderTotalWorthZero(): boolean {
    return this.orderTotalWorth === 0;
  }

  getTargetOriginalInfo(id: number, isCombination: boolean): IGoods | IGoodsCombination {
    return isCombination
      ? useAdminStore().currentBooth.goodsCombinations![id]
      : useAdminStore().currentBooth.goods![id];
  }

  @Emit("confirm")
  confirmOrder(method: GoodsOrderPaymentMethod): GoodsOrderPaymentMethod {
    this.open = false;

    return method;
  }
}
</script>
