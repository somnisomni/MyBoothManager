<template>
  <div class="px-2 my-8">
    <h2>
      <span>부스 관리 계정 목록</span>

      <VBtn class="ml-2"
            @click="refreshList">
        <span>새로고침</span>
      </VBtn>
    </h2>

    <VDataTable :headers="tableHeaders"
                :items="accounts"
                :loading="isLoading" />
  </div>
</template>

<script lang="ts">
import type { ISuperAdminAccountResponse } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { SuperAdminAPI, momentFormat } from "../SuperAdminPage.lib";

type ISuperAdminAccountResponseInternal = ISuperAdminAccountResponse & {
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
};

@Component({})
export default class SAListAccountFragment extends Vue {
  isLoading = true;
  accounts: ISuperAdminAccountResponseInternal[] = [];

  readonly tableHeaders = [
    { title: "#ID", key: "id", sortable: true },
    { title: "이름", key: "name", sortable: true },
    { title: "로그인 ID", key: "loginId", sortable: false },
    { title: "로그인 횟수", key: "loginCount", sortable: false },
    { title: "마지막 로그인 일자", key: "lastLoginAt", sortable: true },
    { title: "계정 생성 일자", key: "createdAt", sortable: true },
    { title: "마지막 계정 정보 변경 일자", key: "updatedAt", sortable: true },
  ] as Array<{ title: string; key: keyof ISuperAdminAccountResponseInternal; sortable?: boolean }>;

  async mounted(): Promise<void> {
    await this.refreshList();
  }

  async refreshList(): Promise<void> {
    this.isLoading = true;

    const response = await SuperAdminAPI.fetchAllAccounts();

    if(response instanceof Array) {
      this.accounts = response.map(account => ({
        ...account,
        lastLoginAt: momentFormat(account.lastLoginAt),
        createdAt: momentFormat(account.createdAt),
        updatedAt: momentFormat(account.updatedAt),
      } as ISuperAdminAccountResponseInternal));
    } else {
      alert(`계정 목록 불러오기 실패: ${response}`);
    }

    this.isLoading = false;
  }
}
</script>
