<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <GoodsManagePanel />

    <GoodsListView :currencySymbol="currencySymbol"
                   :goodsList="goodsList"
                   :goodsCategoryList="goodsCategoryList">
      <template #goods-category="props">
        <GoodsCategoryTitleManageable v-if="!isBoothClosed"
                                      v-bind="props"
                                      @click="openGoodsCategoryEditDialog((props.categoryData as IGoodsCategory).id)" />
        <GoodsCategoryTitle v-else
                            v-bind="props"
                            style="cursor: default;" />
      </template>
      <template #goods="props">
        <GoodsItemManageable v-if="!isBoothClosed"
                             v-bind="props"
                             @click="openGoodsManageDialog"
                             @menu:edit="openGoodsManageDialog"
                             @menu:duplicate="openGoodsCreateDialogWithDuplication((props as GoodsItemProps).goodsData!.id)"
                             @menu:delete="openDeleteDialog(false, (props as GoodsItemProps).goodsData!.id)" />
        <GoodsItem v-else
                   v-bind="props"
                   style="cursor: default;"
                   :forceStockVisibility="GoodsStockVisibility.SHOW_ALL" />
      </template>
      <template #goods-combination="props">
        <GoodsItemManageable v-if="!isBoothClosed"
                             v-bind="props"
                             @click="openGoodsCombinationManageDialog"
                             @menu:edit="openGoodsCombinationManageDialog"
                             @menu:duplicate="openGoodsCombinationCreateDialogWithDuplication((props as GoodsItemProps).goodsData!.id)"
                             @menu:delete="openDeleteDialog(true, (props as GoodsItemProps).goodsData!.id)" />
        <GoodsItem v-else
                   v-bind="props"
                   style="cursor: default;"
                   :forceStockVisibility="GoodsStockVisibility.SHOW_ALL" />
      </template>
    </GoodsListView>
  </VContainer>

  <GoodsManageDialog v-model="goodsManageDialogOpen"
                     :editMode="!goodsManageDialogDuplicateMode"
                     :duplicate="goodsManageDialogDuplicateMode"
                     :goodsId="manageDialogGoodsId" />
  <GoodsCategoryManageDialog v-model="goodsCategoryEditDialogOpen"
                             editMode
                             :categoryId="editDialogCategoryId" />
  <GoodsCombinationManageDialog v-model="goodsCombinationManageDialogOpen"
                                :editMode="!goodsCombinationManageDialogDuplicateMode"
                                :duplicate="goodsCombinationManageDialogDuplicateMode"
                                :combinationId="manageDialogCombinationId" />
  <ItemDeleteWarningDialog v-model="deleteDialogOpen"
                           @primary="confirmDelete(deleteDialogTarget)" />
</template>

<script lang="ts">
import type { Goods, GoodsCombination, GoodsItemProps } from "@myboothmanager/common-ui";  // eslint-disable-line @typescript-eslint/no-unused-vars
import { BoothStatus, GoodsStockVisibility, type ErrorCodes, type IGoodsCategory } from "@myboothmanager/common";
import { Vue, Component, toNative, Setup } from "vue-facing-decorator";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import GoodsCategoryManageDialog from "@/components/dialogs/GoodsCategoryManageDialog.vue";
import GoodsCombinationManageDialog from "@/components/dialogs/GoodsCombinationManageDialog.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import GoodsItemManageable from "@/components/goods/GoodsItemManageable.vue";
import ItemDeleteWarningDialog from "@/components/dialogs/common/ItemDeleteWarningDialog.vue";
import GoodsCategoryTitleManageable from "@/components/goods/GoodsCategoryTitleManageable.vue";
import { useAdminAPIStore } from "@/plugins/stores/api";

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
class GoodsPage extends Vue {
  readonly GoodsStockVisibility = GoodsStockVisibility;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  goodsManageDialogOpen = false;
  goodsManageDialogDuplicateMode = false;
  manageDialogGoodsId: number | null = null;

  goodsCombinationManageDialogOpen = false;
  goodsCombinationManageDialogDuplicateMode = false;
  manageDialogCombinationId: number | null = null;

  goodsCategoryEditDialogOpen = false;
  editDialogCategoryId: number | null = null;
  deleteDialogOpen = false;
  deleteDialogTarget: { isCombination: boolean, id: number } | null = null;

  get isBoothClosed(): boolean {
    return useAdminStore().currentBooth.booth!.status.status === BoothStatus.CLOSE;
  }

  get goodsList(): Array<Goods | GoodsCombination> {
    return [
      ...Object.values(useAdminStore().currentBooth.goods ?? {}),
      ...Object.values(useAdminStore().currentBooth.goodsCombinations ?? {}),
    ];
  }

  get goodsCategoryList(): Array<IGoodsCategory> {
    return Object.values(useAdminStore().currentBooth.goodsCategories ?? {});
  }

  openGoodsManageDialog(goodsId: number) {
    if(this.isBoothClosed) return;

    this.manageDialogGoodsId = goodsId;
    this.goodsManageDialogDuplicateMode = false;
    this.goodsManageDialogOpen = true;
  }

  openGoodsCombinationManageDialog(combinationId: number) {
    if(this.isBoothClosed) return;

    this.manageDialogCombinationId = combinationId;
    this.goodsCombinationManageDialogDuplicateMode = false;
    this.goodsCombinationManageDialogOpen = true;
  }

  openGoodsCategoryEditDialog(categoryId: number) {
    if(this.isBoothClosed) return;
    if(categoryId < 0) return;

    this.editDialogCategoryId = categoryId;
    this.goodsCategoryEditDialogOpen = true;
  }

  openGoodsCreateDialogWithDuplication(targetGoodsId: number) {
    if(this.isBoothClosed) return;

    this.openGoodsManageDialog(targetGoodsId);
    this.goodsManageDialogDuplicateMode = true;
  }

  openGoodsCombinationCreateDialogWithDuplication(targetCombinationId: number) {
    if(this.isBoothClosed) return;

    this.openGoodsCombinationManageDialog(targetCombinationId);
    this.goodsCombinationManageDialogDuplicateMode = true;
  }

  openDeleteDialog(isCombination: boolean, id: number) {
    if(this.isBoothClosed) return;

    this.deleteDialogTarget = { isCombination, id };
    this.deleteDialogOpen = true;
  }

  async confirmDelete(target: typeof this.deleteDialogTarget) {
    if(!target) return;

    let response: true | ErrorCodes;

    if(target.isCombination) {
      response = await useAdminAPIStore().deleteGoodsCombination(target.id);
    } else {
      response = await useAdminAPIStore().deleteGoods(target.id);
    }

    if(typeof response === "boolean" && response === true) {
      this.deleteDialogOpen = false;
    }
  }
}

export default toNative(GoodsPage);
</script>
