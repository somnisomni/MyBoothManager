<template>
  <VContainer>
    <p class="my-2 text-warning">※ 서비스 관리 계정으로 로그인했습니다. 보안을 위해 페이지를 새로고침하거나 닫으면 즉시 로그인 세션이 종료됩니다.</p>
    <VBtn :to="{ name: 'logout' }" prepend-icon="mdi-logout">로그아웃</VBtn>

    <div class="mt-4">
      <VTabs v-model="currentTab">
        <VTab value="fair">행사 정보</VTab>
        <VTab value="account">부스 관리 계정</VTab>
      </VTabs>

      <VTabsWindow v-model="currentTab">
        <VTabsWindowItem value="fair">
          <SACreateFairFragment />
        </VTabsWindowItem>

        <VTabsWindowItem value="account">
          <SACreateAccountFragment />
          <SAListAccountFragment />
        </VTabsWindowItem>
      </VTabsWindow>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import SACreateAccountFragment from "./fragments/SACreateAccountFragment.vue";
import SAListAccountFragment from "./fragments/SAListAccountFragment.vue";
import SACreateFairFragment from "./fragments/SACreateFairFragment.vue";

@Component({
  components: {
    SACreateAccountFragment,
    SAListAccountFragment,
    SACreateFairFragment,
  },
})
export default class SuperAdminPage extends Vue {
  currentTab: "fair" | "account" = "fair";
}
</script>
