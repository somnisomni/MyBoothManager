<template>
  <VScrollYReverseTransition leave-absolute>
    <div v-if="!hasAnyBooth"
         class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <h4 class="text-h4 text-center text-info">
        <VIcon class="mr-2">mdi-weather-dust</VIcon>
        <span>현재 운영 중이거나 준비 중인 부스가 없어요!</span>
      </h4>

      <VBtn class="mt-4"
            size="large"
            color="info"
            variant="outlined"
            prepend-icon="mdi-refresh"
            @click="reloadWindow">새로고침</VBtn>
    </div>

    <VContainer v-else
                class="d-flex flex-column">
      <VLayout v-for="fair in fairList"
               :key="fair.id"
               class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <div class="my-1">
          <h5 class="text-h5 font-weight-bold">{{ fair.name }} <small class="ml-2 font-weight-medium" style="font-size: 0.75em;">@ {{ fair.location }}</small></h5>
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

        <BoothListView :boothList="getBoothsOfFair(fair.id)"
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
import { BoothStatus, toDateRangeString, type IBooth, type IBoothResponse, type IFair, type IFairResponse } from "@myboothmanager/common";
import { Vue } from "vue-facing-decorator";

@NuxtComponent({
  async asyncData(nuxtApp) {
    function filterBoothList(boothList: Array<IBooth>) {
      // Don't include closed booths in the booth list view
      return boothList.filter((booth) => booth.status.status !== BoothStatus.CLOSE);
    }

    function filterFairList(fairList: Array<IFair>, boothList: Array<IBooth>) {
      // Don't include fairs that no booth is assigned to
      return fairList.filter((fair) => boothList.findIndex((booth) => booth.fair && booth.fair.id === fair.id) >= 0);
    }

    const boothList: Array<IBooth> = filterBoothList(await nuxtApp.$publicAPI.wrap(() => nuxtApp.$publicAPI.apiCaller.fetchAllBooths()) as Array<IBoothResponse>);
    const fairList: Array<IFair> = filterFairList(await nuxtApp.$publicAPI.wrap(() => nuxtApp.$publicAPI.apiCaller.fetchAvailableFairs()) as Array<IFairResponse>, boothList);
    const hasAnyBooth = await nuxtApp.runWithContext(() => useState<boolean>("hasAnyBooth", () => boothList.length > 0));

    return { boothList, fairList, hasAnyBooth };
  },
})
export default class LandingPage extends Vue {
  readonly toDateRangeString = toDateRangeString;

  declare readonly boothList: Array<IBooth>;
  declare readonly fairList: Array<IFair>;
  declare readonly hasAnyBooth: boolean;

  get boothListOpened() {
    return this.boothList.filter((booth) => !booth.fair && booth.status.status === BoothStatus.OPEN);
  }

  get boothListOthers() {
    return this.boothList.filter((booth) => !booth.fair && !this.boothListOpened.includes(booth));
  }

  getBoothsOfFair(fairId: number) {
    return this.boothList.filter((booth) => booth.fair && booth.fair.id === fairId);
  }

  reloadWindow() { window.location.reload(); }

  async onBoothItemClick(boothId: number) {
    await useRouter().push({ path: `/booth/${boothId}` });
  }
}
</script>
