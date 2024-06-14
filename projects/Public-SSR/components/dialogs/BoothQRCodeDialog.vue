<template>
  <CommonDialog v-model="open"
                width="400px"
                dialogTitle="부스 페이지 QR 코드">
    <div v-if="boothPublicUrl">
      <p class="text-center text-caption">{{ boothPublicUrl }}</p>
      <canvas ref="qrcode" class="d-block mx-auto h-auto" style="max-width: 100%;"></canvas>
    </div>
    <div v-else>
      <p class="text-error">QR 생성 불가</p>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import * as QRCode from "qrcode";
import { Component, Model, Prop, Ref, Vue, Watch, toNative } from "vue-facing-decorator";

@Component({})
class BoothQRCodeDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: Number, required: true }) boothId!: number;

  @Ref("qrcode") qrcodeRef?: HTMLCanvasElement;

  readonly qrcodeOptions: QRCode.QRCodeRenderersOptions = {
    errorCorrectionLevel: "Q",
    scale: 8,
    width: 300,
  };

  async mounted() { await this.generateQRCode(); }

  @Watch("open") @Watch("boothId")
  async generateQRCode() {
    await this.$nextTick();

    if(this.boothId > 0 && this.qrcodeRef && this.boothPublicUrl) {
      await QRCode.toCanvas(this.qrcodeRef, this.boothPublicUrl, this.qrcodeOptions);
    }
  }

  get boothPublicUrl(): string | null {
    const url = `${window.location.origin}${useRouter().resolve({ name: "booth-individual", params: { boothId: this.boothId } }).href}`;
    return URL.canParse(url) ? url : null;
  }
}

export default toNative(BoothQRCodeDialog);
</script>
