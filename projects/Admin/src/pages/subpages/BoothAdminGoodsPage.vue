<template>
  <VContainer class="mt-4">
    <GoodsManagePanel />

    <GoodsListView editable
                   :onGoodsEdit="openGoodsEditDialog"
                   :onGoodsCategoryEdit="openGoodsCategoryEditDialog" />
  </VContainer>

  <GoodsManageDialog v-model="goodsEditDialogOpen"
                     :editMode="true"
                     :goodsId="editDialogGoodsId" />
  <GoodsCategoryManageDialog v-model="goodsCategoryEditDialogOpen"
                             :editMode="true"
                             :categoryId="editDialogCategoryId" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import GoodsCategoryManageDialog from "@/components/dialogs/GoodsCategoryManageDialog.vue";
import GoodsListView from "@/components/goods/GoodsListView.vue";

@Component({
  components: {
    GoodsListView,
    GoodsManagePanel,
    GoodsManageDialog,
    GoodsCategoryManageDialog,
  },
})
export default class BoothAdminGoodsPage extends Vue {
  goodsEditDialogOpen = false;
  goodsCategoryEditDialogOpen = false;
  editDialogGoodsId: number | null = null;
  editDialogCategoryId: number | null = null;

  openGoodsEditDialog(goodsId: number) {
    this.editDialogGoodsId = goodsId;
    this.goodsEditDialogOpen = true;
  }

  openGoodsCategoryEditDialog(categoryId: number) {
    this.editDialogCategoryId = categoryId;
    this.goodsCategoryEditDialogOpen = true;
  }
}
</script>
