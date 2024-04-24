<template>
  <div>
    <ImageWithUpload :existingSrc="boothBannerImageUrl"
                     contextName="배너"
                     width="100%"
                     height="300px"
                     aspectRatio="3/1"
                     :uploadCallback="boothBannerImageUploadCallback"
                     :deleteCallback="boothBannerImageDeleteCallback" />

    <VContainer class="mt-2 pa-2 pa-md-6">
      <BoothInfoPanel class="mb-4" />
      <BoothMembersPanel class="my-4" />

      <ImageWithUpload :existingSrc="boothInfoImageUrl"
                       contextName="인포"
                       width="100%"
                       height="auto"
                       aspectRatio="auto"
                       :uploadCallback="boothInfoImageUploadCallback"
                       :deleteCallback="boothInfoImageDeleteCallback" />
    </VContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";
import BoothMembersPanel from "@/components/info/BoothMembersPanel.vue";
import ImageWithUpload from "@/components/common/ImageWithUpload.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";

@Component({
  components: {
    ImageWithUpload,
    BoothInfoPanel,
    BoothMembersPanel,
  },
})
export default class BoothAdminInfoPage extends Vue {
  get boothBannerImageUrl(): string | null {
    return useAdminStore().currentBooth.booth!.bannerImageUrl ?? null;
  }

  get boothInfoImageUrl(): string | null {
    return useAdminStore().currentBooth.booth!.infoImageUrl ?? null;
  }

  async boothBannerImageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadBoothBannerImage(file!);
  }

  async boothBannerImageDeleteCallback() {
    return await useAdminAPIStore().deleteBoothBannerImage();
  }

  async boothInfoImageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadBoothInfoImage(file!);
  }

  async boothInfoImageDeleteCallback() {
    return await useAdminAPIStore().deleteBoothInfoImage();
  }
}
</script>
