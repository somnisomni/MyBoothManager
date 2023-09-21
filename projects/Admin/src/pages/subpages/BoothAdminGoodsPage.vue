<template>
  <VContainer class="mt-4">
    <GoodsManagePanel />

    <div v-for="category in goodsCategoryList"
         :key="category.id"
         class="mt-8">
      <h2 class="text-2xl font-bold mb-4">{{ category.name }}</h2>

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
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsItem from "@/components/goods/GoodsItem.vue";
import GoodsManagePanel from "@/components/goods/GoodsManagePanel.vue";
import GoodsManageDialog from "@/components/goods/GoodsManageDialog.vue";

@Component({
  components: {
    GoodsItem,
    GoodsManagePanel,
    GoodsManageDialog,
  },
})
export default class BoothAdminGoodsPage extends Vue {
  goodsEditDialogOpen = false;
  editDialogGoodsId: number | null = null;

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
    this.goodsEditDialogOpen = true;
    this.editDialogGoodsId = goodsId;
  }
}
</script>
