<template>
  <CommonDialog v-model="open"
                width="600px"
                dialogTitle="굿즈 세부 정보">
    <div>
      <VImg :src="normalizedImageUrl" />
      <p>이름 : {{ data.name }}</p>
      <p>설명 : {{ data.description }}</p>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { Goods, GoodsBase, GoodsCombination } from "@myboothmanager/common-ui";
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/common-functions";

@Component({})
export default class GoodsItemDetailsDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: GoodsBase, required: true }) data!: GoodsBase;

  get normalizedImageUrl() {
    return getUploadFilePath((this.data as Goods).goodsImageUrl || (this.data as GoodsCombination).combinationImageUrl || "");
  }
}
</script>
