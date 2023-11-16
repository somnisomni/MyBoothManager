<template>
  <VApp class="bg-transparent">
    <RouterView />

    <ServerNotRespondErrorDialog v-model="isServerNotAvailable" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import PublicAPI from "@/lib/api";

@Component({})
export default class App extends Vue {
  isServerNotAvailable: boolean = false;

  async mounted() {
    this.isServerNotAvailable = !(await PublicAPI.checkAPIServerAlive());
  }
}
</script>
