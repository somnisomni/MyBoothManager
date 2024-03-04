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
        <p class="text-caption-1 font-weight-light mb-2"><small>※ 합계 금액이 0원입니다. 아래 버튼을 눌러 판매 내역 등록을 진행하세요.</small></p>
        <VBtn stacked
              width="150px"
              height="150px"
              color="primary"
              size="large"
              prepend-icon="mdi-check"
              @click="confirmOrder('cash')">판매 내역 등록</VBtn>
      </VRow>
      <VRow v-else justify="center" align="start">
        <VCol v-for="(info, key) in paymentMethodsInfo"
              :key="key"
              class="text-center">
          <VBtn stacked
                width="120px"
                height="120px"
                color="primary"
                size="large"
                :prepend-icon="info.icon"
                @click="confirmOrder(key)">{{ info.text }}</VBtn>
        </VCol>
      </VRow>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods, IGoodsCombination } from "@myboothmanager/common";
import type { POSOrderList } from "@/pages/subpages/BoothPOSPage.lib";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

type OrderPaymentMethod = "cash" | "account" | "card" | "prepaid";

@Component({
  emits: ["confirm"],
})
export default class POSOrderConfirmDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, required: true }) orders!: POSOrderList;

  readonly paymentMethodsInfo: Record<OrderPaymentMethod, any> = {
    cash: {
      icon: "mdi-cash-multiple",
      text: "현금",
    },
    account: {
      icon: "mdi-account-cash",
      text: "계좌 · QR 입금",
    },
    card: {
      icon: "mdi-credit-card",
      text: "신용 · 체크 카드",
    },
    prepaid: {
      icon: "mdi-cash-fast",
      text: "사전 지불 (선입금 등)",
    },
  };

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
  confirmOrder(method: OrderPaymentMethod): OrderPaymentMethod {
    this.open = false;

    return method;
  }
}
</script>
