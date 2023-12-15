<template>
  <VApp class="bg-transparent">
    <RouterView v-if="isServerAvailable" />

    <VSnackbar v-model="isAPIFetchError" location="top" color="error" timeout="-1" disabled :close-on-back="false" :close-on-content-click="false">
      <span><VIcon>mdi-alert</VIcon> 서버 API 호출 중 오류가 발생했습니다.</span>
    </VSnackbar>

    <ServerNotRespondErrorDialog v-model="showServerNotRespondErrorDialog" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./stores/admin";

@Component({})
export default class App extends Vue {
  isServerAvailable: boolean = false;
  showServerNotRespondErrorDialog: boolean = false;

  async mounted() {
    this.isServerAvailable = await AdminAPI.checkAPIServerAlive();

    if(!this.isServerAvailable) {
      this.showServerNotRespondErrorDialog = true;
    }
  }

  get isAPIFetchError(): boolean {
    return useAdminStore().isAPIFetchError;
  }
}
</script>
