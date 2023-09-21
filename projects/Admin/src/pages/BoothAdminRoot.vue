<template>
  <VFadeTransition leave-absolute>
    <div v-if="!loaded" class="position-absolute w-100 h-100" style="z-index: 1000">
      <BoothAdminLoadDataOverlay @completed="loaded = true" />
    </div>
    <div v-else-if="needCreateBooth" class="position-absolute w-100 h-100" style="z-index: 1000">
      <NoBoothAvailableOverlay />
    </div>
  </VFadeTransition>

  <RouterView v-slot="{ Component }">
    <VFadeTransition>
      <component v-if="loaded && boothAvailable" :is="Component" />
    </VFadeTransition>
  </RouterView>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import router from "@/router";
import BoothAdminLoadDataOverlay from "./BoothAdminLoadDataOverlay.vue";
import NoBoothAvailableOverlay from "./NoBoothAvailableOverlay.vue";

@Component({
  components: {
    BoothAdminLoadDataOverlay,
    NoBoothAvailableOverlay,
  },
})
export default class BoothAdminRoot extends Vue {
  get loaded(): boolean {
    return useAdminStore().isBoothDataLoaded;
  }

  get boothAvailable(): boolean {
    return Object.keys(useAdminStore().boothList).length > 0;
  }

  get needCreateBooth(): boolean {
    return !this.boothAvailable && this.loaded;
  }

  set loaded(value: boolean) {
    useAdminStore().isBoothDataLoaded = value;
  }

  @Watch("needCreateBooth")
  onNeedCreateBoothChanged(value: boolean) {
    // A kind of hacky solution; reload whole page instead of using router
    if(!value) {
      window.location.replace(router.resolve({ name: "admin" }).href);
    }
  }
}
</script>
