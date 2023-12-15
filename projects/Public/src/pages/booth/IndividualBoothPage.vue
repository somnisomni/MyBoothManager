<template>
  <VMain>
    <SharePanel v-if="!fetchError" :boothData="boothData" showHomeButton />

    <VSlideYReverseTransition leave-absolute>
      <div v-if="isDataFetched && fetchError" class="position-fixed d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
        <h4 class="text-h4 text-center text-error">
          <VIcon class="mr-2">mdi-alert</VIcon>

          <span v-if="fetchError === ErrorCodes.ENTITY_NOT_FOUND">존재하지 않는 부스입니다.</span>
          <span v-else-if="fetchError === ErrorCodes.BOOTH_NOT_PUBLISHED">아직 공개되지 않은 부스입니다.</span>
          <span v-else-if="fetchError === ErrorCodes.INVALID_REQUEST_BODY">잘못된 요청입니다.</span>
          <span v-else>데이터를 불러오는 중 오류 발생 ({{ fetchError }})</span>
        </h4>

        <VBtn class="mt-4" size="large" color="primary" variant="outlined" prepend-icon="mdi-home" :to="{ name: 'landing' }" replace>메인 페이지로 이동</VBtn>
      </div>

      <div v-else-if="!isDataFetched" class="position-fixed d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
        <VProgressCircular indeterminate color="primary" size="x-large" class="my-2" />
        <p class="mt-2 text-grey-darken-2">데이터를 불러오는 중...</p>
      </div>
    </VSlideYReverseTransition>

    <VSlideYReverseTransition leave-absolute>
      <div v-if="isDataFetched && !fetchError">
        <BoothInfoSection :boothData="boothData" />

        <VContainer>
          <p v-if="dataPollingTimerId" class="text-right text-primary" style="opacity: 0.5">※ 부스 정보는 30초마다 자동 업데이트됩니다.</p>

          <VSpacer class="my-8" />

          <div v-if="boothData?.infoImageUrl" class="w-100">
            <h4 class="text-h4 text-left font-weight-medium ml-2">부스 인포</h4>
            <VDivider class="my-2" />
            <VImg :src="getUploadFilePath(boothData?.infoImageUrl)" class="w-100 no-interaction rounded-lg" />
          </div>

          <VSpacer class="my-8" />

          <h4 class="text-h4 text-left font-weight-medium ml-2">굿즈 목록</h4>
          <VDivider class="my-2" />
          <GoodsListView v-if="boothGoodsList.length > 0"
                        :currencySymbol="boothData?.currencySymbol"
                        :goodsList="boothGoodsList"
                        :goodsImageUrlResolver="getUploadFilePath"
                        :goodsCategoryList="boothCategoryList"
                        :editable="false"
                        omitEmptyGoodsCategory />
          <h5 v-else class="text-h5 text-grey-darken-1">등록된 굿즈가 없습니다.</h5>
        </VContainer>
      </div>
    </VSlideYReverseTransition>
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { ErrorCodes, type IBooth, type IGoods, type IGoodsCategory } from "@myboothmanager/common";
import SharePanel from "@/components/booth/SharePanel.vue";
import { usePublicStore } from "@/stores/public";
import BoothInfoSection from "@/components/booth/BoothInfoSection.vue";
import { getUploadFilePath } from "@/lib/common-functions";

@Component({
  components: {
    BoothInfoSection,
    SharePanel,
  },
})
export default class IndividualBoothPage extends Vue {
  readonly ErrorCodes = ErrorCodes;
  readonly getUploadFilePath = getUploadFilePath;

  isDataFetched: boolean = false;
  fetchError: ErrorCodes | null = null;

  boothData: IBooth | null = null;
  boothGoodsList: Array<IGoods> = [];
  boothCategoryList: Array<IGoodsCategory> = [];

  readonly dataPollingInterval: number = 30000; // 30 seconds
  dataPollingTimerId: NodeJS.Timeout | null = null;

  get boothId(): number {
    return new Number(useRoute().params["boothId"] as string).valueOf();
  }

  async mounted() {
    await this.fetchData();
    this.isDataFetched = true;

    if(this.boothData) {
      this.dataPollingTimerId = setInterval(this.pollData, this.dataPollingInterval);
      console.info("Start polling ", this.dataPollingTimerId);

      document.title = `${this.boothData.name} - 부스 정보`;
    } else {
      document.title = "오류";
    }
  }

  async fetchData() {
    if(!this.boothId || this.boothId <= 0) {
      this.fetchError = ErrorCodes.INVALID_REQUEST_BODY;
      return;
    }

    /* Fetch booth data first */
    const boothDataResponse = await usePublicStore().apiCaller.fetchSingleBooth(this.boothId);

    if("errorCode" in boothDataResponse) {
      this.fetchError = boothDataResponse.errorCode;
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

  async pollData(): Promise<boolean | ErrorCodes[]> {
    const errors: ErrorCodes[] = [-1, -1, -1];

    const boothDataResponse = await usePublicStore().apiCaller.fetchSingleBooth(this.boothId);
    if(!("errorCode" in boothDataResponse)) this.boothData = boothDataResponse;
    else errors[0] = boothDataResponse.errorCode;

    const goodsResponse = await usePublicStore().apiCaller.fetchAllGoodsOfBooth(this.boothId);
    if(!("errorCode" in goodsResponse)) this.boothGoodsList = goodsResponse;
    else errors[1] = goodsResponse.errorCode;

    const categoryResponse = await usePublicStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId);
    if(!("errorCode" in categoryResponse)) this.boothCategoryList = categoryResponse;
    else errors[2] = categoryResponse.errorCode;

    return errors.every((error) => error === ErrorCodes.SUCCESS) ? true : errors;
  }
}
</script>
