<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <GoodsManagePanel />

    <GoodsListView editable
                   :currencySymbol="currencySymbol"
                   :goodsList="goodsList"
                   :goodsImageUrlResolver="getUploadFilePath"
                   :goodsCategoryList="goodsCategoryList"
                   :goodsCombinationList="goodsCombinationList"
                   forceShowAllGoodsStock
                   @goodsEditRequest="openGoodsEditDialog"
                   @goodsCategoryEditRequest="openGoodsCategoryEditDialog"
                   @combinationEditRequest="openGoodsCombinationEditDialog" />
  </VContainer>

  <GoodsManageDialog v-model="goodsEditDialogOpen"
                     :editMode="true"
                     :goodsId="editDialogGoodsId" />
  <GoodsCategoryManageDialog v-model="goodsCategoryEditDialogOpen"
                             :editMode="true"
                             :categoryId="editDialogCategoryId" />
  <GoodsCombinationManageDialog v-model="goodsCombinationEditDialogOpen"
                                :editMode="true"
                                :combinationId="editDialogCombinationId" />
</template>

<script lang="ts">
import type { IGoods, IGoodsCategory, IGoodsCombination } from "@myboothmanager/common";
import { Vue, Component } from "vue-facing-decorator";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import GoodsCategoryManageDialog from "@/components/dialogs/GoodsCategoryManageDialog.vue";
import GoodsCombinationManageDialog from "@/components/dialogs/GoodsCombinationManageDialog.vue";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";

@Component({
  components: {
    GoodsManagePanel,
    GoodsManageDialog,
    GoodsCategoryManageDialog,
    GoodsCombinationManageDialog,
  },
})
export default class BoothAdminGoodsPage extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  goodsEditDialogOpen = false;
  goodsCategoryEditDialogOpen = false;
  goodsCombinationEditDialogOpen = false;
  editDialogGoodsId: number | null = null;
  editDialogCategoryId: number | null = null;
  editDialogCombinationId: number | null = null;

  get currencySymbol(): string {
    return useAdminStore().currentBooth.booth!.currencySymbol;
  }

  get goodsList(): Array<IGoods> {
    return Object.values(useAdminStore().currentBooth.goods ?? {});
  }

  get goodsCategoryList(): Array<IGoodsCategory> {
    return Object.values(useAdminStore().currentBooth.goodsCategories ?? {});
  }

  get goodsCombinationList(): Array<IGoodsCombination> {
    return Object.values(useAdminStore().currentBooth.goodsCombinations ?? {});
  }

  openGoodsEditDialog(goodsId: number) {
    this.editDialogGoodsId = goodsId;
    this.goodsEditDialogOpen = true;
  }

  openGoodsCombinationEditDialog(combinationId: number) {
    this.editDialogCombinationId = combinationId;
    this.goodsCombinationEditDialogOpen = true;
  }

  openGoodsCategoryEditDialog(categoryId: number) {
    this.editDialogCategoryId = categoryId;
    this.goodsCategoryEditDialogOpen = true;
  }
}
</script>
