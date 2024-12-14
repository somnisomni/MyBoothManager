<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center">
    <h4 class="text-h4">로그아웃 중...</h4>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";
import router from "@/plugins/router";
import { useAuthStore } from "@/plugins/stores/auth";

@Component({})
export default class LogoutPage extends Vue {
  async mounted(): Promise<void> {
    await AdminAPI.logout({ id: useAuthStore().id ?? -1 });
    useAuthStore().invalidateLoginData();

    await router.replace({ name: "login", state: {
      logout: true,
      authTokenInvalid: window.history.state.authTokenInvalid,
    } });
  }
}
</script>
