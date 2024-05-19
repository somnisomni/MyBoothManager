<template>
  <VContainer>
    <p class="my-2 text-warning">※ 서비스 관리 계정으로 로그인했습니다. 보안을 위해 페이지를 새로고침하거나 닫으면 즉시 로그인 세션이 종료됩니다.</p>
    <VBtn :to="{ name: 'logout' }" prepend-icon="mdi-logout">로그아웃</VBtn>

    <VLayout class="d-flex flex-column my-8 pa-2">
      <h1>부스 관리자 계정 생성</h1>
      <SACreateAccountFragment />

      <h1 class="mt-8">부스 관리자 계정 목록</h1>
      <SAListAccountFragment />
    </VLayout>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import SACreateAccountFragment from "./fragments/SACreateAccountFragment.vue";
import SAListAccountFragment from "./fragments/SAListAccountFragment.vue";

@Component({
  components: {
    SACreateAccountFragment,
    SAListAccountFragment,
  },
})
export default class SuperAdminPage extends Vue { }
</script>
