<template>
  <VMain style="min-height: 100%">
    <!-- Booth data fetch error page will be shown if there's no booth data fetched or has error -->
    <div v-if="!booth || boothFetchError"
          class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <h4 class="text-h4 text-center text-error">
        <VIcon class="mr-2"
               icon="mdi-alert" />

        <span v-if="boothFetchError === ErrorCodes.ENTITY_NOT_FOUND">존재하지 않는 부스입니다.</span>
        <span v-else-if="boothFetchError === ErrorCodes.BOOTH_NOT_PUBLISHED">공개되지 않은 부스입니다.</span>
        <span v-else-if="boothFetchError === ErrorCodes.INVALID_REQUEST_BODY">잘못된 요청입니다.</span>
        <span v-else>데이터를 불러오는 중 오류 발생 ({{ boothFetchError }})</span>
      </h4>

      <VBtn class="mt-4"
            size="large"
            color="primary"
            variant="outlined"
            prepend-icon="mdi-home"
            :to="{ path: '/' }"
            replace>메인 페이지로 이동</VBtn>
    </div>

    <!-- If the booth data exists and there's no error during fetch, then show the contents -->
    <div v-else>
      <!-- Floating share panel -->
      <SharePanel :boothData="booth"
                  showHomeButton />

      <!-- Floating button for automatic data update -->
      <DataUpdateFloatingButton v-if="booth.status.status !== BoothStatus.CLOSE"
                                :interval="60"
                                :fetchCallback="async () => await fetchData()" />

      <!-- Booth information section placed in top of the page -->
      <BoothInfoSection :boothData="booth" />

      <!-- Booth contents (Notice, Goods, Info Image, etc...) -->
      <VContainer class="adjusted-vcontainer">
        <VSpacer class="my-8" />

        <!-- Booth notice -->
        <div v-if="booth.noticeContent">
          <ExpandableContent heading="공지 사항">
            <MarkdownRenderer :source="booth.noticeContent"
                              class="text-center" />
          </ExpandableContent>

          <VSpacer class="my-8" />
        </div>

        <!-- Below needs extra data fetch, and the extra fetch should be happen on client-side only. -->
        <VSlideYReverseTransition leave-absolute>
          <!-- If extra data is not loaded yet, show the indeterminate circular progress -->
          <div v-if="!isExtraDataLoaded"
               class="d-flex flex-column align-center justify-center w-100">
            <VProgressCircular indeterminate
                               size="large"
                               class="my-2" />

            <p class="text-subtitle-2">부스 내 굿즈 데이터를 불러오는 중...</p>
          </div>

          <div v-else>
            <ClientOnly>
              <div v-if="members.length > 0">
                <ExpandableContent heading="멤버 목록">
                  <div class="d-flex flex-row flex-wrap justify-center">
                    <BoothMemberItem v-for="member in members"
                                    :key="member.id"
                                    :memberData="member" />
                  </div>
                </ExpandableContent>

                <VSpacer class="my-8" />
              </div>

              <div v-if="infoImage.url" class="w-100">
                <ExpandableContent heading="부스 인포">
                  <VImg :src="infoImage.url"
                        :lazy-src="infoImage.thumbnail ?? undefined"
                        class="booth-info-image w-100 no-interaction rounded-lg"
                        position="top"
                        cover />
                </ExpandableContent>

                <VSpacer class="my-8" />
              </div>

              <div>
                <ExpandableContent heading="굿즈 목록">
                  <GoodsListView v-if="goodsNormalized.length > 0"
                                :currencySymbol="currencySymbol"
                                :goodsList="[...goodsNormalized, ...combinationsNormalized]"
                                :goodsCategoryList="categories"
                                omitEmptyGoodsCategory
                                @click:goods="(goodsId: number) => openGoodsItemDetailsDialog(goodsId, false)"
                                @click:combination="(combinationId: number) => openGoodsItemDetailsDialog(combinationId, true)">
                    <template #goods="props">
                      <GoodsItemPublic v-bind="props" />
                    </template>
                    <template #goods-combination="props">
                      <GoodsItemPublic v-bind="props" />
                    </template>
                  </GoodsListView>
                  <h5 v-else class="text-h5 text-grey-darken-1">등록된 굿즈가 없습니다.</h5>
                </ExpandableContent>
              </div>
            </ClientOnly>
          </div>
        </VSlideYReverseTransition>
      </VContainer>
    </div>

    <GoodsItemDetailsDialog v-model="goodsItemDetailsDialogOpen"
                            :data="goodsItemDetailsDialogTargetData"
                            :ownerMembersData="goodsItemDetailsDialogOwnerMembers" />
  </VMain>
</template>

<script lang="ts">
import { APP_NAME, BoothStatus, CURRENCY_CODE_TO_SYMBOL_MAP, DEVELOPER_TWITTER_HANDLE, ErrorCodes, type IBooth, type IBoothMember, type IBoothResponse, type IErrorResponse, type IGoods, type IGoodsCategory, type IGoodsCombination } from "@myboothmanager/common";
import { Goods, GoodsBase, GoodsCombination } from "@myboothmanager/common-ui";
import { Setup, Vue } from "vue-facing-decorator";

@NuxtComponent({
  async asyncData(context) {
    const { $publicAPI } = context;

    /* === Important data === */
    // Important data states setup
    const boothId = useState<number>("boothId", () => -1);
    const boothFetchError = useState<ErrorCodes | null>("boothFetchError", () => null);
    const booth = useState<IBooth | null>("booth", () => null);

    // Get booth ID from current route URL param
    boothId.value = Number(context.$router.currentRoute.value.params["id"] as string);

    // If booth ID is invalid, return error
    if(!boothId || boothId.value <= 0) {
      boothFetchError.value = ErrorCodes.INVALID_REQUEST_BODY;

      return { boothId, boothFetchError, booth };
    }

    // Check booth public accessibility
    const boothAccessCheck = await $publicAPI.apiCaller.checkBoothPublicAccess(boothId.value);

    // If the booth is not publicily accessible or has error during fetch, return error
    if("errorCode" in boothAccessCheck || boothAccessCheck.value === false) {
      boothFetchError.value = (boothAccessCheck as IErrorResponse).errorCode ?? ErrorCodes.BOOTH_NOT_PUBLISHED;

      return { boothId, boothFetchError, booth };
    }

    // Get the booth data from API
    let boothFetched: IBoothResponse | IErrorResponse | null = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchSingleBooth(boothId.value));

    // If the booth data is invalid or has error during fetch, return error
    if("errorCode" in boothFetched || !boothFetched) {
      boothFetchError.value = (boothFetched as IErrorResponse).errorCode ?? ErrorCodes.UNKNOWN_BOOTH_ERROR;

      return { boothId, boothFetchError, booth };
    }

    // If all done, normalize important states
    booth.value = boothFetched;
    boothFetchError.value = null;

    // Return all states
    return {
      boothId,
      boothFetchError,
      booth,
    };
  },
  setup() {
    const IMPORTANT_DATA_FETCH_KEYS = {
      booth: useNuxtApp().$publicAPI.apiCaller.fetchSingleBooth.name,
    };

    return {
      IMPORTANT_DATA_FETCH_KEYS,
      boothId: useState<number>("boothId", () => -1),
      boothFetchError: useState<ErrorCodes | null>("boothFetchError", () => null),
      booth: useState<IBooth | null>("booth", () => null),
    };
  },
})
export default class IndividualBoothPage extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly ErrorCodes = ErrorCodes;

  @Setup(() => useNuxtApp().$publicAPI)
  declare readonly $publicAPI: ReturnType<typeof useNuxtApp>["$publicAPI"];

  goodsItemDetailsDialogOpen: boolean = false;
  goodsItemDetailsDialogTargetData: GoodsBase | null = null;
  goodsItemDetailsDialogOwnerMembers: IBoothMember[] = [];

  /* Important data will be fetched before navigation (done in asyncData()) */
  declare readonly IMPORTANT_DATA_FETCH_KEYS: Record<string, string>;
  declare readonly boothFetchError: ErrorCodes | null;
  declare readonly boothId: number;
  declare readonly booth: IBooth | null;

  /* Extra data will be fetched after navigation (done in fetchExtraData()) */
  isExtraDataLoaded: boolean = false;
  members: IBoothMember[] = [];
  categories: IGoodsCategory[] = [];
  goods: IGoods[] = [];
  combinations: IGoodsCombination[] = [];

  get goodsNormalized(): Array<Goods> {
    return this.goods.map((goods) => new Goods(goods));
  }

  get combinationsNormalized(): Array<GoodsCombination> {
    return this.combinations.map((combination) => new GoodsCombination(combination));
  }

  get currencySymbol(): string {
    return CURRENCY_CODE_TO_SYMBOL_MAP[this.booth?.currencyCode ?? "KRW"];
  }

  get infoImage() {
    return {
      url: getUploadFileUrl(this.booth?.infoImage?.path),
      thumbnail: this.booth?.infoImage?.thumbnailData,
    };
  }

  get autoRefreshEnabled(): boolean { return useLocalStore().boothPageSettings.enableAutoRefresh; }
  set autoRefreshEnabled(value: boolean) { useLocalStore().boothPageSettings.enableAutoRefresh = value; }

  async mounted() {
    // This generally do the trick for setup() data
    // Ensures setup() data to be available
    await this.$nextTick();

    /* *** Set last visited booth id *** */
    useLocalStore().boothPageSettings.lastVisitedBoothId = this.boothId;

    /* *** Fetch extra data *** */
    if(!this.isExtraDataLoaded) {
      await this.fetchExtraData();
    }
  }

  created() {
    if(!this.booth || this.boothFetchError) {
      useHeadSafe({
        title: "오류",
      });
      return;
    }

    /* *** Set document metadata *** */
    useHeadSafe({
      title: `${this.booth.name} - 부스 정보`,
    });
    useSeoMeta({
      title: `${this.booth.name} - 부스 정보`,
      description: this.booth.description,
      applicationName: APP_NAME,
      generator: `${APP_NAME} v${useRuntimeConfig().public.appVersion}`,
      mobileWebAppCapable: "yes",

      get ogTitle() { return this.title?.toString(); },
      get ogSiteName() { return this.applicationName?.toString(); },
      get ogDescription() { return this.description?.toString(); },
      ogType: "website",
      ogImage: getUploadFileUrl(this.booth.bannerImage?.path),
      ogImageAlt: `${this.booth.name} - 부스 배너 이미지`,
      ogUrl: useRequestURL().href,

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

  async fetchData() {
    // Refresh important data using refreshNuxtData()
    await refreshNuxtData(Object.values(this.IMPORTANT_DATA_FETCH_KEYS));

    // Refresh extra data by calling fetchExtraData()
    await this.fetchExtraData();
  }

  async fetchExtraData() {
    /* *** Client-only lazy fetch extra data *** */

    const goodsResp = await this.$publicAPI.wrap(() => this.$publicAPI.apiCaller.fetchAllGoodsOfBooth(this.boothId), true, false);
    if(goodsResp instanceof Array) this.goods = goodsResp;

    const combinationsResp = await this.$publicAPI.wrap(() => this.$publicAPI.apiCaller.fetchAllGoodsCombinationOfBooth(this.boothId), true, false);
    if(combinationsResp instanceof Array) this.combinations = combinationsResp;

    const membersResp = await this.$publicAPI.wrap(() => this.$publicAPI.apiCaller.fetchAllMembersOfBooth(this.boothId), true, false);
    if(membersResp instanceof Array) this.members = membersResp;

    const categoriesResp = await this.$publicAPI.wrap(() => this.$publicAPI.apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId), true, false);
    if(categoriesResp instanceof Array) this.categories = categoriesResp;
    // TODO: error handling for each API calls

    this.isExtraDataLoaded = true;
  }

  openGoodsItemDetailsDialog(id: number, isCombination: boolean = false) {
    const targetData = isCombination
      ? this.combinationsNormalized.find((combination) => combination.id === id)
      : this.goodsNormalized.find((goods) => goods.id === id);

    if(targetData) {
      this.goodsItemDetailsDialogTargetData = targetData;
      this.goodsItemDetailsDialogOwnerMembers = this.members.filter((member) => targetData.ownerMemberIds?.includes(member.id));
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
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
  }
}
</style>
