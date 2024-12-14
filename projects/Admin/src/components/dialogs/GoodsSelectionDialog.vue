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
                             :goodsDisabledIdList="disabledIdList" />
  </CommonDialog>
</template>

<script lang="ts">
import type { Goods } from "@myboothmanager/common-ui";
import { Component, Model, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import SelectableGoodsListView from "@/components/goods/SelectableGoodsListView.vue";
import { getUploadFileUrl } from "@/lib/functions";
import { useAdminStore } from "@/plugins/stores/admin";

@Component({
  components: {
    SelectableGoodsListView,
  },
})
class GoodsSelectionDialog extends Vue {
  readonly getUploadFileUrl = getUploadFileUrl;

  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Model({ name: "selectedGoodsIds", type: Array }) declare selectedGoodsIds: number[];
  @Prop({ type: Array, default: [] }) declare readonly disabledIdList: number[];
  @Prop({ type: Number, default: null }) declare readonly categoryId: number | null | undefined;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  get goodsList(): Goods[] {
    if(this.categoryId) {
      return Object.values(useAdminStore().currentBooth.goods ?? {}).filter(goods => goods.categoryId === this.categoryId);
    } else {
      return Object.values(useAdminStore().currentBooth.goods ?? {}).filter(goods => goods.categoryId === null);
    }
  }
}

export default toNative(GoodsSelectionDialog);
</script>
