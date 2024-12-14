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
                             :goodsList="goodsList" />
    <VCheckbox v-model="filterSetting.onlyShowOrdersWithFreeGoods"
               label="무료 증정 굿즈가 포함된 기록만 표시" />

    <h4>결제 수단</h4>
    <VChipGroup v-model="filterSetting.paymentMethods"
                selectedClass="text-primary"
                multiple
                column>
      <VChip v-for="item in paymentMethods"
             :key="item.value"
             :value="item.value">
        <VIcon class="mr-1"
               :icon="item.icon" /> {{ item.label }}
      </VChip>
    </VChipGroup>
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoodsOrderFilterSetting } from "../goods/GoodsOrderListView.vue";
import type { IGoods } from "@myboothmanager/common";
import { GoodsOrderPaymentMethod } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { getPaymentMethodIcon, getPaymentMethodString } from "@/lib/enum-to-string";
import { useAdminStore } from "@/plugins/stores/admin";
import SelectableGoodsListView from "../goods/SelectableGoodsListView.vue";

@Component({
  components: {
    SelectableGoodsListView,
  },
  emits: [ "primary" ],
})
class OrderFilterSettingDialog extends Vue {
  readonly GoodsOrderPaymentMethod = GoodsOrderPaymentMethod;

  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Prop({ type: Object, default: {} }) declare readonly filterSetting: IGoodsOrderFilterSetting;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  get paymentMethods(): Array<{ icon: string; label: string; value: GoodsOrderPaymentMethod }> {
    const data = [];
    for(const item of Object.values(GoodsOrderPaymentMethod)) {
      data.push({
        icon: getPaymentMethodIcon(item),
        label: getPaymentMethodString(item),
        value: item,
      });
    }
    return data;
  }

  get goodsList(): IGoods[] {
    return Object.values(useAdminStore().currentBooth.goods ?? {});
  }

  @Emit("primary")
  onDialogConfirm(): typeof this.filterSetting {
    this.open = false;
    return this.filterSetting;
  }
}

export default toNative(OrderFilterSettingDialog);
</script>
