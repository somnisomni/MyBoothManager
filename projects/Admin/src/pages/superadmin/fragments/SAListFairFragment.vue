<template>
  <div class="px-2 my-8">
    <h2>행사 목록 <VBtn class="ml-2" @click="refreshList">새로고침</VBtn></h2>

    <VDataTable :headers="tableHeaders"
                :items="fairs"
                :loading="isLoading">
      <template v-slot:item="{ item }">
        <tr :class="{ 'text-decoration-line-through text-disabled': item.isPassed }">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.openingDates }}</td>
          <td>{{ item.websiteUrl }}</td>
          <td>{{ item.createdAt }}</td>
          <td>{{ item.updatedAt }}</td>
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
  fairs: Array<ISuperAdminFairResponseInternal> = [];

  readonly tableHeaders = [
    { title: "#ID", key: "id", sortable: true },
    { title: "행사명", key: "name", sortable: true },
    { title: "설명", key: "description", sortable: false },
    { title: "장소", key: "location", sortable: true },
    { title: "개최 일자", key: "openingDates", sortable: true },
    { title: "대표 웹사이트 URL", key: "websiteUrl", sortable: false },
    { title: "생성 일자", key: "createdAt", sortable: true },
    { title: "마지막 정보 변경 일자", key: "updatedAt", sortable: true },
  ] as Array<{ title: string, key: keyof ISuperAdminFairResponseInternal, sortable?: boolean }>;

  async mounted() {
    await this.refreshList();
  }

  async refreshList() {
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
}
</script>
