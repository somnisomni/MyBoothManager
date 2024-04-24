<template>
  <CommonDialog v-model="open"
                :progressActive="boothListFetching"
                :contentNoPadding="true"
                :titleExtraButtons="titleButtons"
                :titleExtraMargin="true"
                :dialogCancelText="null"
                :closeOnCancel="false"
                fullscreenOnSmallScreen
                dialogTitle="관리할 부스 선택">
    <VSheet v-for="booth in boothList.value"
            :key="booth.id"
            class="booth-item no-selection-all"
            :class="{ 'current no-interaction-all': booth.id === currentBoothId}"
            min-height="120px"
            ref="boothItems"
            v-ripple
            @click.stop="onBoothSelect(booth.id)">
      <div class="booth-item-image-container">
        <VImg :src="getBoothBannerImageURL(booth.bannerImageUrl, booth.id)" cover aspect-ratio="4/1" class="booth-item-image" />
        <div class="booth-item-image-overlay"></div>
      </div>

      <VLayout class="booth-item-info w-100 h-100 pa-3 d-flex flex-row align-end justify-start">
        <VLayout class="d-flex flex-column align-start justify-end">
          <div class="booth-item-name">{{ booth.name }}</div>
          <div class="booth-item-desc">{{ booth.description }}</div>
        </VLayout>
        <div class="flex-shrink-0">{{ getBoothStatusString(booth.status) }}</div>
      </VLayout>

      <div v-if="booth.id === currentBoothId" class="booth-item-current-indicator bg-primary text-body-2">현재 관리 중인 부스</div>
    </VSheet>

    <BoothManageDialog v-model="boothAddDialogShown"
                       :editMode="false" />
  </CommonDialog>
</template>

<script lang="ts">
import { Vue, Component, Model, Watch } from "vue-facing-decorator";
import { type IBooth } from "@myboothmanager/common";
// import { type CommonDialogButtonParams } from "@myboothmanager/common-ui";
import { ref, type Ref as VueRef } from "vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { getUploadFilePath } from "@/lib/functions";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { getBoothStatusString } from "@/lib/enum-to-string";
import BoothManageDialog from "./BoothManageDialog.vue";

@Component({
  components: {
    BoothManageDialog,
  },
})
export default class BoothSelectionDialog extends Vue {
  readonly getBoothStatusString = getBoothStatusString;

  @Model({ type: Boolean, default: false }) open!: boolean;

  boothList: VueRef<Array<IBooth>> = ref([]);
  boothListFetching = false;
  boothAddDialogShown = false;
  titleButtons/* : CommonDialogButtonParams[] */ = [
    {
      title: "목록 새로고침",
      icon: "mdi-refresh",
      onClick: async () => { await this.refreshBoothList(); },
    },
    {
      title: "새로운 부스 추가",
      icon: "mdi-plus",
      onClick: this.showBoothAddDialog,
    },
  ];

  get currentBoothId() {
    return useAdminStore().currentBooth.booth!.id;
  }

  @Watch("open", { immediate: true })
  @Watch("boothItems", { immediate: true })
  onDialogOpen(value: boolean) {
    if(value) this.refreshBoothList();
  }

  getBoothBannerImageURL(path?: string, fallbackId: string | number = 1): string {
    return getUploadFilePath(path) ?? `https://picsum.photos/seed/${fallbackId}/1500/300`;
  }

  showBoothAddDialog(): void {
    this.boothAddDialogShown = true;
  }

  async refreshBoothList() {
    this.boothListFetching = true;

    const response = await useAdminAPIStore().fetchAllBoothsOfCurrentAccount();
    if(response instanceof Array) this.boothList.value = response;

    this.boothListFetching = false;
  }

  onBoothSelect(boothId: number) {
    useAdminStore().changeBooth(boothId);
    this.open = false;
  }
}
</script>

<style lang="scss" scoped>
.booth-item {
  cursor: pointer;
  position: relative;
  width: 100%;
  aspect-ratio: 4/1;

  & > * {
    position: relative;
  }

  .booth-item-image-container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;

    .booth-item-image-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-backdrop-filter: blur(0.25em);
              backdrop-filter: blur(0.25em);
      transition: background-color 0.25s, backdrop-filter 0.25s;
    }

    .booth-item-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  &:hover, &.current {
    .booth-item-image-container .booth-item-image-overlay {
      background-color: rgba(0, 0, 0, 0.4);
      -webkit-backdrop-filter: blur(0);
              backdrop-filter: blur(0);
    }
  }

  .booth-item-info {
    color: white;
    line-height: 1.125;

    .booth-item-name {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .booth-item-current-indicator {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.5em 1.25em 0.5em 0.75em;
    margin-top: 1em;
  }
}
</style>

<style lang="scss">
/* Workaround */
.booth-selection-dialog > .v-overlay__content { overflow: initial !important; }
</style>
