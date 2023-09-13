<template>
  <VContainer>
    <div>로그아웃 중...</div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import router from "@/router";

@Component({})
export default class LogoutPage extends Vue {
  mounted() {
    useAdminStore().invalidateLoginData();
    router.replace({ name: "login" });
  }
}
</script>
