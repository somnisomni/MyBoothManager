<template>
  <VSheet class="bg-transparent position-fixed d-flex flex-column pa-2" style="top: 0; right: 0; z-index: 10">
    <VBtn class="share-button my-1" variant="outlined" icon @click.stop="shareTwitter">
      <VIcon>mdi-twitter</VIcon>
      <VTooltip activator="parent" location="bottom">X <small>(트위터)</small></VTooltip>
    </VBtn>
    <VBtn class="share-button my-1" variant="outlined" icon @click.stop="shareURL">
      <VIcon>mdi-clipboard-text</VIcon>
      <VTooltip activator="parent" location="bottom">URL 복사</VTooltip>
    </VBtn>
    <VBtn class="share-button my-1" variant="outlined" icon @click.stop="showBoothQRCodeDialog = true">
      <VIcon>mdi-qrcode</VIcon>
      <VTooltip activator="parent" location="bottom">QR 코드 생성</VTooltip>
    </VBtn>
  </VSheet>

  <VSnackbar v-model="showURLCopiedSnackbar" location="top" timeout="2000">부스 페이지 URL이 복사되었습니다.</VSnackbar>
  <VSnackbar v-model="showURLCopyFailedSnackbar" location="top" timeout="2000">부스 페이지 URL을 복사할 수 없습니다.</VSnackbar>
  <BoothQRCodeDialog v-model="showBoothQRCodeDialog"
                     :boothId="boothId" />
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import BoothQRCodeDialog from "../dialogs/BoothQRCodeDialog.vue";

@Component({
  components: {
    BoothQRCodeDialog,
  },
})
export default class SharePanel extends Vue {
  @Prop({ type: Object, required: true }) boothData!: IBooth;

  showURLCopiedSnackbar: boolean = false;
  showURLCopyFailedSnackbar: boolean = false;
  showBoothQRCodeDialog: boolean = false;

  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }

  shareTwitter(): void {
    const content = encodeURIComponent(`『 ${this.boothData.name}』\n\n부스 정보 확인하기 ↓\n`);
    const href = encodeURIComponent(window.location.href);
    const url = `https://twitter.com/intent/tweet?text=${content}&url=${href}`;
    window.open(url, "_blank");
  }

  async shareURL() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch(e) {
      this.showURLCopyFailedSnackbar = true;
      return;
    }

    this.showURLCopiedSnackbar = true;
  }
}
</script>

<style lang="scss" scoped>
.share-button {
  background-color: rgba(var(--v-theme-background), 0.66);

  -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
}
</style>
