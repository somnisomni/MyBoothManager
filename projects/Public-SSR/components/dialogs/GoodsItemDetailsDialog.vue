<template>
  <CommonDialog v-model="open"
                width="600px"
                :dialogTitle="title">
    <VImg v-if="normalizedImageUrl"
          :src="normalizedImageUrl"
          :lazy-src="normalizedImageThumbnailData"
          width="90%"
          :max-height="goodsImageHeight"
          class="mb-4 mx-auto no-interaction"
          contain />

    <div>
      <p v-if="(data as Goods).type" class="text-subtitle-2 text-center font-weight-light">{{ (data as Goods).type }}</p>
      <p class="text-h5 text-center font-weight-bold">{{ data.name }}</p>
      <p v-if="data.description" class="text-subtitle-1 text-center font-weight-normal">{{ data.description }}</p>
    </div>

    <div class="mt-8">
      <div v-if="normalizedStockData"
           class="d-flex flex-row justify-center">
        <div v-if="Number(normalizedStockData.remaining) >= 0"
             class="d-flex flex-column align-center px-2">
          <div>현재 남은 재고</div>
          <div class="font-weight-medium"
               :class="{ 'text-error': Number(data.stock.remaining) <= 0 }"
               style="font-size: 1.5em">{{ Number(data.stock.remaining) <= 0 ? "품절" : data.stock.remaining }}</div>
        </div>

        <div v-if="Number(normalizedStockData.initial) >= 0"
             class="d-flex flex-column align-center px-2">
          <div>전체 재고</div>
          <div class="font-weight-medium"
               style="font-size: 1.5em">{{ data.stock.initial }}</div>
        </div>
      </div>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { Goods, GoodsBase, GoodsCombination } from "@myboothmanager/common-ui";  // eslint-disable-line @typescript-eslint/no-unused-vars
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import { GoodsStockVisibility, IMAGE_SIZE_CONSTRAINTS, ImageSizeConstraintKey } from "@myboothmanager/common";
import { getUploadFileUrl } from "#imports";

@Component({})
export default class GoodsItemDetailsDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: GoodsBase, required: true }) data!: GoodsBase;

  get title() {
    return this.data instanceof GoodsCombination ? "세트 세부 정보" : "굿즈 세부 정보";
  }

  get normalizedImageUrl() {
    return getUploadFileUrl(this.data.goodsImage?.path);
  }

  get normalizedImageThumbnailData() {
    return this.data.goodsImage?.thumbnailData;
  }

  get normalizedStockData() {
    return this.data.stock.visibility !== GoodsStockVisibility.HIDE_ALL ? this.data.stock : null;
  }

  get goodsImageHeight() {
    return `${(IMAGE_SIZE_CONSTRAINTS.get(ImageSizeConstraintKey.GOODS)?.height) ?? 500}px`;
  }
}
</script>
