<template>
  <VApp class="bg-transparent">
    <RouterView v-if="!isServerNotAvailable" />

    <ServerNotRespondErrorDialog v-model="isServerNotAvailable" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";

@Component({})
export default class App extends Vue {
  isServerNotAvailable: boolean = false;

  async mounted() {
    this.isServerNotAvailable = !(await AdminAPI.checkAPIServerAlive());
  }
}
</script>
