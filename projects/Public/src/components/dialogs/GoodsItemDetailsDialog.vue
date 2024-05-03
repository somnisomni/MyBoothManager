<template>
  <CommonDialog v-model="open"
                width="600px"
                dialogTitle="굿즈 세부 정보">
    <div>
      <VImg v-if="normalizedImageUrl"
            :src="normalizedImageUrl"
            :lazy-src="normalizedImageThumbnailData"
            width="100%"
            :max-height="goodsImageHeight"
            class="mb-2 no-interaction"
            contain />

      <p>이름 : {{ data.name }}</p>
      <p v-if="data.description">설명 : {{ data.description }}</p>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { GoodsBase } from "@myboothmanager/common-ui";
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import { IMAGE_SIZE_CONSTRAINTS, ImageSizeConstraintKey } from "@myboothmanager/common";
import { getUploadFileUrl } from "@/lib/common-functions";

@Component({})
export default class GoodsItemDetailsDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: GoodsBase, required: true }) data!: GoodsBase;

  get normalizedImageUrl() {
    return getUploadFileUrl(this.data.goodsImage?.path);
  }

  get normalizedImageThumbnailData() {
    return this.data.goodsImage?.thumbnailData;
  }

  get goodsImageHeight() {
    return `${(IMAGE_SIZE_CONSTRAINTS.get(ImageSizeConstraintKey.GOODS)?.height) ?? 500}px`;
  }
}
</script>
