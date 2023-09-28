<template>
  <VContainer class="mt-4">
    <GoodsManagePanel />

    <div v-for="category in goodsCategoryList"
         :key="category.id"
         class="mt-8">
      <GoodsCategoryTitle :categoryData="category"
                          @openEditDialog="openGoodsCategoryEditDialog" />

      <VRow class="justify-start">
        <GoodsItem v-for="goods in findGoodsInCategory(category.id)"
                  :key="goods.id"
                  :goodsData="goods"
                  :currencySymbol="boothCurrencySymbol"
                  @openEditDialog="openGoodsEditDialog" />
      </VRow>
    </div>
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
import { useAdminStore } from "@/stores/admin";
import GoodsItem from "@/components/goods/GoodsItem.vue";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsCategoryTitle from "@/components/goods/GoodsCategoryTitle.vue";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import GoodsCategoryManageDialog from "@/components/dialogs/GoodsCategoryManageDialog.vue";

@Component({
  components: {
    GoodsItem,
    GoodsCategoryTitle,
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

  get boothCurrencySymbol() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get goodsCategoryList() {
    const list = Object.values(useAdminStore().boothGoodsCategoryList);
    list.push({ boothId: -1, id: -1, name: "미분류" });

    return list;
  }

  get goodsList() {
    const list = useAdminStore().boothGoodsList;
    for(const i in list) {
      if(!list[i].categoryId || list[i].categoryId! < 0) {
        list[i].categoryId = -1;
      }
    }

    return list;
  }

  findGoodsInCategory(categoryId: number) {
    return Object.values(this.goodsList).filter((goods) => goods.categoryId === categoryId);
  }

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
