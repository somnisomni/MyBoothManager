<template>
  <div class="px-2 my-8">
    <h2>전체 부스 목록 <VBtn class="ml-2" @click="refreshList">새로고침</VBtn></h2>

    <VDataTable :headers="tableHeaders"
                :items="booths"
                :loading="isLoading"
                showExpand>
      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <ul style="list-style-position: inside;">
              <li><strong>한 줄 설명</strong>: {{ item.description }}</li>
              <li><strong>행사에 연결</strong>: {{ !!item.fair }}</li>
              <li>
                <strong>운영 상태</strong>
                <ul class="ml-4">
                  <li><strong>상태</strong>: {{ item.status.status }}</li>
                  <li><strong>공개 여부</strong>: {{ item.status.contentPublished }}</li>
                  <li><strong>상태 사유</strong>: {{ item.status.reason }}</li>
                </ul>
              </li>
              <li><strong>통화 코드</strong>: {{ item.currencyCode }}</li>
              <li><strong>행사 위치</strong>: {{ item.location }}</li>
              <li><strong>행사 참가 일자</strong>: {{ item.datesOpenInFair }}</li>
              <li><strong>참가 일자 (사용자 지정)</strong>: {{ item.dateOpen }} ~ {{ item.dateClose }}</li>
              <li><strong>인포 이미지 존재</strong>: {{ !!item.infoImage }}</li>
              <li><strong>배너 이미지 존재</strong>: {{ !!item.bannerImage }}</li>
              <li><strong>공지 사항 존재</strong>: {{ !!item.noticeContent && item.noticeContent.length > 0 }}</li>
              <li><strong>관련 링크 존재</strong>: {{ !!item.relatedLinks && item.relatedLinks.length > 0 }}</li>
              <li><strong>생성 일자</strong>: {{ item.createdAt }}</li>
              <li><strong>마지막 정보 변경 일자</strong>: {{ item.updatedAt }}</li>
            </ul>
          </td>
        </tr>
      </template>
    </VDataTable>
  </div>
</template>

<script lang="ts">
import type { IBoothSuperAdminResponse } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { SuperAdminAPI, momentFormat } from "../SuperAdminPage.lib";

type ISuperAdminBoothResponseInternal = IBoothSuperAdminResponse & {
  createdAt: string,
  updatedAt: string,
};

@Component({})
export default class SAListBoothFragment extends Vue {
  isLoading = true;
  booths: ISuperAdminBoothResponseInternal[] = [];

  readonly tableHeaders = [
    { title: "#ID", key: "id", sortable: true },
    { title: "이름", key: "name", sortable: true },
    { title: "소유자 계정 이름", key: "owner.name", sortable: true },
    { title: "행사명", key: "fair.name", sortable: true },
    { title: "부스 번호", key: "boothNumber", sortable: true },
  ] as Array<{ title: string, key: keyof IBoothSuperAdminResponse, sortable?: boolean }>;

  async mounted() {
    await this.refreshList();
  }

  public async refreshList(): Promise<void> {
    this.isLoading = true;

    const response = await SuperAdminAPI.fetchAllBooths();

    if(response instanceof Array) {
      this.booths = response.map((booth) => ({
        ...booth,
        createdAt: momentFormat(booth.createdAt),
        updatedAt: momentFormat(booth.updatedAt),
      }) as ISuperAdminBoothResponseInternal);
    } else {
      alert("부스 목록 불러오기 실패: " + response);
    }

    this.isLoading = false;
  }
}
</script>
