<template>
  <CommonDialog v-model="open"
                width="400px"
                dialogTitle="굿즈 판매 정보 세부 설정"
                dialogCancelText="취소"
                dialogLeftButtonText="삭제"
                dialogPrimaryText="확인"
                :onDialogLeftButton="onDialogLeftButton"
                :onDialogPrimary="onDialogPrimary"
                :disablePrimary="!formValid">
    <p class="text-h6 text-center mb-4"><strong>{{ goodsItem.name }}</strong></p>

    <VForm v-model="formValid">
      <VTextField v-model="orderDataCopied.quantity"
                  type="number"
                  min="1"
                  :max="goodsItem.stockRemaining"
                  label="판매 수량"
                  placeholder="기본값 사용"
                  suffix="개"
                  variant="outlined"
                  :hide-details="formValid"
                  class="mx-2"
                  :rules="[(val: number) => (val > 0 && val <= goodsItem.stockRemaining) ? true : '판매 수량은 1개 이상이고 남은 재고 수량보다 적어야 합니다.']"/>
      <VChipGroup v-model="orderDataCopied.quantity"
                  class="d-flex flex-row justify-start"
                  selected-class="text-primary"
                  mandatory>
        <VChip v-for="quantity in quickQuantityChips"
               :key="quantity"
               :value="quantity">{{ quantity }}<small>개</small></VChip>
        <!-- FIXME: chip autoselected by chipgroup model as index value, not actual quantity value-->
      </VChipGroup>

      <VTextField v-model="orderDataCopied.price"
                  type="number"
                  min="0"
                  label="판매 단가 (가격)"
                  hint="비워두면 굿즈의 기본 가격 사용"
                  persistent-hint
                  :placeholder="goodsItem.price"
                  :prefix="currencySymbol"
                  variant="outlined"
                  class="mx-2 mt-6"
                  :rules="[(val: number) => val === undefined || val >= 0 ? true : '판매 단가는 음수일 수 없습니다.']" />
      <VChipGroup v-model="orderDataCopied.price"
                  class="d-flex flex-row justify-start"
                  selected-class="text-primary"
                  mandatory>
        <VChip :value="0">무료 증정</VChip>
      </VChipGroup>
    </VForm>
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import type { IGoodsOrderInternal } from "@/lib/interfaces";
import { Component, Emit, Model, Prop, Vue, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["confirm", "deleteItemRequest"],
})
export default class POSGoodsAdvancedDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: Number, required: true }) goodsId!: number;
  @Prop({ type: Object, required: true }) orderData!: IGoodsOrderInternal;

  readonly quickQuantityChips: Array<number> = [ 1, 2, 3, 5, 10, 20 ];

  formValid: boolean = false;
  orderDataCopied: IGoodsOrderInternal = { ...this.orderData };

  mounted(): void {
    this.orderDataCopied = { ...this.orderData };
  }
  @Watch("open", { immediate: true }) onDialogOpen() { this.orderDataCopied = { ...this.orderData }; }

  get goodsItem(): IGoods {
    return useAdminStore().boothGoodsList[this.goodsId];
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  @Watch("orderDataCopied.price", { immediate: true })
  onOrderDataPriceChange(value: number | string) {
    if(value === "") {
      this.orderDataCopied.price = undefined;
    }
  }

  @Emit("deleteItemRequest")
  onDialogLeftButton(): number {
    this.open = false;
    return this.goodsId;
  }

  @Emit("confirm")
  onDialogPrimary(): IGoodsOrderInternal {
    this.open = false;
    return this.orderDataCopied;
  }
}
</script>
