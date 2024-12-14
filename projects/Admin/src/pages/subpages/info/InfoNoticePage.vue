<template>
  <VContainer>
    <BoothNoticePanel />
  </VContainer>
</template>

<script lang="ts">
import { Component, toNative, Vue } from "vue-facing-decorator";
import BoothNoticePanel from "@/components/info/BoothNoticePanel.vue";

@Component({
  components: {
    BoothNoticePanel,
  },
})
class InfoNoticePage extends Vue { }

export default toNative(InfoNoticePage);
</script>
