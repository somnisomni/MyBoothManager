<template>
  <div class="px-2 my-8">
    <h2>행사 목록 <VBtn class="ml-2" @click="refreshList">새로고침</VBtn></h2>

    <VDataTable :headers="tableHeaders"
                :items="computedFairs"
                :loading="isLoading"
                showExpand>
      <template #top>
        <VCheckbox v-model="showPassed"
                   label="종료된 행사 표시"
                   hideDetails />
      </template>

      <template #item="{ columns, item, internalItem, toggleExpand, isExpanded }">
        <tr v-if="!item.isPassed || showPassed"
            :class="{ 'text-decoration-line-through text-disabled': item.isPassed }">
          <td v-for="column in columns"
              :key="column.key!">
            <!-- Expand icon -->
            <div v-if="column.key === 'data-table-expand'">
              <VBtn variant="flat"
                    size="small"
                    :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="toggleExpand(internalItem)" />
            </div>

            <!-- Turn `item.openingDates` values into VChips -->
            <div v-if="column.key === 'openingDates'">
              <VChip v-for="date in item[column.key! as keyof ISuperAdminFairResponseInternal]?.toString().split(',')"
                    :key="date"
                    :color="isToday(date) ? 'primary' : undefined"
                    class="ma-1"
                    :class="[ isDatePassed(date) ? 'text-disabled' : undefined ]">
                {{ date }}
              </VChip>
            </div>

            <!-- Otherwise just show raw text -->
            <span v-else>{{ item[column.key! as keyof ISuperAdminFairResponseInternal] }}</span>
          </td>
        </tr>
      </template>

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <ul style="list-style-position: inside;">
              <li><strong>설명</strong>: {{ item.description }}</li>
              <li><strong>대표 웹사이트 URL</strong>: {{ item.websiteUrl }}</li>
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
import type { ISuperAdminFairResponse } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { SuperAdminAPI, momentFormat } from "../SuperAdminPage.lib";

type ISuperAdminFairResponseInternal = ISuperAdminFairResponse & {
  createdAt: string,
  updatedAt: string,
};

@Component({})
export default class SAListFairFragment extends Vue {
  isLoading = true;
  showPassed = false;
  private fairs: ISuperAdminFairResponseInternal[] = [];

  readonly tableHeaders = [
    { title: "#ID", key: "id", sortable: true },
    { title: "행사명", key: "name", sortable: true },
    { title: "장소", key: "location", sortable: true },
    { title: "개최 일자", key: "openingDates", sortable: true },
  ] as Array<{ title: string, key: keyof ISuperAdminFairResponseInternal, sortable?: boolean }>;

  get computedFairs(): ISuperAdminFairResponseInternal[] {
    const fairs: ISuperAdminFairResponseInternal[] = [];

    for(const fair of this.fairs) {
      if(!fair.isPassed || this.showPassed) {
        fairs.push(fair);
      }
    }

    return fairs;
  }

  async mounted() {
    await this.refreshList();
  }

  public async refreshList(): Promise<void> {
    this.isLoading = true;

    const response = await SuperAdminAPI.fetchAllFairs();

    if(response instanceof Array) {
      this.fairs = response.map((fair) => ({
        ...fair,
        createdAt: momentFormat(fair.createdAt),
        updatedAt: momentFormat(fair.updatedAt),
      } as ISuperAdminFairResponseInternal));
    } else {
      alert("행사 목록 불러오기 실패: " + response);
    }

    this.isLoading = false;
  }

  isDatePassed(date: string): boolean {
    return new Date(date) < new Date();
  }

  isToday(date: string): boolean {
    return new Date(date).toLocaleDateString() === new Date().toLocaleDateString();
  }
}
</script>
