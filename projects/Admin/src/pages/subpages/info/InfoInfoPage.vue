<template>
  <VContainer>
    <BoothInfoPanel />
  </VContainer>
</template>

<script lang="ts">
import { Component, toNative, Vue } from "vue-facing-decorator";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";

@Component({
  components: {
    BoothInfoPanel,
  },
})
class InfoInfoPage extends Vue { }

export default toNative(InfoInfoPage);
</script>
