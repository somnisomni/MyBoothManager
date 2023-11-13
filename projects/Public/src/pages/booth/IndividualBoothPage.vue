<template>
  <VMain>
    {{ boothId }}
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({})
export default class IndividualBoothPage extends Vue {
  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }
}
</script>
