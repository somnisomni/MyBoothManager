<template>
  <div class="mb-2">
    <VLayout class="d-flex flex-column align-center justify-center text-center rounded-lg"
             :width="width"
             :style="{ 'min-height': height }">
      <VImg v-if="imageSource" :src="imageSource" cover class="no-interaction" :style="imageDynamicStyle" />
      <span v-else class="text-body-1 text-disabled"><VIcon>mdi-image-remove</VIcon> {{ contextName }} 이미지가 없습니다.</span>
      <VExpandTransition>
        <VProgressLinear v-if="imageUpdateInProgress" indeterminate />
      </VExpandTransition>
    </VLayout>
    <VContainer class="d-flex flex-wrap align-center justify-space-between overflow-visible py-0 my-2">
      <VLayout class="d-flex flex-0-0 align-center justify-start pa-2 pl-0 overflow-visible" style="max-width: 100%;">
        <h6 v-if="!hideSubtitle" class="text-h6 font-weight-bold mr-2">{{ contextName }} 이미지</h6>
        <VBtn v-if="imageSource" :disabled="imageUpdateInProgress" class="mr-2" color="red-darken-1" @click="onImageRequestDelete"><VIcon>mdi-delete</VIcon></VBtn>

        <span v-if="imageNeedUpdate" class="text-body-2 text-warning"><VIcon>mdi-alert</VIcon> 변경 사항이 아직 적용되지 않았습니다.</span>
        <VFadeTransition leave-absolute>
          <span v-if="imageUpdateOK" class="text-body-2 text-success"><VIcon>mdi-check</VIcon> 업데이트 성공</span>
        </VFadeTransition>
      </VLayout>

      <VLayout class="d-flex flex-0-0 align-center justify-end pa-2 pr-0 overflow-visible" style="max-width: 100%;">
        <FileInputButton v-model="imageFileSelection" :accepts="FileInputAccepts.IMAGE" :disabled="imageUpdateInProgress" class="flex-grow-0" hideFileName @change="onImageFileChange" />
        <VBtn :disabled="!imageNeedUpdate || imageUpdateInProgress" @click="onUpdateRequest" :color="imageWillBeDeleted ? 'red-darken-1' : 'primary'">
          <span v-if="imageWillBeDeleted">이미지 삭제</span>
          <span v-else>업로드</span>
        </VBtn>
      </VLayout>
    </VContainer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";
import FileInputButton, { FileInputAccepts } from "./FileInputButton.vue";

@Component({
  emits: ["updated", "error"],
  components: {
    FileInputButton,
  },
})
export default class ImageWithUpload extends Vue {
  readonly FileInputAccepts = FileInputAccepts;

  @Prop({ type: String, required: true, default: null }) existingSrc!: string | null;
  @Prop({ type: String, default: "" }) contextName!: string;
  @Prop({ type: Boolean, default: false }) hideSubtitle!: boolean;
  @Prop({ type: String, default: "100%" }) width!: string;
  @Prop({ type: String, default: "300px" }) height!: string;
  @Prop({ type: String, default: "1/1" }) aspectRatio!: string;
  @Prop({ type: Promise, default: async () => true }) uploadCallback!: (file: File | Blob | null) => Promise<boolean>;
  @Prop({ type: Promise, default: async () => true }) deleteCallback!: () => Promise<boolean>;

  imageUpdateInProgress: boolean = false;
  imageUpdateOK: boolean = false;
  imageFileSelection: File | Blob | null = null;
  imageWillBeDeleted: boolean = false;
  imageNeedUpdate: boolean = false;
  imageFilePickedObjectURL: string | null = null;

  get imageDynamicStyle() {
    return {
      "width": this.width,
      "height": this.height,
      "aspect-ratio": this.aspectRatio,
    };
  }

  onImageFileChange() {
    this.imageWillBeDeleted = false;

    if(this.imageFileSelection) {
      this.imageNeedUpdate = true;
      this.imageFilePickedObjectURL = URL.createObjectURL(this.imageFileSelection);
    } else {
      this.imageNeedUpdate = false;
      this.imageFilePickedObjectURL = null;
    }
  }

  onImageRequestDelete() {
    if(!this.existingSrc) {
      this.imageFileSelection = null;
      this.onImageFileChange();
      return;
    }

    this.imageWillBeDeleted = true;
    this.imageNeedUpdate = true;
  }

  async onUpdateRequest() {
    this.imageUpdateInProgress = true;

    const response = this.imageFileSelection ? await this.uploadCallback(this.imageFileSelection) : await this.deleteCallback();

    if(response === true) {
      this.imageFileSelection = null;
      this.onImageFileChange();

      this.imageUpdateOK = true;
      setTimeout(() => { this.imageUpdateOK = false; }, 3000);

      this.$emit("updated");
    } else {
      alert("error " + response);
      this.$emit("error");
    }

    this.imageUpdateInProgress = false;
  }

  get imageSource(): string | null {
    if(this.imageWillBeDeleted) return null;

    return this.imageFilePickedObjectURL ?? getUploadFilePath(this.existingSrc);
  }
}
</script>
