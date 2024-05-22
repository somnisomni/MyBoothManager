<template>
  <VFadeTransition leave-absolute>
    <div v-if="!loaded" class="position-absolute w-100 h-100" style="z-index: 1000">
      <AdminLoadDataOverlay @completed="loaded = true" />
    </div>
    <div v-else-if="needCreateBooth" class="position-absolute w-100 h-100" style="z-index: 1000">
      <NoBoothAvailableOverlay />
    </div>
  </VFadeTransition>

  <RouterView v-slot="{ Component }">
    <VFadeTransition leave-absolute>
      <component v-if="loaded && boothAvailable" :is="Component" />
    </VFadeTransition>
  </RouterView>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import router from "@/plugins/router";
import AdminLoadDataOverlay from "./AdminLoadDataOverlay.vue";
import NoBoothAvailableOverlay from "./NoBoothAvailableOverlay.vue";

@Component({
  components: {
    AdminLoadDataOverlay,
    NoBoothAvailableOverlay,
  },
})
export default class AdminRoot extends Vue {
  get loaded(): boolean {
    return useAdminStore().isAllDataLoaded;
  }

  set loaded(value: boolean) {
    useAdminStore().isAllDataLoaded = value;
  }

  get boothAvailable(): boolean {
    return useAdminStore().currentBooth.booth !== null;
  }

  get needCreateBooth(): boolean {
    return !this.boothAvailable && this.loaded;
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
