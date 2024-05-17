<template>
  <VContainer>
    <VBtn :to="{ name: 'logout' }">로그아웃</VBtn>

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
