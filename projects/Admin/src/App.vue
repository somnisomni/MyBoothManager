<template>
  <VApp class="bg-transparent">
    <RouterView v-if="isServerAvailable" />

    <GlobalSnackbarStack v-model="globalSnackbarContexts.contexts" />

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
  declare readonly globalSnackbarContexts: SnackbarContextWrapper;

  async mounted() {
    console.info("%cMade with %c❤️", `font-size: 1.5rem; color: ${APP_PRIMARY_COLOR}`, "font-size: 1.5rem; color: red");

    await this.globalSnackbarContexts.addLoading({
      text: "서버 연결 상태 확인 중...",
    }, async () => this.isServerAvailable = await AdminAPI.checkAPIServerAlive());

    if(!this.isServerAvailable) {
      this.showServerNotRespondErrorDialog = true;
    }
  }
}
</script>
