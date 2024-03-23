<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <GoodsManagePanel />

    <GoodsListView categoryEditable
                   :currencySymbol="currencySymbol"
                   :goodsList="goodsList"
                   :goodsImageUrlResolver="getUploadFilePath"
                   :goodsCategoryList="goodsCategoryList"
                   :goodsCombinationList="goodsCombinationList">
      <template #goods-category="props">
        <GoodsCategoryTitleManageable v-bind="props"
                                      @click="openGoodsCategoryEditDialog((props.categoryData as IGoodsCategory).id)" />
      </template>
      <template #goods="props">
        <GoodsItemManageable v-bind="props"
                             @click="openGoodsEditDialog"
                             @menu:duplicate="openGoodsCreateDialogWithDuplication((props as GoodsItemProps).goodsData!.id)"
                             @menu:delete="openDeleteDialog(false, (props as GoodsItemProps).goodsData!.id)" />
      </template>
      <template #goods-combination="props">
        <GoodsItemManageable v-bind="props"
                             @click="openGoodsCombinationEditDialog"
                             @menu:duplicate="openGoodsCreateDialogWithDuplication((props as GoodsItemProps).goodsData!.id)"
                             @menu:delete="openDeleteDialog(true, (props as GoodsItemProps).combinationData!.id)" />
      </template>
    </GoodsListView>
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
  <ItemDeleteWarningDialog v-model="deleteDialogOpen"
                           @primary="confirmDelete(deleteDialogTarget)" />
</template>

<script lang="ts">
import type { IGoods, IGoodsCategory, IGoodsCombination } from "@myboothmanager/common";
import type { GoodsItemProps } from "@myboothmanager/common-ui";  // eslint-disable-line @typescript-eslint/no-unused-vars
import { Vue, Component } from "vue-facing-decorator";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import GoodsCategoryManageDialog from "@/components/dialogs/GoodsCategoryManageDialog.vue";
import GoodsCombinationManageDialog from "@/components/dialogs/GoodsCombinationManageDialog.vue";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";
import GoodsItemManageable from "@/components/goods/GoodsItemManageable.vue";
import ItemDeleteWarningDialog from "@/components/dialogs/common/ItemDeleteWarningDialog.vue";
import GoodsCategoryTitleManageable from "@/components/goods/GoodsCategoryTitleManageable.vue";

@Component({
  components: {
    GoodsManagePanel,
    GoodsManageDialog,
    GoodsCategoryManageDialog,
    GoodsCombinationManageDialog,
    ItemDeleteWarningDialog,
    GoodsItemManageable,
    GoodsCategoryTitleManageable,
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
  deleteDialogOpen = false;
  deleteDialogTarget: { isCombination: boolean, id: number } | null = null;

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

  openGoodsCreateDialogWithDuplication(targetGoodsId: number) {
    alert("WIP: dry duplicate target goods #" + targetGoodsId);
  }

  openDeleteDialog(isCombination: boolean, id: number) {
    this.deleteDialogTarget = { isCombination, id };
    this.deleteDialogOpen = true;
  }

  confirmDelete(target: typeof this.deleteDialogTarget) {
    if(target) {
      if(target.isCombination) {
        alert("WIP: dry delete combination #" + target.id);
      } else {
        alert("WIP: dry delete goods #" + target.id);
      }
    }
  }
}
</script>
