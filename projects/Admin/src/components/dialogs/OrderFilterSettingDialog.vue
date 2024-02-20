<template>
  <CommonDialog v-model="open"
                width="600px"
                dialogTitle="필터 설정"
                dialogPrimaryText="확인"
                dialogCancelText="취소"
                hideCloseButton
                fullscreenOnSmallScreen
                @primary="onDialogConfirm">
    <SelectableGoodsListView v-model="selectedGoodsIds"
                             :goodsList="goodsList"
                             :goodsImageUrlResolver="getUploadFilePath"
                             :currencySymbol="currencySymbol" />
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import { Component, Emit, Model, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["primary"],
})
export default class OrderFilterSettingDialog extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Array, default: [] }) selectedGoodsIds!: Array<number>;

  get goodsList(): Array<IGoods> {
    return Object.values(useAdminStore().currentBooth.goods ?? {});
  }

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  @Emit("primary")
  onDialogConfirm() {
    this.open = false;
    return this.selectedGoodsIds;
  }
}
</script>
