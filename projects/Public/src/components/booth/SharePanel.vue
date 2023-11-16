<template>
  <VSheet class="position-fixed d-flex flex-column pa-2">
    <VBtn class="my-1" variant="outlined" icon @click.stop="shareTwitter">
      <VIcon>mdi-twitter</VIcon>
      <VTooltip activator="parent" location="bottom">X <small>(트위터)</small></VTooltip>
    </VBtn>
    <VBtn class="my-1" variant="outlined" icon @click.stop="shareURL">
      <VIcon>mdi-clipboard-text</VIcon>
      <VTooltip activator="parent" location="bottom">URL 복사</VTooltip>
    </VBtn>
    <VBtn class="my-1" variant="outlined" icon @click.stop="showBoothQRCodeDialog = true">
      <VIcon>mdi-qrcode</VIcon>
      <VTooltip activator="parent" location="bottom">QR 코드 생성</VTooltip>
    </VBtn>
  </VSheet>

  <BoothQRCodeDialog v-model="showBoothQRCodeDialog"
                     :boothId="boothId" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import BoothQRCodeDialog from "../dialogs/BoothQRCodeDialog.vue";

@Component({
  components: {
    BoothQRCodeDialog,
  },
})
export default class SharePanel extends Vue {
  showBoothQRCodeDialog: boolean = false;

  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }

  shareTwitter(): void {
    const content = encodeURIComponent("부스 정보 확인하기");
    const url = `https://twitter.com/intent/tweet?text=${content}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  }

  shareURL(): void {
    navigator.clipboard.writeText(window.location.href);
  }
}
</script>
