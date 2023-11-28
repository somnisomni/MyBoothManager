<template>
  <VMain class="d-flex flex-column justify-center align-center">
    <BoothListView :boothList="boothList"
                   @boothItemClick="onBoothItemClick" />
  </VMain>
</template>

<script lang="ts">
import type { ErrorCodes, IBooth } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import BoothListView from "@/components/booth/BoothListView.vue";
import { usePublicStore } from "@/stores/public";
import router from "@/plugins/router";

@Component({
  components: {
    BoothListView,
  },
})
export default class LandingPage extends Vue {
  boothList: Array<IBooth> = [];
  fetchError: ErrorCodes | null = null;

  async mounted() {
    const response = await usePublicStore().apiCaller.fetchAllBooths();

    if("errorCode" in response) {
      this.fetchError = response.errorCode;
      return;
    } else {
      this.boothList = response;
    }
  }

  async onBoothItemClick(boothId: number) {
    await router.push({ name: "booth-individual", params: { boothId }});
  }
}
</script>
