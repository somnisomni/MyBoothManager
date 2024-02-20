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
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import type { IGoodsOrderFilterSetting } from "../goods/GoodsOrderListView.vue";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["primary"],
})
export default class OrderFilterSettingDialog extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Object, default: {} }) filterSetting!: IGoodsOrderFilterSetting;

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
