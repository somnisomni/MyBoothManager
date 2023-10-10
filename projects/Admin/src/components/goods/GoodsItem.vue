<template>
  <VSheet class="goods-item no-selection d-flex ma-4"
          :class="{ 'edit': editMode }"
          width="200"
          height="250"
          rounded="lg"
          v-ripple
          :elevation="elevation"
          @pointerenter="elevation = ELEVATION_HOVER"
          @pointerleave="elevation = ELEVATION_NORMAL"
          @click.stop="onItemClick">
    <VImg class="goods-image" :src="'https://picsum.photos/seed/' + goodsData.id + '/200/250'" aspect-ratio="1/1" />
    <div class="goods-image-overlay"></div>

    <div v-if="editMode" class="click-to-edit-text">클릭하여 수정</div>

    <VLayout class="goods-info d-flex flex-column align-self-end pa-2">
      <div class="name">{{ goodsData.name }}</div>

      <VLayout class="d-flex flex-row justify-space-between">
        <div>{{ currencySymbol }}{{ goodsData.price.toLocaleString() }}</div>
        <div><span class="goods-stock-current">{{ goodsData.stockRemaining }}</span> <span class="goods-stock-initial">/ {{ goodsData.stockInitial }}</span></div>
      </VLayout>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import { Vue, Component, Prop, Emit } from "vue-facing-decorator";

@Component({
  emits: ["click", "openEditDialog"],
})
export default class GoodsItem extends Vue {
  @Prop({ required: true }) goodsData!: IGoods;
  @Prop({ default: "₩", required: true }) currencySymbol!: string;
  @Prop({ default: true }) editMode!: boolean;

  readonly ELEVATION_NORMAL = 2;
  readonly ELEVATION_HOVER = 6;
  elevation = this.ELEVATION_NORMAL;

  @Emit("click")
  onItemClick() {
    if(this.editMode) this.$emit("openEditDialog", this.goodsData.id);
    return this.goodsData.id;
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.25s ease-in-out;

  &.edit:hover {
    transform: translateY(-5%);
  }

  .click-to-edit-text {
    $top-position: 16px;

    position: absolute;
    color: white;
    width: 100%;
    text-align: center;
    left: 0;
    right: 0;
    top: $top-position;
    font-size: 1.25em;
    transform: translateY($top-position * -4);
    transition: transform 0.25s ease-in-out;
  }

  &.edit:hover .click-to-edit-text {
    transform: translateY(0);
  }

  .goods-image {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
  }

  .goods-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.33) 33%, rgba(0, 0, 0, 1));
  }

  .goods-info {
    color: white;

    .name {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
              line-clamp: 2;
      -webkit-box-orient: vertical;

      font-size: 1.25em;
      font-weight: 700;
    }

    .goods-stock-current {
      font-weight: 600;
    }

    .goods-stock-initial {
      font-weight: 300;
      font-size: 0.8em;
    }
  }
}
</style>
