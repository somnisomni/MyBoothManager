<template>
  <CommonDialog v-model="open"
                width="400px"
                :dialogTitle="`${targetTypeString} 판매 정보 수정`"
                dialogCancelText="취소"
                dialogLeftButtonText="삭제"
                dialogPrimaryText="확인"
                @leftbutton="onDialogLeftButton"
                @primary="onDialogPrimary"
                :disablePrimary="!formValid">
    <p class="text-h6 text-center mb-4"><strong>{{ isCombination ? "[세트]" : "" }} {{ targetItem.name }}</strong></p>

    <VForm v-model="formValid">
      <VTextField v-model.number="orderDataCopied.quantity"
                  type="number"
                  min="1"
                  :max="targetItemMaxQuantity"
                  label="판매 수량"
                  placeholder="기본값 사용"
                  suffix="개"
                  variant="outlined"
                  :hide-details="formValid"
                  class="mx-2 text-right"
                  :rules="[(val: number) => (val > 0 && val <= targetItemMaxQuantity) ? true : '판매 수량은 1개 이상이고 남은 재고 수량보다 적어야 합니다.']"
                  @change="orderDataCopied.quantity = Math.floor(new Number(orderDataCopied.quantity).valueOf())" />
      <VChipGroup v-model.number="orderDataCopied.quantity"
                  class="d-flex flex-row justify-start"
                  selected-class="text-primary"
                  mandatory>
        <VChip v-for="quantity in [1, 2, 3, 4, 5, 10]"
               :key="quantity"
               :value="quantity">
          <span>{{ quantity }}<small>개</small></span>
        </VChip>
      </VChipGroup>

      <VTextField v-model.number="orderDataCopied.price"
                  type="number"
                  min="0"
                  :step="priceStep"
                  label="판매 단가 (가격)"
                  :hint="`비워두면 ${targetTypeString}의 기본 가격 사용`"
                  persistent-hint
                  clearable
                  :placeholder="targetItem.price.toLocaleString()"
                  :prefix="currencySymbol"
                  variant="outlined"
                  class="mx-2 mt-6"
                  :rules="[(val: number) => val === undefined || val >= 0 ? true : '판매 단가는 음수일 수 없습니다.']"
                  @change="orderDataCopied.price = new Number(new Number(orderDataCopied.price).toFixed(3)).valueOf()" />
      <VChipGroup v-model="orderDataCopied.price"
                  class="d-flex flex-row justify-start"
                  selected-class="text-primary">
        <VChip :value="0"><VIcon size="small" class="mr-2">mdi-gift</VIcon> 무료 증정</VChip>
      </VChipGroup>
    </VForm>
  </CommonDialog>
</template>

<script lang="ts">
import { currencySymbolInfo } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, Vue, Watch } from "vue-facing-decorator";
import deepClone from "clone-deep";
import { POSOrderSimulationLayer, type IGoodsOrderInternal } from "@/pages/subpages/BoothPOSPage.lib";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["confirm", "deleteRequest"],
})
export default class POSGoodsAdvancedDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: Object, required: true }) orderData!: IGoodsOrderInternal;
  @Prop({ type: POSOrderSimulationLayer, required: true }) currentOrderSimulationLayer!: POSOrderSimulationLayer;
  @Prop({ type: Boolean, default: undefined }) isCombination?: true;

  formValid: boolean = false;
  orderDataCopied: IGoodsOrderInternal = deepClone(this.orderData);

  @Watch("open") mounted() {
    this.orderDataCopied = deepClone(this.orderData);
  }

  get targetTypeString(): string {
    return this.isCombination ? "세트" : "굿즈";
  }

  get targetItem() {
    return this.isCombination
      ? useAdminStore().currentBooth.goodsCombinations![this.orderData.id]
      : useAdminStore().currentBooth.goods![this.orderData.id];
  }

  get targetItemMaxQuantity(): number {
    return this.currentOrderSimulationLayer.getMaxAvailableQuantity(this.isCombination ? "combination" : "goods", this.orderData.id);
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  get priceStep(): number {
    switch(this.currencySymbol) {
      case currencySymbolInfo["KRW"].symbol:
        return 1000;
      case currencySymbolInfo["JPY"].symbol:
        return 100;
      default:
        return 1;
    }
  }

  @Watch("orderDataCopied.price")
  onOrderDataPriceChange(value: number | string) {
    if(value === "") {
      this.orderDataCopied.price = undefined;
    }
  }

  @Emit("deleteRequest")
  onDialogLeftButton() {
    this.open = false;
    return {
      id: this.orderData.id,
      isCombination: this.isCombination,
    };
  }

  @Emit("confirm")
  onDialogPrimary() {
    this.open = false;
    return {
      id: this.orderData.id,
      isCombination: this.isCombination,
      newOrderData: this.orderDataCopied,
    };
  }
}
</script>
