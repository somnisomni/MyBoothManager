<template>
  <VContainer>
    <div>로그아웃 중...</div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import router from "@/plugins/router";
import { useAuthStore } from "@/stores/auth";

@Component({})
export default class LogoutPage extends Vue {
  mounted() {
    useAuthStore().invalidateLoginData();
    router.replace({ name: "login", state: {
      logout: true,
      authTokenInvalid: window.history.state.authTokenInvalid,
    }});
  }
}
</script>
