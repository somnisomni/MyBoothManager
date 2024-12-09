<template>
  <DashboardPanel title="공지 사항">
    <p class="text-disabled text-right">최소한의 <a href="https://ko.wikipedia.org/wiki/%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4" target="_blank">Markdown 문법</a>을 지원합니다.</p>

    <VLayout class="d-flex flex-column text-center w-100">
      <VTextarea v-model="noticeContent"
                 rows="10"
                 placeholder="공지 사항 내용 입력"
                 hide-details
                 no-resize />

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
  </DashboardPanel>
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import DashboardPanel from "../dashboard/DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
  },
})
export default class BoothInfoPanel extends Vue {
  noticeContent = "";
  isUpdating = false;

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
