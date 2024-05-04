<template>
  <VScrollYReverseTransition leave-absolute>
    <VContainer v-if="boothList && !isLoadingBoothList" class="d-flex flex-column">
      <VLayout class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <h5 class="text-h5 font-weight-bold my-1">현재 운영 중인 부스</h5>
        <BoothListView :boothList="boothListOpened"
                      @click:boothItem="onBoothItemClick" />
      </VLayout>

      <VLayout class="d-flex flex-0-0 flex-column my-4 overflow-visible">
        <h5 class="text-h5 font-weight-bold my-1">그 외 부스</h5>
        <BoothListView :boothList="boothListOthers"
                      @click:boothItem="onBoothItemClick" />
      </VLayout>
    </VContainer>

    <div v-else class="position-fixed d-flex flex-column align-center justify-center w-100 h-100 pa-2 text-center">
      <VProgressCircular indeterminate size="x-large" color="primary" class="my-2" />
      <span class="mt-2 text-grey-darken-2">부스 목록 불러오는 중...</span>
    </div>
  </VScrollYReverseTransition>
</template>

<script lang="ts">
import { BoothStatus, type ErrorCodes, type IBooth } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import BoothListView from "@/components/booth/BoothListView.vue";
import { usePublicStore } from "@/plugins/stores/public";
import router from "@/plugins/router";

@Component({
  components: {
    BoothListView,
  },
})
export default class LandingPage extends Vue {
  isLoadingBoothList: boolean = true;
  fetchError: ErrorCodes | null = null;

  _boothList: Array<IBooth> = [];
  get boothList() { return this._boothList; }
  set boothList(value: Array<IBooth>) {
    // Don't include closed booths in the booth list view
    this._boothList = value.filter((booth) => booth.status.status !== BoothStatus.CLOSE);
  }

  get boothListOpened() {
    return this.boothList.filter((booth) => booth.status.status === BoothStatus.OPEN);
  }

  get boothListOthers() {
    return this.boothList.filter((booth) => !this.boothListOpened.includes(booth));
  }

  async mounted() {
    this.isLoadingBoothList = true;

    const response = await usePublicStore().apiCaller.fetchAllBooths();

    if("errorCode" in response) {
      this.fetchError = response.errorCode;
      return;
    } else {
      this.boothList = response;
    }

    this.isLoadingBoothList = false;
  }

  async onBoothItemClick(boothId: number) {
    await router.push({ name: "booth-individual", params: { boothId } });
  }
}
</script>
