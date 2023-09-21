<template>
  <VFadeTransition leave-absolute>
    <div v-if="!loaded" class="position-absolute w-100 h-100" style="z-index: 1000">
      <BoothAdminLoadDataOverlay @complete="loaded = true" />
    </div>
  </VFadeTransition>

  <RouterView v-if="loaded" />
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
