<template>
  <div v-for="category in goodsCategoryListAdjusted"
       :key="category.id"
       class="my-4 mt-8">
    <!-- Goods Category -->
    <slot name="goods-category"
          :categoryData="category">
      <GoodsCategoryTitle :categoryData="category" />
    </slot>

    <VRow v-if="findGoodsInCategory(category.id).length > 0" class="ma-0 justify-start">
      <!-- Goods Combination and combinated Goods -->
      <VSlideYReverseTransition group leave-absolute>
        <div v-for="combination in findCombinationInCategory(category.id)"
             :key="combination.id"
             class="combination-container my-1 pa-1 d-flex flex-1-0-100 flex-row flex-wrap bg-teal-lighten-5 rounded-lg border-dashed border-sm">
          <!-- Goods Combination -->
          <slot name="goods-combination"
                :goodsData="combination"
                :currencySymbol="currencySymbol"
                @click="onCombinationClick">
            <GoodsItem :goodsData="combination"
                       :currencySymbol="currencySymbol"
                       @click="onCombinationClick" />
          </slot>

          <!-- Combinated Goods -->
          <VSlideYReverseTransition group leave-absolute>
            <slot name="goods"
                  v-for="goods in findGoodsInCombination(combination.id)"
                  :key="goods.id"
                  :goodsData="goods"
                  :currencySymbol="currencySymbol"
                  @click="onGoodsClick">
              <GoodsItem :goodsData="goods"
                         :currencySymbol="currencySymbol"
                         @click="onGoodsClick" />
            </slot>
          </VSlideYReverseTransition>
        </div>
      </VSlideYReverseTransition>

      <!-- Goods (non-combinated only) -->
      <VSlideYReverseTransition group leave-absolute>
        <slot name="goods"
              v-for="goods in findGoodsInCategory(category.id, true)"
              :key="goods.id"
              :goodsData="goods"
              :currencySymbol="currencySymbol"
              @click="onGoodsClick">
          <GoodsItem :goodsData="goods"
                     :currencySymbol="currencySymbol"
                     @click="onGoodsClick" />
        </slot>
      </VSlideYReverseTransition>
    </VRow>
    <h6 v-else class="d-inline-flex align-center text-h6 text-disabled mx-4 my-2"><VIcon class="mr-1">mdi-exclamation</VIcon> 카테고리에 등록된 굿즈가 없습니다.</h6>
  </div>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";
import { Component, Emit, Prop, Vue } from "vue-facing-decorator";
import { Goods, GoodsCombination, type GoodsBase } from "@/entities";

@Component({
  emits: ["click:goods", "click:combination"],
})
export default class GoodsListView extends Vue {
  @Prop({ type: Object, required: true })  readonly goodsList!: Array<GoodsBase>;
  @Prop({ type: Object, required: true })  readonly goodsCategoryList!: Array<IGoodsCategory>;
  @Prop({ type: Boolean, default: false }) readonly omitEmptyGoodsCategory!: boolean;
  @Prop({ type: String, required: true })  readonly currencySymbol!: string;

  get goodsListAdjusted(): Array<Goods> {
    if(!this.goodsList) {
      console.warn("[GoodsListView] goodsList is not provided!");
      return [];
    }

    const list = [...this.goodsList.filter((goods) => goods instanceof Goods)];
    for(const i in list) {
      if(!list[i].categoryId || list[i].categoryId! < 0) {
        list[i].categoryId = -1;
      }
    }

    return list as Array<Goods>;
  }

  get goodsCombinationListAdjusted(): Array<GoodsCombination> {
    if(!this.goodsList) {
      console.warn("[GoodsListView] goodsList is not provided!");
      return [];
    }

    const list = [...this.goodsList.filter((goods) => goods instanceof GoodsCombination)];
    for(const i in list) {
      if(!list[i].categoryId || list[i].categoryId! < 0) {
        list[i].categoryId = -1;
      }
    }

    return list as Array<GoodsCombination>;
  }

  get goodsCategoryListAdjusted(): Array<IGoodsCategory> {
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

    return list as Array<IGoodsCategory>;
  }

  findGoodsInCategory(categoryId: number, nonCombinatedOnly: boolean = false) {
    return this.goodsListAdjusted.filter((goods) => (goods.categoryId === categoryId) && !(nonCombinatedOnly && goods.combinationId));
  }

  findGoodsInCombination(combinationId: number) {
    return this.goodsListAdjusted.filter((goods) => goods.combinationId === combinationId);
  }

  findCombinationInCategory(categoryId: number) {
    return this.goodsCombinationListAdjusted.filter((combination) => combination.categoryId === categoryId);
  }

  @Emit("click:goods") onGoodsClick(goodsId: number) { return goodsId; }
  @Emit("click:combination") onCombinationClick(combinationId: number) { return combinationId; }
}
</script>
