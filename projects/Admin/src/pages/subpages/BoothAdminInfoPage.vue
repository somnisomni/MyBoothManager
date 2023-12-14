<template>
  <div>
    <ImageWithUpload :existingSrc="boothBannerImageUrl"
                     contextName="배너"
                     height="300px"
                     aspectRatio="3/1"
                     :uploadCallback="boothBannerImageUploadCallback"
                     :deleteCallback="boothBannerImageDeleteCallback" />

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
import ImageWithUpload from "@/components/common/ImageWithUpload.vue";
import { useAdminStore } from "@/stores/admin";

@Component({
  components: {
    ImageWithUpload,
    BoothInfoPanel,
    BoothMembersPanel,
  },
})
export default class BoothAdminInfoPage extends Vue {
  get boothBannerImageUrl(): string | null {
    return useAdminStore().boothList[useAdminStore().currentBoothId].bannerImageUrl ?? null;
  }

  async boothBannerImageUploadCallback(file: File | Blob | null) {
    return await useAdminStore().uploadBoothBannerImage(file!);
  }

  async boothBannerImageDeleteCallback() {
    return await useAdminStore().deleteBoothBannerImage();
  }
}
</script>
