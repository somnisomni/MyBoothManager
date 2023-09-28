<template>
  <VContainer class="mt-4">
    <BoothInfoPanel />
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";

@Component({
  components: {
    BoothInfoPanel,
  },
})
export default class BoothAdminInfoPage extends Vue { }
</script>
