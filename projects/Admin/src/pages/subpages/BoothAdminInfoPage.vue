<template>
  <div>
    <div class="mb-2">
      <VLayout class="d-flex flex-column align-center justify-center text-center w-100 rounded-lg" style="min-height: 300px">
        <VImg v-if="bannerImageSource" :src="bannerImageSource" cover class="w-100" style="height: 300px; aspect-ratio: 3/1;" />
        <span v-else class="text-body-1 text-disabled"><VIcon>mdi-image-remove</VIcon> 배너 이미지가 없습니다.</span>
        <VExpandTransition>
          <VProgressLinear v-if="bannerImageUpdateInProgress" indeterminate />
        </VExpandTransition>
      </VLayout>
      <VContainer class="d-flex flex-wrap align-center justify-space-between overflow-visible py-0 my-2">
        <VLayout class="d-flex flex-0-0 align-center justify-start pa-2 pl-0 overflow-visible">
          <h6 class="text-h6 font-weight-bold mr-2">배너 이미지</h6>
          <VBtn v-if="bannerImageSource" :disabled="bannerImageUpdateInProgress" class="mr-2" color="red-darken-1" @click="onBannerImageRequestDelete"><VIcon>mdi-delete</VIcon></VBtn>

          <span v-if="bannerImageNeedUpdate" class="text-body-2 text-warning"><VIcon>mdi-alert</VIcon> 변경 사항이 아직 적용되지 않았습니다.</span>
          <VFadeTransition leave-absolute>
            <span v-if="bannerImageUpdateOK" class="text-body-2 text-success"><VIcon>mdi-check</VIcon> 업데이트 성공</span>
          </VFadeTransition>
        </VLayout>

        <VLayout class="d-flex flex-0-0 align-center justify-end pa-2 pr-0 overflow-visible">
          <FileInputButton v-model="bannerImageFileSelection" :accepts="FileInputAccepts.IMAGE" :disabled="bannerImageUpdateInProgress" class="flex-grow-0" hideFileName @change="onBannerImageFileChange" />
          <VBtn :disabled="!bannerImageNeedUpdate || bannerImageUpdateInProgress" @click="uploadBannerImage" :color="bannerImageWillBeDeleted ? 'red-darken-1' : 'primary'">
            <span v-if="bannerImageWillBeDeleted">이미지 삭제</span>
            <span v-else>업로드</span>
          </VBtn>
        </VLayout>
      </VContainer>
    </div>

    <VContainer class="mt-2 pa-2 pa-md-6">
      <BoothInfoPanel class="mb-4" />
      <BoothMembersPanel class="my-4" />
    </VContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";
import BoothMembersPanel from "@/components/info/BoothMembersPanel.vue";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";
import FileInputButton, { FileInputAccepts } from "@/components/common/FileInputButton.vue";

@Component({
  components: {
    FileInputButton,
    BoothInfoPanel,
    BoothMembersPanel,
  },
})
export default class BoothAdminInfoPage extends Vue {
  readonly FileInputAccepts = FileInputAccepts;

  bannerImageUpdateInProgress: boolean = false;
  bannerImageUpdateOK: boolean = false;
  bannerImageFileSelection: File | Blob | null = null;
  bannerImageWillBeDeleted: boolean = false;
  bannerImageNeedUpdate: boolean = false;
  bannerImageFilePickedObjectURL: string | null = null;

  onBannerImageFileChange() {
    this.bannerImageWillBeDeleted = false;

    if(this.bannerImageFileSelection) {
      this.bannerImageNeedUpdate = true;
      this.bannerImageFilePickedObjectURL = URL.createObjectURL(this.bannerImageFileSelection);
    } else {
      this.bannerImageNeedUpdate = false;
      this.bannerImageFilePickedObjectURL = null;
    }
  }

  onBannerImageRequestDelete() {
    this.bannerImageWillBeDeleted = true;
    this.bannerImageNeedUpdate = true;
  }

  async uploadBannerImage() {
    this.bannerImageUpdateInProgress = true;

    const response = this.bannerImageFileSelection ? await useAdminStore().uploadBoothBannerImage(this.bannerImageFileSelection) : await useAdminStore().deleteBoothBannerImage();

    if(response === true) {
      this.bannerImageFileSelection = null;
      this.onBannerImageFileChange();

      this.bannerImageUpdateOK = true;
      setTimeout(() => { this.bannerImageUpdateOK = false; }, 3000);
    } else {
      alert("error " + response);
    }

    this.bannerImageUpdateInProgress = false;
  }

  get bannerImageSource(): string | null {
    if(this.bannerImageWillBeDeleted) return null;

    return this.bannerImageFilePickedObjectURL ?? getUploadFilePath(useAdminStore().boothList[useAdminStore().currentBoothId].bannerImageUrl);
  }
}
</script>
