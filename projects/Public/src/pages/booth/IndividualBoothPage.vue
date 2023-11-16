<template>
  <VMain>
    <SharePanel />

    {{ boothId }}
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import SharePanel from "@/components/booth/SharePanel.vue";

@Component({
  components: {
    SharePanel,
  },
})
export default class IndividualBoothPage extends Vue {
  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }
}
</script>
