<template>
  <CommonDialog v-model="open"
                width="500px"
                dialogTitle="판매 내역 확인"
                dialogPrimaryText="확인"
                dialogCancelText="취소"
                :onDialogPrimary="onDialogPrimary">
    <p><strong>다음 굿즈들의 판매 내역을 기록합니다.</strong></p>

    <div class="mt-2">
      <ul style="list-style-position: inside;">
        <li v-for="order in orders"
            :key="order.goodsId">
          <span class="font-weight-medium">{{ getGoodsInfo(order.goodsId).name }}</span>
          <span class="ml-2">{{ order.quantity }}개</span>
        </li>
      </ul>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class POSOrderConfirmDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, required: true }) orders!: Record<number, IGoodsOrderInternal>;

  getGoodsInfo(goodsId: number): IGoods {
    return useAdminStore().boothGoodsList[goodsId];
  }

  @Emit("confirm")
  onDialogPrimary() {
    this.open = false;
  }
}
</script>
