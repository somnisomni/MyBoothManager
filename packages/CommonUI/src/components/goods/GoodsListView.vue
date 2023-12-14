<template>
  <div v-for="category in goodsCategoryListAdjusted"
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
                     :goodsImageUrl="goodsImageUrlResolver(goods.goodsImageUrl)"
                     :currencySymbol="currencySymbol"
                     @click="onGoodsClick"
                     @editRequest="onGoodsEditRequest" />
      </VSlideYReverseTransition>
    </VRow>
  </div>
</template>

<script lang="ts">
import type { IGoods, IGoodsCategory } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["goodsClick", "goodsEditRequest", "goodsCategoryClick", "goodsCategoryEditRequest"],
})
export default class GoodsListView extends Vue {
  @Prop({ type: Object, required: true })  goodsList!: Array<IGoods>;
  @Prop({ type: Object, required: true })  goodsCategoryList!: Array<IGoodsCategory>;
  @Prop({ type: Function, default: (s: any) => s }) goodsImageUrlResolver!: (rawGoodsImageUrl?: string) => string | null | undefined;
  @Prop({ type: Boolean, default: false }) omitEmptyGoodsCategory!: boolean;
  @Prop({ type: String, required: true })  currencySymbol!: string;
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  get goodsCategoryListAdjusted() {
    const checkFn = (categoryId: number) => !this.omitEmptyGoodsCategory || this.findGoodsInCategory(categoryId).length > 0;
    const list = [];

    for(const category of this.goodsCategoryList) {
      if(checkFn(category.id)) {
        list.push(category);
      }
    }

    if(checkFn(-1)) {
      list.push({ boothId: -1, id: -1, name: "미분류" });
    }

    return list;
  }

  get goodsListAdjusted() {
    const list = [...this.goodsList];
    for(const i in list) {
      if(!list[i].categoryId || list[i].categoryId! < 0) {
        list[i].categoryId = -1;
      }
    }

    return list;
  }

  findGoodsInCategory(categoryId: number) {
    return this.goodsListAdjusted.filter((goods) => goods.categoryId === categoryId);
  }

  @Emit("goodsClick") onGoodsClick(goodsId: number) { return goodsId; }
  @Emit("goodsEditRequest") onGoodsEditRequest(goodsId: number) { return goodsId; }
  @Emit("goodsCategoryClick") onGoodsCategoryClick(categoryId: number) { return categoryId; }
  @Emit("goodsCategoryEditRequest") onGoodsCategoryEditRequest(categoryId: number) { return categoryId; }
}
</script>
