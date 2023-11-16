<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="부스 페이지 QR 코드">
    <p class="text-center text-caption">{{ boothPublicUrl }}</p>
    <canvas ref="qrcode" class="d-block mx-auto"></canvas>
  </CommonDialog>
</template>

<script lang="ts">
import QRCode, { type QRCodeRenderersOptions } from "qrcode";
import { Component, Model, Prop, Ref, Vue, Watch } from "vue-facing-decorator";

@Component({})
export default class BoothQRCodeDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: Number, required: true }) boothId!: number;

  @Ref("qrcode") qrcodeRef: HTMLCanvasElement | null = null;

  readonly qrcodeOptions: QRCodeRenderersOptions = {
    errorCorrectionLevel: "Q",
    scale: 8,
  };

  async mounted() { await this.generateQRCode(); }

  @Watch("open") @Watch("boothId")
  async generateQRCode() {
    if(this.boothId > 0 && this.qrcodeRef) {
      // FIXME: qrcodeRef is null after mounted, so this not works on opening dialog...
      await QRCode.toCanvas(this.qrcodeRef, this.boothPublicUrl, this.qrcodeOptions);
    }
  }

  get boothPublicUrl(): string {
    return `${window.location.origin}/booth/${this.boothId}`;
  }
}
</script>
