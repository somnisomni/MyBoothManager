<template>
  <VMain style="min-height: 100%">
    <div v-if="!booth || boothFetchError"
          class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <h4 class="text-h4 text-center text-error">
        <VIcon class="mr-2"
               icon="mdi-alert" />

        <span v-if="boothFetchError === ErrorCodes.ENTITY_NOT_FOUND">존재하지 않는 부스입니다.</span>
        <span v-else-if="boothFetchError === ErrorCodes.BOOTH_NOT_PUBLISHED">아직 공개되지 않은 부스입니다.</span>
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

    <div v-else>
      <SharePanel :boothData="booth"
                  showHomeButton />

      <DataUpdateFloatingButton v-if="booth.status.status !== BoothStatus.CLOSE"
                                :interval="60"
                                :fetchCallback="async () => await fetchData()" />

      <BoothInfoSection :boothData="booth" />

      <VContainer class="adjusted-vcontainer">
        <div>
          <!-- <div v-if="booth.status.status !== BoothStatus.CLOSE"
               class="d-flex flex-wrap align-center justify-end text-right ml-auto mb-2">
            <VCheckbox v-model="autoRefreshEnabled"
                       hide-details
                       class="flex-grow-0"
                       label="정보 자동 업데이트" />

            <ThrottledButton variant="outlined"
                             size="large"
                             prepend-icon="mdi-refresh"
                             class="ml-4"
                             :throttle="5"
                             :callback="async () => { await fetchData(); dataPollingRunner?.updateLastExecutedTimestampToCurrent(); }">
              <span>새로고침</span>
            </ThrottledButton>
          </div>

          <VExpandTransition>
            <p v-if="dataPollingRunner"
               class="text-right text-primary"
               style="opacity: 0.5">※ 부스 정보가 {{ dataPollingInterval / 1000 }}초마다 자동 업데이트됩니다.</p>
          </VExpandTransition> -->
        </div>

        <VSpacer class="my-8" />

        <div v-if="members.length > 0">
          <ExpandableContent heading="멤버 목록">
            <div class="d-flex flex-row flex-wrap justify-center">
              <BoothMemberItem v-for="member in members"
                               :key="member.id"
                               :memberData="member" />
            </div>
          </ExpandableContent>
        </div>

        <VSpacer v-if="infoImage.url"
                 class="my-8" />

        <div v-if="infoImage.url" class="w-100">
          <ExpandableContent heading="부스 인포">
            <VImg :src="infoImage.url"
                  :lazy-src="infoImage.thumbnail ?? undefined"
                  class="booth-info-image w-100 no-interaction rounded-lg"
                  position="top"
                  cover />
          </ExpandableContent>
        </div>

        <VSpacer class="my-8" />

        <div>
          <ExpandableContent heading="굿즈 목록">
            <GoodsListView v-if="goodsNormalized.length > 0"
                           :currencySymbol="booth.currencySymbol"
                           :goodsList="[...goodsNormalized, ...combinationsNormalized]"
                           :goodsCategoryList="categories"
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

    <GoodsItemDetailsDialog v-model="goodsItemDetailsDialogOpen"
                            :data="goodsItemDetailsDialogTargetData"
                            :ownerMembersData="goodsItemDetailsDialogOwnerMembers" />
  </VMain>
</template>

<script lang="ts">
import { APP_NAME, BoothStatus, DEVELOPER_TWITTER_HANDLE, ErrorCodes, type IBooth, type IBoothMember, type IBoothResponse, type IErrorResponse, type IGoods, type IGoodsCategory, type IGoodsCombination } from "@myboothmanager/common";
import { Goods, GoodsBase, GoodsCombination } from "@myboothmanager/common-ui";
import { Vue } from "vue-facing-decorator";
import { getUploadFileUrl } from "#imports";

@NuxtComponent({
  async asyncData(context) {
    const { $publicAPI } = context;

    const boothId = Number(context.$router.currentRoute.value.params["id"] as string);
    const boothFetchError = useState<ErrorCodes | null>("boothFetchError", () => null);

    if(!boothId || boothId <= 0) {
      boothFetchError.value = ErrorCodes.INVALID_REQUEST_BODY;
      return { boothFetchError };
    }

    let booth: IBoothResponse | IErrorResponse | null = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchSingleBooth(boothId));
    let members: Array<IBoothMember> = [];
    let categories: Array<IGoodsCategory> = [];
    let goods: Array<IGoods> = [];
    let combinations: Array<IGoodsCombination> = [];

    if("errorCode" in booth) {
      boothFetchError.value = booth.errorCode;
      booth = null;
      return { boothFetchError, booth };
    }

    if(booth && !("errorCode" in booth)) {
      const goodsResp = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchAllGoodsOfBooth(boothId));
      if(goodsResp instanceof Array) goods = goodsResp;

      const combinationsResp = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchAllGoodsCombinationOfBooth(boothId));
      if(combinationsResp instanceof Array) combinations = combinationsResp;

      const membersResp = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchAllMembersOfBooth(boothId));
      if(membersResp instanceof Array) members = membersResp;

      const categoriesResp = await $publicAPI.wrap(() => $publicAPI.apiCaller.fetchAllGoodsCategoryOfBooth(boothId));
      if(categoriesResp instanceof Array) categories = categoriesResp;
    }

    return { boothFetchError, booth, members, goods, combinations, categories };
  },
  setup() {
    const FETCH_KEYS = {
      booth: useNuxtApp().$publicAPI.apiCaller.fetchSingleBooth.name,
      members: useNuxtApp().$publicAPI.apiCaller.fetchAllMembersOfBooth.name,
      goods: useNuxtApp().$publicAPI.apiCaller.fetchAllGoodsOfBooth.name,
      combinations: useNuxtApp().$publicAPI.apiCaller.fetchAllGoodsCombinationOfBooth.name,
      categories: useNuxtApp().$publicAPI.apiCaller.fetchAllGoodsCategoryOfBooth.name,
    } as const;

    // Explicit check for booth data availability
    let booth: Ref<IBooth | IErrorResponse | null> = useNuxtData<IBooth>(FETCH_KEYS.booth).data ?? null;
    if(!booth.value || "errorCode" in booth.value) {
      booth = ref(null);
    }

    return {
      FETCH_KEYS,
      boothId: Number(useRoute().params["id"] as string),
      boothFetchError: useState("boothFetchError", () => null) ?? null,
      booth,
      members: useNuxtData(FETCH_KEYS.members).data ?? [],
      goods: useNuxtData(FETCH_KEYS.goods).data ?? [],
      combinations: useNuxtData(FETCH_KEYS.combinations).data ?? [],
      categories: useNuxtData(FETCH_KEYS.categories).data ?? [],
    };
  },
})
export default class IndividualBoothPage extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly ErrorCodes = ErrorCodes;

  goodsItemDetailsDialogOpen: boolean = false;
  goodsItemDetailsDialogTargetData: GoodsBase | null = null;
  goodsItemDetailsDialogOwnerMembers: IBoothMember[] = [];

  declare readonly FETCH_KEYS: Record<string, string>;
  declare boothFetchError: ErrorCodes | null;
  declare readonly boothId: number;
  declare readonly booth: IBooth | null;
  declare readonly members: Array<IBoothMember>;
  declare readonly categories: Array<IGoodsCategory>;
  declare readonly goods: Array<IGoods>;
  declare readonly combinations: Array<IGoodsCombination>;

  get goodsNormalized(): Array<Goods> {
    return this.goods.map((goods) => new Goods(goods));
  }

  get combinationsNormalized(): Array<GoodsCombination> {
    return this.combinations.map((combination) => new GoodsCombination(combination));
  }

  get infoImage() {
    return {
      url: getUploadFileUrl(this.booth?.infoImage?.path),
      thumbnail: this.booth?.infoImage?.thumbnailData,
    };
  }

  get autoRefreshEnabled(): boolean { return useLocalStore().boothPageSettings.enableAutoRefresh; }
  set autoRefreshEnabled(value: boolean) { useLocalStore().boothPageSettings.enableAutoRefresh = value; }

  mounted() {
    /* *** Set last visited booth id *** */
    useLocalStore().boothPageSettings.lastVisitedBoothId = this.boothId;
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
    /* *** Refresh data *** */
    await refreshNuxtData(Object.values(this.FETCH_KEYS ?? {}));
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
