<template>
  <div>
    <VRow class="ma-0 justify-start">
      <GoodsItemSelectable v-for="goods in goodsList"
                           v-model="selectedGoods[goods.id]"
                           :key="goods.id"
                           :goodsData="goods"
                           :imageUrlResolver="getUploadFilePath"
                           :disabled="goodsDisabledIdList.includes(goods.id)"
                           disabledReason="이미 다른 세트에 포함됨" />
    </VRow>
  </div>
</template>

<script lang="ts">
import type { Goods } from "@myboothmanager/common-ui";
import { Component, Model, Prop, Vue, Watch } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import GoodsItemSelectable from "./GoodsItemSelectable.vue";

@Component({
  components: {
    GoodsItemSelectable,
  },
})
export default class SelectableGoodsListView extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  @Model({ type: Array, default: [] }) selectedGoodsIds!: Array<number>;
  @Prop({ type: Array, required: true }) readonly goodsList!: Array<Goods>;
  @Prop({ type: Array,  default: []   }) readonly goodsDisabledIdList!: Array<number>;

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
