<template>
  <BoothAdminLoadDataOverlay v-if="!loaded" @complete="loaded = true" />
  <RouterView v-if="loaded" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothAdminLoadDataOverlay from "./BoothAdminLoadDataOverlay.vue";
import { useAdminStore } from "@/stores/admin";

@Component({
  components: {
    BoothAdminLoadDataOverlay,
  },
})
export default class BoothAdminRoot extends Vue {
  get loaded(): boolean {
    return useAdminStore().isBaseDataLoaded;
  }

  set loaded(value: boolean) {
    useAdminStore().isBaseDataLoaded = value;
  }
}
</script>
