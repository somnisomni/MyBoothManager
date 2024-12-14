<template>
  <div>
    <ImageWithUpload :existingSrc="boothBannerImagePath"
                     contextName="배너"
                     width="100%"
                     height="300px"
                     aspectRatio="3/1"
                     :uploadCallback="boothBannerImageUploadCallback"
                     :deleteCallback="boothBannerImageDeleteCallback" />

    <VContainer class="mt-2 pa-2 pa-md-6">
      <BoothInfoPanel class="mb-4" />
      <BoothMembersPanel class="my-4" />

      <ImageWithUpload :existingSrc="boothInfoImagePath"
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
import ImageWithUpload from "@/components/common/ImageWithUpload.vue";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";
import BoothMembersPanel from "@/components/info/BoothMembersPanel.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";

@Component({
  components: {
    ImageWithUpload,
    BoothInfoPanel,
    BoothMembersPanel,
  },
})
export default class InfoPage extends Vue {
  get boothBannerImagePath(): string | null {
    const booth = useAdminStore().currentBooth.booth;

    if(!booth) {
      return null;
    }

    return booth.bannerImage?.path ?? null;
  }

  get boothInfoImagePath(): string | null {
    const booth = useAdminStore().currentBooth.booth;

    if(!booth) {
      return null;
    }

    return booth.infoImage?.path ?? null;
  }

  async boothBannerImageUploadCallback(file: File | Blob | null): Promise<boolean> {
    if(!file) {
      return false;
    }

    const response = await useAdminAPIStore().uploadBoothBannerImage(file);

    if(typeof response === "number") {
      return false;
    }

    return true;
  }

  async boothBannerImageDeleteCallback(): Promise<boolean> {
    const response = await useAdminAPIStore().deleteBoothBannerImage();

    if(typeof response === "number") {
      return false;
    }

    return true;
  }

  async boothInfoImageUploadCallback(file: File | Blob | null): Promise<boolean> {
    if(!file) {
      return false;
    }

    const response = await useAdminAPIStore().uploadBoothInfoImage(file);

    if(typeof response === "number") {
      return false;
    }

    return true;
  }

  async boothInfoImageDeleteCallback(): Promise<boolean> {
    const response = await useAdminAPIStore().deleteBoothInfoImage();

    if(typeof response === "number") {
      return false;
    }

    return true;
  }
}
</script>
