<template>
  <CommonDialog v-model="open"
                :progressActive="requestingPreview"
                dialogTitle="굿즈 목록 가져오기"
                dialogCancelText="취소"
                dialogPrimaryText="미리보기"
                :disablePrimary="!csvText && !selectedFile"
                @primary="onDialogPrimary">
    <p class="text-warning">굿즈의 목록만 가져올 수 있으며, 세트 구성 추가 및 이미지 업로드 등은 굿즈를 가져온 다음 개별적으로 진행해주세요.</p>

    <VBtn class="mt-6 mb-2 w-100"
          color="primary"
          @click="downloadTemplate">CSV 탬플릿 다운로드</VBtn>
    <p class="text-center text-disabled text-subtitle-2">
      CSV 파일은
      <a href="https://www.microsoft.com/microsoft-365/excel" target="_blank" style="color: currentColor">Microsoft Excel</a>,
      <a href="https://docs.google.com/spreadsheets/" target="_blank" style="color: currentColor">Google Sheets</a>
      등 스프레드시트 프로그램으로 편집할 수 있습니다.</p>
    <p class="text-center text-info text-subtitle-2">CSV 파일을 저장할 때, <strong>반드시 UTF-8 인코딩으로 저장</strong>해주세요.</p>

    <p class="mt-6">파일 업로드: <FileInputButton v-model="selectedFile" acceptsCustom="text/csv" /></p>
    <VExpandTransition>
      <VTextarea v-if="!selectedFile"
                 v-model="csvText"
                 :placeholder="csvTextPlaceholder"
                 autoGrow />
    </VExpandTransition>
  </CommonDialog>
</template>

<script lang="ts">
import { goodsCsvHeaderStringified } from "@myboothmanager/common";
import { Component, Model, Vue, Watch } from "vue-facing-decorator";
import { useAdminAPIStore } from "@/plugins/stores/api";
import FileInputButton from "../common/FileInputButton.vue";

@Component({
  components: {
    FileInputButton,
  },
})
export default class GoodsImportDialog extends Vue {
  @Model({ type: Boolean }) declare open: boolean;

  requestingPreview = false;
  selectedFile: File | null = null;
  csvText: string = "";

  get csvTextPlaceholder() {
    return "또는 다음 첫 줄로 시작하는 CSV 형식의 파일 내용 직접 입력\n"
      + goodsCsvHeaderStringified;
  }

  @Watch("open", { immediate: true })
  onDialogOpen() {
    if(this.open) {
      this.csvText = "";
      this.selectedFile = null;
    }
  }

  @Watch("selectedFile")
  onFileSelect() {
    if(this.selectedFile) {
      this.csvText = "";

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log(reader.result);
      });
      reader.readAsText(this.selectedFile, "UTF-8");
    }
  }

  async onDialogPrimary() {
    this.requestingPreview = true;

    let csv: string = this.csvText;
    if(this.selectedFile) {
      let done = false;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        csv = reader.result as string;
        done = true;
      });
      reader.readAsText(this.selectedFile, "UTF-8");

      while(!done) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const response = await useAdminAPIStore().requestPreviewGoodsCSVImport(csv);

    console.log(response);
    this.requestingPreview = false;
  }

  downloadTemplate() {
    const csv = goodsCsvHeaderStringified + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goods_list_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
}
</script>
