<template>
  <VContainer>
    <div>로그아웃 중...</div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

@Component({})
export default class LogoutPage extends Vue {
  mounted() {
    useAuthStore().invalidateLoginData();
    router.replace({ name: "login" });
  }
}
</script>
