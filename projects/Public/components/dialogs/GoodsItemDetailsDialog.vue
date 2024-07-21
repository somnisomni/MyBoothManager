<template>
  <CommonDialog v-model="open"
                width="600px"
                :dialogTitle="title">
    <VImg v-if="normalizedImageUrl"
          :src="normalizedImageUrl"
          :lazy-src="normalizedImageThumbnailData ?? undefined"
          width="90%"
          :max-height="goodsImageHeight"
          class="mb-4 mx-auto no-interaction"
          contain />

    <div>
      <p v-if="(data as Goods).type" class="text-subtitle-2 text-center font-weight-light">{{ (data as Goods).type }}</p>
      <p class="text-h5 text-center font-weight-bold">{{ data.name }}</p>
      <p v-if="data.description" class="text-subtitle-1 text-center font-weight-normal">{{ data.description }}</p>
      <p v-if="data.ownerMemberIds && data.ownerMemberIds.length > 0 && ownerMembersData && ownerMembersData.length > 0"
         class="text-subtitle-2 text-center my-2">
        <span>by </span>
        <span v-for="member in ownerMembersData"
              :key="member.id">
          <span v-if="member.id !== data.ownerMemberIds[0]">, </span>

          <VAvatar v-if="member.avatarImage"
                   class="mr-1">
            <VImg :src="getUploadFileUrl(member.avatarImage.path) ?? undefined"
                  :lazy-src="member.avatarImage.thumbnailData ?? undefined" />
          </VAvatar>

          <span>{{ member.name }}</span>
        </span>
      </p>
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
import { Model, Prop, Vue } from "vue-facing-decorator";
import { GoodsStockVisibility, IMAGE_SIZE_CONSTRAINTS, ImageSizeConstraintKey, type IBoothMember } from "@myboothmanager/common";
import { getUploadFileUrl } from "#imports";

@NuxtComponent({})
export default class GoodsItemDetailsDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: GoodsBase, required: true }) data!: GoodsBase;
  @Prop({ type: Array, default: [] }) ownerMembersData!: IBoothMember[];

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
