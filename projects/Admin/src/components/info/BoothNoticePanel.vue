<template>
  <DashboardPanel title="공지 사항">
    <p class="d-flex align-center justify-end text-disabled text-right">
      <span>최소한의 Markdown 문법을 지원합니다.</span>
      <VBtn size="x-small"
            icon="mdi-help-circle"
            variant="flat"
            @click="isMarkdownHelpDialogOpened = true" />
    </p>

    <VLayout class="d-flex flex-column text-center w-100">
      <VTextarea v-model="noticeContent"
                 rows="10"
                 placeholder="공지 사항 내용 입력"
                 hide-details
                 no-resize />
      <VLayout class="d-flex flex-row flex-wrap justify-end mt-2">
        <VBtn variant="outlined"
              prepend-icon="mdi-eraser"
              :disabled="noticeContent.length <= 0"
              @click="noticeContent = ''">내용 지우기</VBtn>
      </VLayout>

      <VDivider class="my-4" />

      <VLayout class="d-flex flex-column text-center w-100 px-2">
        <h3 class="text-left">미리보기</h3>

        <VSheet>
          <MarkdownRenderer :source="noticeContent" />
        </VSheet>
      </VLayout>
    </VLayout>

    <VLayout class="d-flex flex-row flex-wrap justify-end">
      <VDivider class="my-4" />

      <VBtn :disabled="!isEdited || isUpdating"
            variant="outlined"
            prepend-icon="mdi-refresh"
            class="mx-2 my-1"
            @click="resetNoticeContent">변경 취소</VBtn>
      <VBtn :disabled="!isEdited || isUpdating"
            :loading="isUpdating"
            color="primary"
            prepend-icon="mdi-check"
            class="mx-2 my-1"
            @click="onUpdateButtonClick">업데이트</VBtn>
    </VLayout>

    <MarkdownHelpDialog v-model="isMarkdownHelpDialogOpened" />
  </DashboardPanel>
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import MarkdownHelpDialog from "@/components/dialogs/MarkdownHelpDialog.vue";
import DashboardPanel from "../dashboard/DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
    MarkdownHelpDialog,
  },
})
export default class BoothInfoPanel extends Vue {
  noticeContent = "";
  isUpdating = false;
  isMarkdownHelpDialogOpened = false;

  mounted() {
    this.resetNoticeContent();
  }

  get boothData(): IBooth {
    return useAdminStore().currentBooth.booth!;
  }

  get isEdited(): boolean {
    return this.noticeContent !== (this.boothData.noticeContent || "");
  }

  async onUpdateButtonClick() {
    this.isUpdating = true;

    await useAdminAPIStore().updateCurrentBoothNotice(this.noticeContent);

    this.isUpdating = false;
  }

  resetNoticeContent() {
    this.noticeContent = this.boothData.noticeContent || "";
  }
}
</script>
