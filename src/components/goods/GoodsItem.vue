<template>
  <VSheet class="goods-item d-flex ma-4"
          width="200"
          height="250"
          rounded="lg"
          :elevation="elevation"
          @pointerenter="elevation = ELEVATION_HOVER"
          @pointerleave="elevation = ELEVATION_NORMAL">
    <VImg class="goods-image" :src="'https://picsum.photos/seed/' + goodsData.id + '/200/250'" aspect-ratio="1/1" />
    <div class="goods-image-overlay"></div>

    <VLayout class="goods-info d-flex flex-column align-self-end pa-2">
      <div class="name">{{ goodsData.name }}</div>

      <VLayout class="d-flex flex-row justify-space-between">
        <div>{{ currencySymbol }}{{ goodsData.price.toLocaleString() }}</div>
        <div><span class="goods-stock-current">{{ goodsData.stock.current }}</span> <span class="goods-stock-initial">/ {{ goodsData.stock.initial }}</span></div>
      </VLayout>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { type GoodsData } from "@/types/goods";

@Component({})
export default class GoodsItem extends Vue {
  @Prop({ required: true }) goodsData!: GoodsData;
  @Prop({ default: "₩", required: true }) currencySymbol!: string;

  ELEVATION_NORMAL = 2;
  ELEVATION_HOVER = 6;
  elevation = this.ELEVATION_NORMAL;
}
</script>

<style lang="scss" scoped>
.goods-item {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.25s;

  &:hover {
    transform: translateY(-5%);
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
