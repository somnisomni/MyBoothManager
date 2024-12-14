<template>
  <VScrollYReverseTransition leaveAbsolute>
    <div v-if="!boothList || boothList.length <= 0"
         class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <h4 class="text-h4 text-center text-info">
        <VIcon class="mr-2">mdi-weather-dust</VIcon>
        <span>현재 운영 중이거나 준비 중인 부스가 없어요!</span>
      </h4>

      <VBtn class="mt-4"
            size="large"
            color="info"
            variant="outlined"
            prependIcon="mdi-refresh"
            @click="reloadWindow">
        <span>새로고침</span>
      </VBtn>
    </div>

    <VContainer v-else
                class="d-flex flex-column">
      <VLayout v-for="fair in fairList"
               :key="fair.id"
               class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <div class="my-1">
          <h5 class="text-h5 font-weight-bold">
            <span>{{ fair.name }}</span>
            <small class="ml-2 font-weight-medium"
                   style="font-size: 0.75em;">@ {{ fair.location }}</small>
          </h5>
          <h6 class="text-subtitle-1 font-weight-light">
            <a v-if="fair.websiteUrl"
               :href="fair.websiteUrl"
               target="_blank"
               class="mr-2 text-decoration-none"
               style="color: currentColor;">
              <VIcon icon="mdi-link-variant"
                     size="small" />

              <VTooltip activator="parent"
                        location="bottom">
                <span>{{ fair.websiteUrl }}</span>
              </VTooltip>
            </a>

            <span>{{ toDateRangeString(fair.openingDates) }}</span>
          </h6>
        </div>

        <BoothListView :boothList="boothFairMap.get(fair.id) ?? []"
                       @click:boothItem="onBoothItemClick" />
      </VLayout>

      <VLayout class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <h5 class="text-h5 font-weight-bold my-1">기타 운영 중인 부스</h5>
        <BoothListView :boothList="boothListOpened"
                       @click:boothItem="onBoothItemClick" />
      </VLayout>

      <VLayout class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <h5 class="text-h5 font-weight-bold my-1">그 외 부스</h5>
        <BoothListView :boothList="boothListOthers"
                       @click:boothItem="onBoothItemClick" />
      </VLayout>
    </VContainer>
  </VScrollYReverseTransition>
</template>

<script lang="ts">
import type { IBooth, IBoothResponse, IFair, IFairResponse } from "@myboothmanager/common";
import { APP_NAME, BoothStatus, toDateRangeString } from "@myboothmanager/common";
import { Vue } from "vue-facing-decorator";

function filterBoothList(boothList: IBooth[]): IBooth[] {
  // Don't include closed booths in the booth list view
  return boothList.filter(booth => booth.status.status !== BoothStatus.CLOSE);
}

function filterFairList(fairList: IFair[], boothList: IBooth[]): IFair[] {
  // Don't include fairs that no booth is assigned to
  return fairList.filter(fair => boothList.findIndex(booth => booth.fair && booth.fair.id === fair.id) >= 0);
}

@NuxtComponent({
  async asyncData(nuxt) {
    const boothList: IBooth[] = filterBoothList(await nuxt.$publicAPI.wrap(() => nuxt.$publicAPI.apiCaller.fetchAllBooths()) as IBoothResponse[]);
    const fairList: IFair[] = filterFairList(await nuxt.$publicAPI.wrap(() => nuxt.$publicAPI.apiCaller.fetchAvailableFairs()) as IFairResponse[], boothList);

    return { boothList, fairList };
  },
  setup() {
    const boothList = filterBoothList(useNuxtData<IBooth[]>(useNuxtApp().$publicAPI.apiCaller.fetchAllBooths.name).data.value ?? []);
    return {
      boothList,
      fairList: filterFairList(useNuxtData<IFair[]>(useNuxtApp().$publicAPI.apiCaller.fetchAvailableFairs.name).data.value ?? [], boothList),
    };
  },
})
export default class LandingPage extends Vue {
  readonly toDateRangeString = toDateRangeString;

  declare readonly boothList: IBooth[];
  declare readonly fairList: IFair[];

  get boothListOpened(): IBooth[] {
    return this.boothList.filter(booth => !booth.fair && booth.status.status === BoothStatus.OPEN);
  }

  get boothListOthers(): IBooth[] {
    return this.boothList.filter(booth => !booth.fair && !this.boothListOpened.includes(booth));
  }

  get boothFairMap(): Map<number, IBooth[]> {
    // Map<Fair ID, Array<Booth>>
    const map = new Map<number, IBooth[]>();

    this.boothList.forEach((booth) => {
      if(booth.fair) {
        if(!map.has(booth.fair.id)) {
          map.set(booth.fair.id, []);
        }

        map.get(booth.fair.id)?.push(booth);
      }
    });

    return map;
  }

  mounted(): void {
    /* *** Set document metadata *** */
    useHeadSafe({
      title: `${APP_NAME} - 부스 목록`,
    });
    useSeoMeta({ });
  }

  reloadWindow(): void {
    window.location.reload();
  }

  async onBoothItemClick(boothId: number): Promise<void> {
    await navigateTo({ path: `/booth/${boothId}` });
  }
}
</script>
