<template>
  <VApp class="bg-transparent">
    <div class="position-fixed text-subtitle-2 ma-2 text-disabled text-right" style="right: 0; bottom: 0; opacity: 0.5; z-index: 100000;">
      <span><small>{{ versionString }}</small> <strong>Work in progress!</strong></span><br />
      <small>레이아웃 또는 기능이 수시로 변경될 수 있습니다.</small>
    </div>

    <RouterView v-if="!isServerNotAvailable" />

    <ServerNotRespondErrorDialog v-model="isServerNotAvailable" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { usePublicStore } from "@/plugins/stores/public";

@Component({})
export default class App extends Vue {
  isServerNotAvailable: boolean = false;

  get versionString(): string {
    return `v${import.meta.env.VITE__APP_VERSION} (${import.meta.env.VITE__GIT_HASH})`;
  }

  async mounted() {
    this.isServerNotAvailable = !(await usePublicStore().apiCaller.checkAPIServerAlive());
  }
}
</script>
./plugins/stores/public
