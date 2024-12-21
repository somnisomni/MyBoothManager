<template>
  <div class="px-2 my-8">
    <h2>전체 부스 목록 <VBtn class="ml-2" @click="refreshList">새로고침</VBtn></h2>

    <VDataTable :headers="tableHeaders"
                :items="computedBooths"
                :loading="isLoading"
                showExpand>
      <template #top>
        <VLayout class="d-flex flex-row align-center justify-center w-100 my-2">
          <strong>부스 운영 상태: </strong>
          <VChipGroup v-model="statusFilter"
                      direction="horizontal"
                      mandatory>
            <VChip value="all" class="ma-1">전체</VChip>
            <VChip :value="BoothStatus.PREPARE" color="green-darken-4" class="ma-1 text-green">운영 준비 중</VChip>
            <VChip :value="BoothStatus.OPEN" color="blue-darken-4" class="ma-1 text-blue">운영 중</VChip>
            <VChip :value="BoothStatus.PAUSE" color="orange-darken-4" class="ma-1 text-orange-darken-1">운영 일시 중지</VChip>
            <VChip :value="BoothStatus.CLOSE" color="red-darken-4" class="ma-1 text-red-darken-1">운영 종료</VChip>
          </VChipGroup>
        </VLayout>
      </template>

      <template #item="{ columns, item, internalItem, toggleExpand, isExpanded }">
        <tr :class="{
            'text-green': item.status.status === BoothStatus.PREPARE,
            'text-blue': item.status.status === BoothStatus.OPEN,
            'text-orange-darken-1': item.status.status === BoothStatus.PAUSE,
            'text-red-darken-1': item.status.status === BoothStatus.CLOSE,
          }">
          <td v-for="column in columns"
              :key="column.key!">
            <!-- Expand icon -->
            <div v-if="column.key === 'data-table-expand'">
              <VBtn variant="flat"
                    size="small"
                    :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="toggleExpand(internalItem)" />
            </div>

            <!-- Otherwise just show raw text -->
            <span v-else>{{ typeof column.value === "function" ? column.value(item) : column.value }}</span>
          </td>
        </tr>
      </template>

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
import { BoothStatus, type IBoothSuperAdminResponse } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { SuperAdminAPI, momentFormat } from "../SuperAdminPage.lib";

type ISuperAdminBoothResponseInternal = IBoothSuperAdminResponse & {
  createdAt: string,
  updatedAt: string,
};

@Component({})
export default class SAListBoothFragment extends Vue {
  readonly BoothStatus = BoothStatus;

  isLoading = true;
  statusFilter: BoothStatus | "all" = "all";
  booths: ISuperAdminBoothResponseInternal[] = [];

  readonly tableHeaders = [
    {
      title: "#ID",
      key: "id",
      sortable: true,
      value: (item: ISuperAdminBoothResponseInternal) => item.id,
    },
    {
      title: "이름",
      key: "name",
      sortable: true,
      value: (item: ISuperAdminBoothResponseInternal) => item.name,
    },
    {
      title: "소유자 계정 이름",
      key: "owner.name",
      sortable: true,
      value: (item: ISuperAdminBoothResponseInternal) => item.owner.name,
    },
    {
      title: "행사명",
      key: "fair.name",
      sortable: true,
      value: (item: ISuperAdminBoothResponseInternal) => item.fair?.name,
    },
    {
      title: "부스 번호",
      key: "boothNumber",
      sortable: true,
      value: (item: ISuperAdminBoothResponseInternal) => item.boothNumber,
    },
  ] as Array<{
    title: string,
    key: keyof IBoothSuperAdminResponse,
    sortable?: boolean,
    value?: (item: ISuperAdminBoothResponseInternal) => unknown,
  }>;

  get computedBooths(): ISuperAdminBoothResponseInternal[] {
    if(this.statusFilter === "all") {
      return this.booths;
    }

    return this.booths.filter((booth) => booth.status.status === this.statusFilter);
  }

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
