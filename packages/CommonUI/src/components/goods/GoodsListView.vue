<template>
  <div v-for="category in goodsCategoryListAdjusted"
       :key="category.id"
       class="my-4 mt-8">
    <GoodsCategoryTitle :categoryData="category"
                        :editable="editable && category.id !== -1"
                        @click="onGoodsCategoryClick"
                        @editRequest="onGoodsCategoryEditRequest" />

    <VRow v-if="findGoodsInCategory(category.id).length > 0" class="ma-0 justify-start">
      <VSlideYReverseTransition group leave-absolute>
        <GoodsItem v-for="combination in findCombinationInCategory(category.id)"
                   :key="combination.id"
                   :editable="editable"
                   :combinationData="combination"
                   :currencySymbol="currencySymbol"
                   @click="onCombinationClick"
                   @editRequest="onCombinationEditRequest" />
      </VSlideYReverseTransition>

      <VSlideYReverseTransition group leave-absolute>
        <GoodsItem v-for="goods in findGoodsInCategory(category.id)"
                   :key="goods.id"
                   :editable="editable"
                   :goodsData="goods"
                   :representativeImageUrl="goodsImageUrlResolver(goods.goodsImageUrl)"
                   :currencySymbol="currencySymbol"
                   @click="onGoodsClick"
                   @editRequest="onGoodsEditRequest" />
      </VSlideYReverseTransition>
    </VRow>
    <h6 v-else class="d-inline-flex align-center text-h6 text-disabled mx-4 my-2"><VIcon class="mr-1">mdi-exclamation</VIcon> 카테고리에 등록된 굿즈가 없습니다.</h6>
  </div>
</template>

<script lang="ts">
import type { IGoods, IGoodsCategory, IGoodsCombination } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["goodsClick", "goodsEditRequest", "combinationClick", "combinationEditRequest", "goodsCategoryClick", "goodsCategoryEditRequest"],
})
export default class GoodsListView extends Vue {
  @Prop({ type: Object, required: true })  readonly goodsList!: Array<IGoods>;
  @Prop({ type: Object, required: true })  readonly goodsCategoryList!: Array<IGoodsCategory>;
  @Prop({ type: Object, required: true })  readonly goodsCombinationList!: Array<IGoodsCombination>;
  @Prop({ type: Function, default: (s: any) => s }) readonly goodsImageUrlResolver!: (rawGoodsImageUrl?: string) => string | null | undefined;
  @Prop({ type: Boolean, default: false }) readonly omitEmptyGoodsCategory!: boolean;
  @Prop({ type: String, required: true })  readonly currencySymbol!: string;
  @Prop({ type: Boolean, default: false }) readonly editable!: boolean;

  get goodsListAdjusted() {
    if(!this.goodsList) {
      console.warn("[GoodsListView] goodsList is not provided!");
      return [];
    }

    const list = [...this.goodsList];
    for(const i in list) {
      if(!list[i].categoryId || list[i].categoryId! < 0) {
        list[i].categoryId = -1;
      }
    }

    return list;
  }

  get goodsCategoryListAdjusted() {
    if(!this.goodsCategoryList) {
      console.warn("[GoodsListView] goodsCategoryList is not provided!");
      return [];
    }

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

  get goodsCombinationListAdjusted() {
    if(!this.goodsCombinationList) {
      console.warn("[GoodsListView] goodsCombinationList is not provided!");
      return [];
    }

    const list = [...this.goodsCombinationList];
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

  findCombinationInCategory(categoryId: number) {
    return this.goodsCombinationListAdjusted.filter((combination) => combination.categoryId === categoryId);
  }

  @Emit("goodsClick") onGoodsClick(goodsId: number) { return goodsId; }
  @Emit("goodsEditRequest") onGoodsEditRequest(goodsId: number) { return goodsId; }
  @Emit("combinationClick") onCombinationClick(combinationId: number) { return combinationId; }
  @Emit("combinationEditRequest") onCombinationEditRequest(combinationId: number) { return combinationId; }
  @Emit("goodsCategoryClick") onGoodsCategoryClick(categoryId: number) { return categoryId; }
  @Emit("goodsCategoryEditRequest") onGoodsCategoryEditRequest(categoryId: number) { return categoryId; }
}
</script>
