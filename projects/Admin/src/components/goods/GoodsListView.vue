<template>
  <div v-for="category in goodsCategoryList"
       :key="category.id"
       class="mt-8">
    <GoodsCategoryTitle :categoryData="category"
                        :editable="editable"
                        @click="onGoodsCategoryClick"
                        @openEditDialog="onGoodsCategoryEdit" />

    <VRow class="justify-start">
      <VSlideYReverseTransition group leave-absolute>
          <GoodsItem v-for="goods in findGoodsInCategory(category.id)"
                     :key="goods.id"
                     :editable="editable"
                     :goodsData="goods"
                     @click="onGoodsClick"
                     @openEditDialog="onGoodsEdit" />
      </VSlideYReverseTransition>
    </VRow>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsCategoryTitle from "./GoodsCategoryTitle.vue";
import GoodsItem from "./GoodsItem.vue";

@Component({
  components: {
    GoodsItem,
    GoodsCategoryTitle,
  },
})
export default class GoodsListView extends Vue {
  @Prop({ type: Boolean, default: false }) editable!: boolean;
  @Prop({ type: Function }) onGoodsCategoryClick!: (categoryId: number) => void;
  @Prop({ type: Function }) onGoodsCategoryEdit!: (categoryId: number) => void;
  @Prop({ type: Function }) onGoodsClick!: (goodsId: number) => void;
  @Prop({ type: Function }) onGoodsEdit!: (goodsId: number) => void;

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
}
</script>
