<template>
  <VMain style="min-height: 100%">
    <SharePanel v-if="!fetchError"
                :boothData="boothData"
                showHomeButton />

    <VScrollYReverseTransition leave-absolute>
      <div v-if="isDataFetched && fetchError"
           class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
        <h4 class="text-h4 text-center text-error">
          <VIcon class="mr-2">mdi-alert</VIcon>

          <span v-if="fetchError === ErrorCodes.ENTITY_NOT_FOUND">존재하지 않는 부스입니다.</span>
          <span v-else-if="fetchError === ErrorCodes.BOOTH_NOT_PUBLISHED">아직 공개되지 않은 부스입니다.</span>
          <span v-else-if="fetchError === ErrorCodes.INVALID_REQUEST_BODY">잘못된 요청입니다.</span>
          <span v-else>데이터를 불러오는 중 오류 발생 ({{ fetchError }})</span>
        </h4>

        <VBtn class="mt-4"
              size="large"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-home"
              :to="{ name: 'landing' }"
              replace>메인 페이지로 이동</VBtn>
      </div>

      <div v-else-if="!isDataFetched"
           class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
        <VProgressCircular indeterminate
                           color="primary"
                           size="x-large"
                           class="my-2" />
        <p class="mt-2 text-grey-darken-2">부스 정보 불러오는 중...</p>
      </div>
    </VScrollYReverseTransition>

    <VScrollYReverseTransition leave-absolute>
      <div v-if="isDataFetched && !fetchError">
        <BoothInfoSection :boothData="boothData" />

        <VContainer class="adjusted-vcontainer">
          <div>
            <div v-if="boothData?.status.status !== BoothStatus.CLOSE"
                 class="d-flex flex-wrap align-center justify-end text-right ml-auto mb-2">
              <VCheckbox v-model="autoRefreshEnabled"
                         hide-details
                         class="flex-grow-0"
                         label="정보 자동 업데이트" />

              <VBtn variant="outlined"
                    size="large"
                    prepend-icon="mdi-refresh"
                    class="ml-4"
                    text="새로고침"
                    :disabled="isDataLoading"
                    :loading="isDataLoading"
                    @click="pollData" />
            </div>

            <VExpandTransition>
              <p v-if="dataPollingTimerId"
                 class="text-right text-primary"
                 style="opacity: 0.5">※ 부스 정보가 30초마다 자동 업데이트됩니다.</p>
            </VExpandTransition>
          </div>

          <VSpacer class="my-8" />

          <div v-if="boothMemberList.length > 0">
            <ExpandableContent heading="멤버 목록">
              <div class="d-flex flex-row flex-wrap justify-center">
                <BoothMemberItem v-for="member in boothMemberList"
                                 :key="member.id"
                                 :memberData="member"
                                 :imageUrlResolver="getUploadFileUrl" />
              </div>
            </ExpandableContent>
          </div>

          <VSpacer v-if="infoImage.url"
                   class="my-8" />

          <div v-if="infoImage.url" class="w-100">
            <ExpandableContent heading="부스 인포">
              <VImg :src="infoImage.url"
                    :lazy-src="infoImage.thumbnail"
                    class="booth-info-image w-100 no-interaction rounded-lg"
                    position="top"
                    cover />
            </ExpandableContent>
          </div>

          <VSpacer class="my-8" />

          <div>
            <ExpandableContent heading="굿즈 목록">
              <GoodsListView v-if="boothGoodsList.length > 0"
                             :currencySymbol="boothData?.currencySymbol"
                             :goodsList="[...boothGoodsList, ...boothCombinationList]"
                             :goodsCategoryList="boothCategoryList"
                             :goodsImageUrlResolver="getUploadFileUrl"
                             omitEmptyGoodsCategory
                             @click:goods="(goodsId: number) => openGoodsItemDetailsDialog(goodsId, false)"
                             @click:combination="(combinationId: number) => openGoodsItemDetailsDialog(combinationId, true)">
                <template #goods="props">
                  <GoodsItemPublic v-bind="props" />
                </template>
              </GoodsListView>
              <h5 v-else class="text-h5 text-grey-darken-1">등록된 굿즈가 없습니다.</h5>
            </ExpandableContent>
          </div>
        </VContainer>
      </div>
    </VScrollYReverseTransition>
  </VMain>

  <GoodsItemDetailsDialog v-model="goodsItemDetailsDialogOpen"
                          :data="goodsItemDetailsDialogTargetData" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { APP_NAME, BoothStatus, DEVELOPER_TWITTER_HANDLE, ErrorCodes, type IBooth, type IBoothMember, type IGoods, type IGoodsCategory, type IGoodsCombination } from "@myboothmanager/common";
import { Goods, GoodsBase, GoodsCombination } from "@myboothmanager/common-ui";
import { useHead, useSeoMeta } from "@unhead/vue";
import SharePanel from "@/components/booth/SharePanel.vue";
import { useAPIStore } from "@/plugins/stores/api";
import { useLocalStore } from "@/plugins/stores/local";
import BoothInfoSection from "@/components/booth/BoothInfoSection.vue";
import { getUploadFileUrl } from "@/lib/common-functions";
import GoodsItemDetailsDialog from "@/components/dialogs/GoodsItemDetailsDialog.vue";
import GoodsItemPublic from "@/components/goods/GoodsItemPublic.vue";
import ExpandableContent from "@/components/common/ExpandableContent.vue";

@Component({
  components: {
    BoothInfoSection,
    ExpandableContent,
    GoodsItemPublic,
    SharePanel,
    GoodsItemDetailsDialog,
  },
})
export default class IndividualBoothPage extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly ErrorCodes = ErrorCodes;
  readonly getUploadFileUrl = getUploadFileUrl;

  isDataFetched: boolean = false;
  isDataLoading: boolean = false;
  fetchError: ErrorCodes | null = null;

  boothData: IBooth | null = null;
  boothMemberList: Array<IBoothMember> = [];
  boothGoodsList: Array<Goods> = [];
  boothCombinationList: Array<GoodsCombination> = [];
  boothCategoryList: Array<IGoodsCategory> = [];

  boothInfoExpanded: boolean = true;

  goodsItemDetailsDialogOpen: boolean = false;
  goodsItemDetailsDialogTargetData: GoodsBase | null = null;

  readonly dataPollingInterval: number = 30000; // 30 seconds
  dataPollingTimerId: ReturnType<typeof setTimeout> | null = null;

  get boothId(): number {
    return new Number(useRoute().params["boothId"] as string).valueOf();
  }

  get infoImage() {
    return {
      url: getUploadFileUrl(this.boothData?.infoImage?.path),
      thumbnail: this.boothData?.infoImage?.thumbnailData,
    };
  }

  get autoRefreshEnabled(): boolean { return useLocalStore().boothPageSettings.enableAutoRefresh; }
  set autoRefreshEnabled(value: boolean) { useLocalStore().boothPageSettings.enableAutoRefresh = value; }

  async mounted() {
    /* *** Fetch Data *** */
    this.isDataFetched = false;
    await this.fetchData();
    this.isDataFetched = true;

    if(!this.boothData) {
      document.title = "오류";
      return;
    }

    /* *** Force execute onAutoRefreshEnabledChanged *** */
    this.onAutoRefreshEnabledChanged(this.autoRefreshEnabled);

    /* *** Set last visited booth id *** */
    useLocalStore().boothPageSettings.lastVisitedBoothId = this.boothId;

    /* *** Set document metadata *** */
    useHead({
      title: `${this.boothData.name} - 부스 정보`,
    });
    useSeoMeta({
      title: `${this.boothData.name} - 부스 정보`,
      description: this.boothData.description,
      applicationName: APP_NAME,
      generator: `${APP_NAME} v${import.meta.env.VITE__APP_VERSION}`,
      mobileWebAppCapable: "yes",

      get ogTitle() { return this.title?.toString(); },
      get ogSiteName() { return this.applicationName?.toString(); },
      get ogDescription() { return this.description?.toString(); },
      ogType: "website",
      ogImage: getUploadFileUrl(this.boothData.bannerImage?.path),
      ogImageAlt: `${this.boothData.name} - 부스 배너 이미지`,
      ogUrl: window.location.href,

      twitterCard: "summary_large_image",
      twitterCreator: `@${DEVELOPER_TWITTER_HANDLE}`,
      get twitterSite() { return this.twitterCreator?.toString(); },
      get twitterTitle() { return this.title?.toString(); },
      get twitterDescription() { return this.description?.toString(); },
      get twitterImage() { return this.ogImage?.toString(); },
      get twitterImageAlt() { return this.ogImageAlt?.toString(); },

      appleMobileWebAppCapable: "yes",
      get appleMobileWebAppTitle() { return this.title?.toString(); },
    });
  }

  unmounted() {
    if(this.dataPollingTimerId) {
      clearInterval(this.dataPollingTimerId);
      console.info("Stop polling ", this.dataPollingTimerId);
    }
  }

  @Watch("autoRefreshEnabled", { immediate: true })
  onAutoRefreshEnabledChanged(value: boolean) {
    if(value) {
      if(this.boothData && this.boothData.status.status !== BoothStatus.CLOSE && this.autoRefreshEnabled) {
        this.dataPollingTimerId = setInterval(this.pollData, this.dataPollingInterval);
      }
    } else {
      if(this.dataPollingTimerId) {
        clearInterval(this.dataPollingTimerId);
        this.dataPollingTimerId = null;
      }
    }
  }

  async fetchData() {
    if(!this.boothId || this.boothId <= 0) {
      this.fetchError = ErrorCodes.INVALID_REQUEST_BODY;
      return;
    }

    /* Fetch booth data first */
    const boothDataResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchSingleBooth(this.boothId));

    if("errorCode" in boothDataResponse) {
      this.fetchError = boothDataResponse.errorCode;
      return;
    } else {
      this.boothData = boothDataResponse;
    }

    /* After booth data is fetched successfully, fetch others */
    const responsePromises: Array<Promise<any>> = [  // eslint-disable-line @typescript-eslint/no-explicit-any
      useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllMembersOfBooth(this.boothId)),
      useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsOfBooth(this.boothId)),
      useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsCombinationOfBooth(this.boothId)),
      useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId)),
    ];

    const responses = await Promise.all(responsePromises);
    if(responses.every((response) => !("errorCode" in response))) {
      this.boothMemberList = responses[0];
      this.boothGoodsList = (responses[1] as Array<IGoods>).map((goods) => new Goods(goods));
      this.boothCombinationList = (responses[2] as Array<IGoodsCombination>).map((combination) => new GoodsCombination(combination));
      this.boothCategoryList = responses[3];
    }
  }

  async pollData(): Promise<boolean | Array<ErrorCodes>> {
    const errors: Array<ErrorCodes> = [0, 0, 0, 0, 0];

    this.isDataLoading = true;

    const boothDataResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchSingleBooth(this.boothId));
    if(!("errorCode" in boothDataResponse)) this.boothData = boothDataResponse;
    else errors[0] = boothDataResponse.errorCode;

    const boothMemberResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllMembersOfBooth(this.boothId));
    if(!("errorCode" in boothMemberResponse)) this.boothMemberList = boothMemberResponse;
    else errors[1] = boothMemberResponse.errorCode;

    const goodsResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsOfBooth(this.boothId));
    if(!("errorCode" in goodsResponse)) this.boothGoodsList = goodsResponse.map((goods) => new Goods(goods));
    else errors[2] = goodsResponse.errorCode;

    const combinationResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsCombinationOfBooth(this.boothId));
    if(!("errorCode" in combinationResponse)) this.boothCombinationList = combinationResponse.map((combination) => new GoodsCombination(combination));
    else errors[3] = combinationResponse.errorCode;

    const categoryResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId));
    if(!("errorCode" in categoryResponse)) this.boothCategoryList = categoryResponse;
    else errors[4] = categoryResponse.errorCode;

    this.isDataLoading = false;

    return errors.every((error) => error === ErrorCodes.SUCCESS) ? true : errors;
  }

  openGoodsItemDetailsDialog(id: number, isCombination: boolean = false) {
    const targetData = isCombination ? this.boothCombinationList.find((combination) => combination.id === id) : this.boothGoodsList.find((goods) => goods.id === id);

    if(targetData) {
      this.goodsItemDetailsDialogTargetData = targetData;
      this.goodsItemDetailsDialogOpen = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.adjusted-vcontainer {
  @media (min-width: 960px) { max-width: unset; }
  @media (min-width: 1000px) { max-width: 980px; }
  @media (min-width: 1280px) { max-width: 1205px; }
  @media (min-width: 1920px) { max-width: 1670px; }

  .booth-info-image {
    max-width: 1280px;
    margin: auto;
  }
}
</style>
