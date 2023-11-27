<template>
  <div v-for="category in goodsCategoryList"
       :key="category.id"
       class="my-4">
    <GoodsCategoryTitle class="mb-2"
                        :categoryData="category"
                        :editable="editable && category.id !== -1"
                        @click="onGoodsCategoryClick"
                        @editRequest="onGoodsCategoryEditRequest" />

    <VRow class="ma-0 justify-start">
      <VSlideYReverseTransition group leave-absolute>
          <GoodsItem v-for="goods in findGoodsInCategory(category.id)"
                     :key="goods.id"
                     :editable="editable"
                     :goodsData="goods"
                     :currencySymbol="currencySymbol"
                     @click="onGoodsClick"
                     @editRequest="onGoodsEditRequest" />
      </VSlideYReverseTransition>
    </VRow>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["goodsClick", "goodsEditRequest", "goodsCategoryClick", "goodsCategoryEditRequest"],
})
export default class GoodsListView extends Vue {
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  get currencySymbol() {
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

  @Emit("goodsClick") onGoodsClick(goodsId: number) { return goodsId; }
  @Emit("goodsEditRequest") onGoodsEditRequest(goodsId: number) { return goodsId; }
  @Emit("goodsCategoryClick") onGoodsCategoryClick(categoryId: number) { return categoryId; }
  @Emit("goodsCategoryEditRequest") onGoodsCategoryEditRequest(categoryId: number) { return categoryId; }
}
</script>
