<template>
  <DashboardPanel title="Goods Overview">

  </DashboardPanel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
  },
})
export default class GoodsOverviewPanel extends Vue { }
</script>
