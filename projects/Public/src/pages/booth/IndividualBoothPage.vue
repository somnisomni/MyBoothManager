<template>
  <VMain>
    <SharePanel v-if="!dataFetchError" :boothData="boothData" />

    <h6 class="position-fixed text-h6 ma-2 text-grey text-center" style="right: 0; bottom: 0; opacity: 0.5">Work in progress!</h6>

    <VSlideYReverseTransition leave-absolute>
      <div v-if="isDataFetched && dataFetchError" class="position-fixed d-flex align-center justify-center w-100 h-100 pa-2 text-center">
        <h4 class="text-h4 text-center text-error">
          <VIcon class="mr-2">mdi-alert</VIcon>

          <span v-if="dataFetchError === ErrorCodes.ENTITY_NOT_FOUND">존재하지 않는 부스입니다.</span>
          <span v-else>데이터를 불러오는 중 오류 발생 ({{ dataFetchError }})</span>
        </h4>
      </div>

      <div v-else-if="!isDataFetched" class="position-fixed d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
        <VProgressCircular indeterminate color="primary" size="x-large" class="my-2" />
        <p class="mt-2 text-grey-darken-2">데이터를 불러오는 중...</p>
      </div>
    </VSlideYReverseTransition>

    <VSlideYReverseTransition leave-absolute>
      <VContainer v-if="isDataFetched && !dataFetchError">
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
    </VSlideYReverseTransition>
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { ErrorCodes, type IBooth, type IGoods, type IGoodsCategory } from "@myboothmanager/common";
import SharePanel from "@/components/booth/SharePanel.vue";
import { usePublicStore } from "@/stores/public";

@Component({
  components: {
    SharePanel,
  },
})
export default class IndividualBoothPage extends Vue {
  readonly ErrorCodes = ErrorCodes;

  isDataFetched: boolean = false;
  dataFetchError: ErrorCodes | null = null;

  boothData: IBooth | null = null;
  boothGoodsList: Array<IGoods> = [];
  boothCategoryList: Array<IGoodsCategory> = [];

  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }

  async mounted() {
    await this.fetchData();
    this.isDataFetched = true;
  }

  async fetchData() {
    /* Fetch booth data first */
    const boothDataResponse = await usePublicStore().apiCaller.fetchSingleBooth(this.boothId);

    if("errorCode" in boothDataResponse) {
      this.dataFetchError = boothDataResponse.errorCode;
      return;
    } else {
      this.boothData = boothDataResponse;
    }

    /* After booth data is fetched successfully, fetch others */
    const goodsResponse = await usePublicStore().apiCaller.fetchAllGoodsOfBooth(this.boothId);
    const categoryResponse = await usePublicStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId);

    if(!("errorCode" in goodsResponse || "errorCode" in categoryResponse)) {
      this.boothGoodsList = goodsResponse;
      this.boothCategoryList = categoryResponse;
    }
  }
}
</script>
