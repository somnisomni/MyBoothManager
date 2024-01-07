<template>
  <CommonDialog v-model="open"
                width="450px"
                dialogTitle="세트에 포함할 굿즈 선택"
                dialogPrimaryText="확인"
                dialogCancelText=""
                hideCloseButton
                fullscreenOnSmallScreen
                @primary="open = false">
    <SelectableGoodsListView v-model="selectedGoodsIds"
                             :goodsList="goodsList"
                             :goodsImageUrlResolver="getUploadFilePath"
                             :currencySymbol="currencySymbol" />
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import { useAdminStore } from "@/stores/admin";

@Component({})
export default class GoodsSelectionDialog extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Model({ name: "selectedGoodsIds", type: Array }) selectedGoodsIds!: Array<number>;
  @Prop({ type: Number, default: null }) categoryId!: number | null | undefined;

  get goodsList(): Array<IGoods> {
    if(this.categoryId) {
      return Object.values(useAdminStore().boothGoodsList).filter((goods) => goods.categoryId === this.categoryId);
    } else {
      return Object.values(useAdminStore().boothGoodsList).filter((goods) => goods.categoryId === null);
    }
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }
}
</script>
