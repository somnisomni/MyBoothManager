<template>
  <VFadeTransition>
    <BoothAdminLoadDataOverlay v-if="!loaded" @complete="loaded = true" />
    <RouterView v-else />
  </VFadeTransition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import BoothAdminLoadDataOverlay from "./BoothAdminLoadDataOverlay.vue";

@Component({
  components: {
    BoothAdminLoadDataOverlay,
  },
})
export default class BoothAdminRoot extends Vue {
  get loaded(): boolean {
    return useAdminStore().isBoothDataLoaded;
  }

  set loaded(value: boolean) {
    useAdminStore().isBoothDataLoaded = value;
  }
}
</script>
