<template>
  <VContainer>
    <VBtn :to="{ name: 'logout' }">로그아웃</VBtn>

    <VLayout class="d-flex flex-column my-8 pa-2">
      <h1>부스 관리자 계정 생성</h1>
      <VTextField v-model="createAccountData.name" hint="새 계정 이름 (닉네임)" persistent-hint />
      <VTextField v-model="createAccountData.loginId" hint="새 계정 ID" persistent-hint />
      <VTextField v-model="createAccountData.loginPass" hint="새 계정 비밀번호" persistent-hint type="password" />
      <VBtn :loading="isCreatingAccount" :disabled="isCreatingAccount" @click="createAccount">생성</VBtn>
    </VLayout>
  </VContainer>
</template>

<script lang="ts">
import type { IAccountCreateRequest } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "@/plugins/stores/admin";

@Component({})
export default class SuperAdminPage extends Vue {
  isCreatingAccount: boolean = false;

  createAccountData: IAccountCreateRequest = {
    loginId: "",
    loginPass: "",
    name: "",
  };

  async createAccount() {
    this.isCreatingAccount = true;

    if(!this.createAccountData.loginId || !this.createAccountData.loginPass || !this.createAccountData.name) {
      alert("계정 생성 데이터 일부분 누락");
      return;
    }

    const res = await AdminAPI.createAccount(useAdminStore().currentAccount!, this.createAccountData);
    if(typeof res !== "string") {
      alert("계정 생성 성공");
    } else {
      alert("계정 생성 실패: " + res);
    }

    this.isCreatingAccount = false;
  }
}
</script>
