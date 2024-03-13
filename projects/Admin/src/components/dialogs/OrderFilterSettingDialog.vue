<template>
  <CommonDialog v-model="open"
                width="600px"
                dialogTitle="필터 설정"
                dialogPrimaryText="확인"
                dialogCancelText="취소"
                hideCloseButton
                fullscreenOnSmallScreen
                @primary="onDialogConfirm">
    <SelectableGoodsListView v-model="filterSetting.targetGoodsIds"
                             :goodsList="goodsList"
                             :goodsImageUrlResolver="getUploadFilePath"
                             :currencySymbol="currencySymbol" />
    <VCheckbox v-model="filterSetting.onlyShowOrdersWithFreeGoods"
               label="무료 증정 굿즈가 포함된 기록만 표시" />
    <VSelect v-model="filterSetting.paymentMethod"
             :items="paymentMethods"
             label="결제 수단"
             item-title="label"
             item-value="value"
             clearable />
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoodsOrderFilterSetting } from "../goods/GoodsOrderListView.vue";
import { GoodsOrderPaymentMethod, type IGoods } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import { useAdminStore } from "@/stores/admin";
import { getPaymentMethodString } from "@/lib/enum-to-string";

@Component({
  emits: ["primary"],
})
export default class OrderFilterSettingDialog extends Vue {
  readonly GoodsOrderPaymentMethod = GoodsOrderPaymentMethod;
  readonly getUploadFilePath = getUploadFilePath;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, default: {} }) filterSetting!: IGoodsOrderFilterSetting;

  get paymentMethods() {
    const data = [];
    for(const item of Object.values(GoodsOrderPaymentMethod)) {
      data.push({
        label: getPaymentMethodString(item),
        value: item,
      });
    }
    return data;
  }

  get goodsList(): Array<IGoods> {
    return Object.values(useAdminStore().currentBooth.goods ?? {});
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  @Emit("primary")
  onDialogConfirm() {
    this.open = false;
    return this.filterSetting;
  }
}
</script>
