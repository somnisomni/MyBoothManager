<template>
  <VMain>
    <SharePanel :boothData="boothData" />

    <h6 class="text-h6 my-2 text-grey text-center">Work in progress!</h6>

    <VSlideYReverseTransition leave-absolute>
      <VContainer v-if="isDataLoaded">
        <h4 class="text-h4 text-left">부스 정보</h4>
        <VDivider class="my-2" />
        <div>이름: {{ boothData?.name }}</div>
        <div v-if="boothData?.description">설명: {{ boothData?.description }}</div>
        <div>위치: {{ boothData?.location }}</div>
        <div>현재 운영 상태: {{ boothData?.status }}</div>

        <VSpacer class="my-8" />

        <h4 class="text-h4 text-left">굿즈 목록</h4>
        <VDivider class="my-2" />
        <GoodsListView :currencySymbol="boothData?.currencySymbol"
                      :goodsList="boothGoodsList"
                      :goodsCategoryList="boothCategoryList"
                      :editable="false"
                      omitEmptyGoodsCategory />
      </VContainer>
      <div v-else class="w-100 text-center">
        <VProgressCircular indeterminate color="primary" size="x-large" class="my-2" />
        <p class="mt-2 text-grey-darken-2">데이터를 불러오는 중입니다...</p>
      </div>
    </VSlideYReverseTransition>
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { type IBooth, type IGoods, type IGoodsCategory } from "@myboothmanager/common";
import SharePanel from "@/components/booth/SharePanel.vue";
import { usePublicStore } from "@/stores/public";

@Component({
  components: {
    SharePanel,
  },
})
export default class IndividualBoothPage extends Vue {
  isDataLoaded: boolean = false;

  boothData: IBooth | null = null;
  boothGoodsList: Array<IGoods> = [];
  boothCategoryList: Array<IGoodsCategory> = [];

  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }

  async mounted() {
    await this.fetchData();
    this.isDataLoaded = true;
  }

  async fetchData() {
    this.boothData = await usePublicStore().apiCaller.fetchSingleBooth(this.boothId);
    this.boothGoodsList = await usePublicStore().apiCaller.fetchAllGoodsOfBooth(this.boothId);
    this.boothCategoryList = await usePublicStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId);
  }
}
</script>
