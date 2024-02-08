<template>
  <VApp class="bg-transparent">
    <RouterView v-if="isServerAvailable" />

    <VSnackbar v-model="isServerConnectionChecking" location="top" timeout="-1" variant="flat" :close-on-back="false" :close-on-content-click="false"
               color="primary" height="4rem" min-width="unset !important" style="margin-top: 0;" rounded="0">
      <VLayout class="d-flex flex-row align-center">
        <VProgressCircular indeterminate />
        <span class="ml-4">서버 연결 상태 확인 중...</span>
      </VLayout>
    </VSnackbar>

    <VSnackbar v-model="isAPIFetchError" location="top right" color="error" timeout="30000" :close-on-back="false" close-on-content-click transition="slide-x-reverse-transition">
      <span><VIcon class="mr-2">mdi-alert</VIcon> API 호출 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.</span>
    </VSnackbar>

    <ServerNotRespondErrorDialog v-model="showServerNotRespondErrorDialog" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { APP_PRIMARY_COLOR } from "@myboothmanager/common-ui";
import AdminAPI from "@/lib/api-admin";
import { useAdminAPIStore } from "./stores/api";

@Component({})
export default class App extends Vue {
  isServerAvailable: boolean = false;
  showServerNotRespondErrorDialog: boolean = false;

  async mounted() {
    console.info("%cMade with %c❤️", `font-size: 1.5rem; color: ${APP_PRIMARY_COLOR}`, "font-size: 1.5rem; color: red");

    this.isServerAvailable = await AdminAPI.checkAPIServerAlive();

    if(!this.isServerAvailable) {
      this.showServerNotRespondErrorDialog = true;
    }
  }

  get isServerConnectionChecking() { return !this.isServerAvailable; }
  get isAPIFetchError() { return useAdminAPIStore().isAPIFetchError; }
  set isAPIFetchError(value: boolean) { useAdminAPIStore().isAPIFetchError = value; }
}
</script>
