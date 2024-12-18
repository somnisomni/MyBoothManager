<template>
  <VContainer>
    <VCard class="pa-0 ma-0 rounded-lg"
           elevation="4">
      <ImageWithUpload :existingSrc="imagePath"
                       contextName="인포"
                       width="100%"
                       height="auto"
                       aspectRatio="auto"
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
class InfoInfoImagePage extends Vue {
  get imagePath(): string | null {
    return useAdminStore().currentBooth.booth!.infoImage?.path ?? null;
  }

  async imageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadBoothInfoImage(file!);
  }

  async imageDeleteCallback() {
    return await useAdminAPIStore().deleteBoothInfoImage();
  }
}

export default toNative(InfoInfoImagePage);
</script>
