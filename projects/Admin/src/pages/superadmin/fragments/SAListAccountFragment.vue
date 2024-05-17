<template>
  <div>
    <VBtn @click="refreshList">새로고침</VBtn>

    <VDataTable :headers="tableHeaders"
                :items="accounts"
                :loading="isLoading" />
  </div>
</template>

<script lang="ts">
import type { ISuperAdminAccountResponse } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import moment from "moment";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "@/plugins/stores/admin";

type ISuperAdminAccountResponseInternal = ISuperAdminAccountResponse & {
  lastLoginAt: string,
  createdAt: string,
  updatedAt: string,
};

const momentFormat = (date?: Date | string | null) => {
  const m = moment(date);
  return m.isValid() ? m.format("YYYY-MM-DD HH:mm:ss") : "기록 없음";
};

@Component({})
export default class SAListAccountFragment extends Vue {
  isLoading = true;
  accounts: Array<ISuperAdminAccountResponseInternal> = [];

  readonly tableHeaders = [
    { title: "#ID", key: "id", sortable: true },
    { title: "이름", key: "name", sortable: true },
    { title: "로그인 ID", key: "loginId", sortable: false },
    { title: "로그인 횟수", key: "loginCount", sortable: false },
    { title: "마지막 로그인 일자", key: "lastLoginAt", sortable: true },
    { title: "계정 생성 일자", key: "createdAt", sortable: true },
    { title: "마지막 계정 정보 변경 일자", key: "updatedAt", sortable: true },
  ] as Array<{ title: string, key: keyof ISuperAdminAccountResponseInternal, sortable?: boolean }>;

  async mounted() {
    await this.refreshList();
  }

  async refreshList() {
    this.isLoading = true;

    const response = await AdminAPI.fetchAllAccounts(useAdminStore().currentAccount!);

    if(response instanceof Array) {
      this.accounts = response.map((account) => ({
        ...account,
        lastLoginAt: momentFormat(account.lastLoginAt),
        createdAt: momentFormat(account.createdAt),
        updatedAt: momentFormat(account.updatedAt),
      } as ISuperAdminAccountResponseInternal));
    } else {
      alert("계정 목록 불러오기 실패: " + response);
    }

    this.isLoading = false;
  }
}
</script>
