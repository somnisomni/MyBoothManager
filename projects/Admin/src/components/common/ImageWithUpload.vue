<template>
  <div class="mb-2">
    <VLayout class="d-flex flex-column align-center justify-center text-center"
             :style="{ 'min-height': height === 'auto' ? '100px' : height }">
      <VImg v-if="imageSource"
            :src="imageSource"
            cover
            class="no-interaction rounded-lg"
            :style="imageDynamicStyle" />
      <span v-else
            class="text-body-1 text-disabled"><VIcon>mdi-image-remove</VIcon> {{ contextName }} 이미지가 없습니다.</span>
      <VExpandTransition>
        <VProgressLinear v-if="imageUpdateInProgress"
                         indeterminate />
      </VExpandTransition>
    </VLayout>

    <VContainer class="d-flex flex-wrap align-center overflow-visible py-0 my-2"
                :class="{ 'flex-column justify-center': controlsColumn, 'justify-space-between': !controlsColumn }">
      <VLayout class="d-flex flex-0-0 align-center justify-start pa-2 overflow-visible"
               :class="{ 'flex-column': controlsColumn, 'pl-0': !controlsColumn }"
               style="max-width: 100%;">
        <h6 v-if="!hideSubtitle"
            class="text-h6 font-weight-bold"
            :class="{ 'my-1': controlsColumn, 'mr-2': !controlsColumn }">
          <span>{{ contextName }} 이미지</span>
        </h6>
        <VBtn v-if="imageSource"
              :disabled="imageUpdateInProgress"
              :class="{ 'my-1': controlsColumn, 'mr-2': !controlsColumn }"
              color="red-darken-1"
              @click="onImageRequestDelete">
          <VIcon icon="mdi-delete" />
        </VBtn>

        <span v-if="imageNeedUpdate"
              class="text-body-2 text-warning"><VIcon>mdi-alert</VIcon> 변경 사항이 아직 적용되지 않았습니다.</span>
        <VFadeTransition leaveAbsolute>
          <span v-if="imageUpdateOK"
                class="text-body-2 text-success"><VIcon>mdi-check</VIcon> 업데이트 성공</span>
        </VFadeTransition>
      </VLayout>

      <VLayout class="d-flex flex-0-0 align-center justify-end pa-2 overflow-visible"
               style="max-width: 100%;"
               :class="{ 'pr-0': !controlsColumn }">
        <FileInputButton v-model="imageFileSelection"
                         :accepts="FileInputAccepts.IMAGE"
                         :disabled="imageUpdateInProgress"
                         class="flex-grow-0"
                         hideFileName
                         @change="onImageFileChange" />
        <VBtn class="ma-2"
              :disabled="!imageNeedUpdate || imageUpdateInProgress"
              :color="imageWillBeDeleted ? 'red-darken-1' : 'primary'"
              @click="onUpdateRequest">
          <span v-if="imageWillBeDeleted">이미지 삭제</span>
          <span v-else>업로드</span>
        </VBtn>
      </VLayout>
    </VContainer>
  </div>
</template>

<script lang="ts">
import type { StyleValue } from "vue";
import { Component, Prop, Vue } from "vue-facing-decorator";
import { getUploadFileUrl } from "@/lib/functions";
import FileInputButton, { FileInputAccepts } from "./FileInputButton.vue";

@Component({
  emits: [ "updated", "error" ],
  components: {
    FileInputButton,
  },
})
export default class ImageWithUpload extends Vue {
  readonly FileInputAccepts = FileInputAccepts;

  @Prop({ type: String, required: true, default: null }) declare readonly existingSrc: string | null;
  @Prop({ type: String, default: "" }) declare readonly contextName: string;
  @Prop({ type: Boolean, default: false }) declare readonly hideSubtitle: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly controlsColumn: boolean;
  @Prop({ type: String, default: "auto" }) declare readonly width: string;
  @Prop({ type: String, default: "300px" }) declare readonly height: string;
  @Prop({ type: String, default: "1/1" }) declare readonly aspectRatio: string;
  @Prop({ type: Function, default: async () => true }) declare readonly uploadCallback: (file: File | Blob | null) => Promise<boolean>;
  @Prop({ type: Function, default: async () => true }) declare readonly deleteCallback: () => Promise<boolean>;

  imageUpdateInProgress: boolean = false;
  imageUpdateOK: boolean = false;
  imageFileSelection: File | Blob | null = null;
  imageWillBeDeleted: boolean = false;
  imageNeedUpdate: boolean = false;
  imageFilePickedObjectURL: string | null = null;

  get imageDynamicStyle(): StyleValue {
    return {
      "width": this.width,
      "height": this.height,
      "aspect-ratio": this.aspectRatio,
    };
  }

  onImageFileChange(): void {
    this.imageWillBeDeleted = false;
    this.imageUpdateOK = false;

    if(this.imageFileSelection) {
      this.imageNeedUpdate = true;
      this.imageFilePickedObjectURL = URL.createObjectURL(this.imageFileSelection);
    } else {
      this.imageNeedUpdate = false;
      this.imageFilePickedObjectURL = null;
    }
  }

  onImageRequestDelete(): void {
    this.imageUpdateOK = false;

    if(!this.existingSrc) {
      this.imageFileSelection = null;
      this.onImageFileChange();
      return;
    }

    this.imageWillBeDeleted = true;
    this.imageNeedUpdate = true;
  }

  async onUpdateRequest(): Promise<void> {
    this.imageUpdateInProgress = true;
    this.imageUpdateOK = false;

    const response = this.imageFileSelection ? await this.uploadCallback(this.imageFileSelection) : await this.deleteCallback();

    if(response === true) {
      this.imageFileSelection = null;
      this.onImageFileChange();

      this.imageUpdateOK = true;
      setTimeout(() => {
        this.imageUpdateOK = false;
      }, 3000);

      this.$emit("updated");
    } else {
      this.$emit("error");
    }

    this.imageUpdateInProgress = false;
  }

  get imageSource(): string | null {
    if(this.imageWillBeDeleted) {
      return null;
    }

    return this.imageFilePickedObjectURL ?? getUploadFileUrl(this.existingSrc);
  }
}
</script>
