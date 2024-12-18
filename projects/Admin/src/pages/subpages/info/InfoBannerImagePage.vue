<template>
  <VContainer>
    <VCard class="pa-0 ma-0 rounded-lg"
           elevation="4">
      <ImageWithUpload :existingSrc="imagePath"
                       contextName="배너"
                       width="100%"
                       height="300px"
                       aspectRatio="3/1"
                       :uploadCallback="imageUploadCallback"
                       :deleteCallback="imageDeleteCallback" />
    </VCard>
  </VContainer>
</template>

<script lang="ts">
import { Component, toNative, Vue } from "vue-facing-decorator";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { useAdminStore } from "@/plugins/stores/admin";

@Component({})
class InfoBannerImagePage extends Vue {
  get imagePath(): string | null {
    return useAdminStore().currentBooth.booth!.bannerImage?.path ?? null;
  }

  async imageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadBoothBannerImage(file!);
  }

  async imageDeleteCallback() {
    return await useAdminAPIStore().deleteBoothBannerImage();
  }
}

export default toNative(InfoBannerImagePage);
</script>
