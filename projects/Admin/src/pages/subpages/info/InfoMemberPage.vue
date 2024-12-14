<template>
  <VContainer>
    <BoothMembersPanel />
  </VContainer>
</template>

<script lang="ts">
import { Component, toNative, Vue } from "vue-facing-decorator";
import BoothMembersPanel from "@/components/info/BoothMembersPanel.vue";

@Component({
  components: {
    BoothMembersPanel,
  },
})
class InfoMemberPage extends Vue { }

export default toNative(InfoMemberPage);
</script>
