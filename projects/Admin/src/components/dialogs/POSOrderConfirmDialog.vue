<template>
  <CommonDialog v-model="open"
                width="500px"
                dialogTitle="판매 내역 확인"
                dialogPrimaryText="확인"
                dialogCancelText="취소"
                @primary="onDialogPrimary">
    <p><strong>다음 굿즈들의 판매 내역을 기록합니다.</strong></p>

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
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods, IGoodsCombination } from "@myboothmanager/common";
import type { POSOrderList } from "@/pages/subpages/BoothPOSPage.lib";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["confirm"],
})
export default class POSOrderConfirmDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, required: true }) orders!: POSOrderList;

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  getTargetOriginalInfo(id: number, isCombination: boolean): IGoods | IGoodsCombination {
    return isCombination
      ? useAdminStore().currentBooth.goodsCombinations![id]
      : useAdminStore().currentBooth.goods![id];
  }

  @Emit("confirm")
  onDialogPrimary(): void {
    this.open = false;
  }
}
</script>
