<template>
  <VLayout class="d-flex align-center pa-2">
    <input ref="fileInput"
           type="file"
           :accept="acceptsString"
           :multiple="multiple"
           class="w-0 h-0"
           style="opacity: 0" @change="onFileInputChange" />

    <slot name="button">
      <VBtn @click="onFileInputButtonClick">{{ label }}</VBtn>
    </slot>
    <span v-if="!hideFileName" class="ml-2">{{ fileName }}</span>

    <VSnackbar v-model="fileSizeExceededWarningShown" :timeout="3000" location="bottom" color="warning">
      <span class="text-body-2"><VIcon class="mr-1">mdi-alert</VIcon> {{ maxFileSizeString }}를 초과하는 파일은 선택할 수 없습니다.</span>
    </VSnackbar>
  </VLayout>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Ref, Vue } from "vue-facing-decorator";
import { MAX_UPLOAD_FILE_BYTES } from "@myboothmanager/common";

// eslint-disable-next-line import/exports-last
export enum FileInputAccepts {
  IMAGE = 0b0001,
  VIDEO = 0b0010,
  AUDIO = 0b0100,
  TEXT = 0b1000,
  ALL = 0b0000,
}

const ACCEPTS_MIMES: Record<FileInputAccepts, Array<string>> = {
  [FileInputAccepts.IMAGE]: ["image/webp", "image/heic", "image/heif", "image/png", "image/jpeg"],
  [FileInputAccepts.VIDEO]: ["video/webm", "video/x-msvideo", "video/mp4", "video/mpeg"],
  [FileInputAccepts.AUDIO]: ["audio/webm", "audio/mpeg", "audio/aac", "audio/ogg", "audio/opus"],
  [FileInputAccepts.TEXT]: ["text/plain"],
  [FileInputAccepts.ALL]: ["*/*"],
};

@Component({
  emits: ["change"],
})
export default class FileInputButton extends Vue {
  @Model({ type: File, default: null }) value!: File | null;
  @Prop({ type: String, default: "파일 선택" }) label!: string;
  @Prop({ type: Boolean, default: false }) hideFileName!: boolean;
  @Prop({ default: FileInputAccepts.ALL }) accepts!: FileInputAccepts;
  @Prop({ type: String, default: null }) acceptsCustom!: string | null;
  @Prop({ type: Boolean, default: false }) multiple!: boolean;
  @Prop({ type: Number, default: MAX_UPLOAD_FILE_BYTES }) maxFileSize!: number;  // bytes

  @Ref("fileInput") fileInput!: HTMLInputElement;

  fileSizeExceededWarningShown: boolean = false;

  async mounted() {
    if(!this.fileInput) {
      await this.$nextTick();
    }
  }

  get fileName(): string {
    return this.value?.name ?? "파일이 선택되지 않음";
  }

  get maxFileSizeString(): string {
    return `${this.maxFileSize / 1024 / 1024}MB`;
  }

  get acceptsString(): string {
    let acc: Array<string> = [];

    if(this.accepts === FileInputAccepts.ALL) {
      if(this.acceptsCustom) return this.acceptsCustom;

      acc = acc.concat(ACCEPTS_MIMES[FileInputAccepts.ALL]);
    } else {
      if((this.accepts & FileInputAccepts.IMAGE) === FileInputAccepts.IMAGE) {
        acc = acc.concat(ACCEPTS_MIMES[FileInputAccepts.IMAGE]);
      }
      if((this.accepts & FileInputAccepts.VIDEO) === FileInputAccepts.VIDEO) {
        acc = acc.concat(ACCEPTS_MIMES[FileInputAccepts.VIDEO]);
      }
      if((this.accepts & FileInputAccepts.AUDIO) === FileInputAccepts.AUDIO) {
        acc = acc.concat(ACCEPTS_MIMES[FileInputAccepts.AUDIO]);
      }
      if((this.accepts & FileInputAccepts.TEXT) === FileInputAccepts.TEXT) {
        acc = acc.concat(ACCEPTS_MIMES[FileInputAccepts.TEXT]);
      }
    }
    console.log(this.accepts, acc);

    return acc.join(",");
  }

  onFileInputButtonClick(): void {
    this.fileSizeExceededWarningShown = false;

    this.fileInput.click();
  }

  @Emit("change")
  onFileInputChange(): void {
    const file = this.fileInput.files?.item(0) ?? null;

    if(file && file.size > this.maxFileSize) {
      this.fileSizeExceededWarningShown = true;
      this.fileInput.value = "";
      this.value = null;
      return;
    }

    this.value = this.fileInput.files?.item(0) ?? null;
    this.$forceUpdate();
  }
}
</script>