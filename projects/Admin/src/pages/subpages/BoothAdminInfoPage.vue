<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <BoothInfoPanel class="mb-4" />
    <BoothMembersPanel class="my-4" />
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothInfoPanel from "@/components/info/BoothInfoPanel.vue";
import BoothMembersPanel from "@/components/info/BoothMembersPanel.vue";

@Component({
  components: {
    BoothInfoPanel,
    BoothMembersPanel,
  },
})
export default class BoothAdminInfoPage extends Vue { }
</script>
