<template>
  <VScrollYReverseTransition leave-absolute>
    <VContainer v-if="boothList && !isLoadingBoothList" class="d-flex flex-column">
      <VLayout v-for="fair in fairList"
               :key="fair.id"
               class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <div class="my-1">
          <h5 class="text-h5 font-weight-bold">{{ fair.name }} <small class="font-weight-medium">@ {{ fair.location }}</small></h5>
          <h6 class="text-subtitle-1 font-weight-light">
            <a v-if="fair.websiteUrl"
               :href="fair.websiteUrl"
               target="_blank"
               class="mr-2 text-decoration-none"
               style="color: currentColor;">
              <VIcon icon="mdi-web"
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

    <div v-else class="d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <VProgressCircular indeterminate size="x-large" color="primary" class="my-2" />
      <span class="mt-2 text-grey-darken-2">부스 목록 불러오는 중...</span>
    </div>
  </VScrollYReverseTransition>
</template>

<script lang="ts">
import { BoothStatus, toDateRangeString, type ErrorCodes, type IBooth, type IFair } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import BoothListView from "@/components/booth/BoothListView.vue";
import { useAPIStore } from "@/plugins/stores/api";
import router from "@/plugins/router";

@Component({
  components: {
    BoothListView,
  },
})
export default class LandingPage extends Vue {
  readonly toDateRangeString = toDateRangeString;

  isLoadingBoothList: boolean = true;
  fetchError: ErrorCodes | null = null;

  _fairList: Array<IFair> = [];
  get fairList() { return this._fairList; }
  set fairList(value: Array<IFair>) {
    // Don't include fairs that no booth is assigned to
    this._fairList = value.filter((fair) => this.boothList.findIndex((booth) => booth.fair && booth.fair.id === fair.id) !== -1);
  }

  _boothList: Array<IBooth> = [];
  get boothList() { return this._boothList; }
  set boothList(value: Array<IBooth>) {
    // Don't include closed booths in the booth list view
    this._boothList = value.filter((booth) => booth.status.status !== BoothStatus.CLOSE);
  }

  get boothListOpened() {
    return this.boothList.filter((booth) => !booth.fair && booth.status.status === BoothStatus.OPEN);
  }

  get boothListOthers() {
    return this.boothList.filter((booth) => !booth.fair && !this.boothListOpened.includes(booth));
  }

  async mounted() {
    this.isLoadingBoothList = true;

    const boothResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAllBooths());
    const fairResponse = await useAPIStore().apiWrapper(() => useAPIStore().apiCaller.fetchAvailableFairs());

    if("errorCode" in boothResponse) {
      this.fetchError = (boothResponse || fairResponse).errorCode;
      return;
    }

    if("errorCode" in fairResponse) {
      this.fetchError = fairResponse.errorCode;
      return;
    }

    this.boothList = boothResponse;
    this.fairList = fairResponse;
    this.isLoadingBoothList = false;
  }

  getBoothsOfFair(fairId: number) {
    return this.boothList.filter((booth) => booth.fair && booth.fair.id === fairId);
  }

  async onBoothItemClick(boothId: number) {
    await router.push({ name: "booth-individual", params: { boothId } });
  }
}
</script>
