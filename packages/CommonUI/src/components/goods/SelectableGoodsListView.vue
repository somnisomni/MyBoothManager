<template>
  <div>
    <VRow class="ma-0 justify-start">
      <GoodsItem v-for="goods in goodsList"
                 v-model="selectedGoods[goods.id]"
                 :key="goods.id"
                 :selectable="true"
                 :goodsData="goods"
                 :representativeImageUrl="goodsImageUrlResolver(goods.goodsImageUrl)"
                 :forceSmallSize="true"
                 :showNameOnly="true"
                 :currencySymbol="currencySymbol" />
    </VRow>
  </div>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import { Component, Model, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({})
export default class SelectableGoodsListView extends Vue {
  @Model({ type: Array, default: [] }) selectedGoodsIds!: Array<number>;
  @Prop({ type: Object, required: true }) goodsList!: Array<IGoods>;
  @Prop({ type: Function, default: (s: any) => s }) goodsImageUrlResolver!: (rawGoodsImageUrl?: string) => string | null | undefined;
  @Prop({ type: String, required: true })  currencySymbol!: string;

  selectedGoods: Record<number, boolean> = {};

  mounted() {
    this.selectedGoodsIds.forEach((id) => {
      this.selectedGoods[id] = true;
    });
  }

  @Watch("selectedGoods", { deep: true })
  onSelectedGoodsChange() {
    const temp: Array<number> = [];

    Object.entries(this.selectedGoods).forEach(([id, hasSelected]) => {
      if(hasSelected) temp.push(Number(id));
    });

    this.selectedGoodsIds.splice(0, this.selectedGoodsIds.length, ...temp);
  }
}
</script>
