<template>
  <VApp class="bg-transparent">
    <RouterView v-if="isServerAvailable" />

    <ServerNotRespondErrorDialog v-model="showServerNotRespondErrorDialog" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";

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
}
</script>
