<template>
  <VApp class="bg-transparent">
    <RouterView v-if="isServerAvailable" />

    <GlobalSnackbarManager v-model="globalSnackbarContexts.contexts" />

    <ServerNotRespondErrorDialog v-model="showServerNotRespondErrorDialog" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component, Setup } from "vue-facing-decorator";
import { APP_PRIMARY_COLOR, SnackbarContextWrapper } from "@myboothmanager/common-ui";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./plugins/stores/admin";

@Component({})
export default class App extends Vue {
  isServerAvailable: boolean = false;
  showServerNotRespondErrorDialog: boolean = false;

  @Setup(() => useAdminStore().globalSnackbarContexts)
  declare globalSnackbarContexts: SnackbarContextWrapper;

  async mounted() {
    console.info("%cMade with %c❤️", `font-size: 1.5rem; color: ${APP_PRIMARY_COLOR}`, "font-size: 1.5rem; color: red");

    const serverConnectionCheckSnackbarId = this.globalSnackbarContexts.add({
      type: "loading",
      text: "서버 연결 상태 확인 중...",
      persistent: true,
    });

    this.isServerAvailable = await AdminAPI.checkAPIServerAlive();

    this.globalSnackbarContexts.removeImmediate(serverConnectionCheckSnackbarId);

    if(!this.isServerAvailable) {
      this.showServerNotRespondErrorDialog = true;
    }
  }
}
</script>
