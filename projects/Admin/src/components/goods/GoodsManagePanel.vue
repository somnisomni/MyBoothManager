<template>
  <DashboardPanel>
    <VRow class="pa-2">
      <p>등록된 굿즈 아이템 개수: 00종</p>
    </VRow>
    <VRow class="pa-2">
      <VBtn class="flex-grow-1" variant="outlined"
            size="x-large"
            @click.stop="goodsAddDialogOpen = !goodsAddDialogOpen">굿즈 추가</VBtn>
    </VRow>
  </DashboardPanel>

  <GoodsManageDialog v-model="goodsAddDialogOpen" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import DashboardPanel from "../dashboard/DashboardPanel.vue";
import GoodsManageDialog from "./GoodsManageDialog.vue";

@Component({
  components: {
    DashboardPanel,
    GoodsManageDialog,
  },
})
export default class GoodsManagePanel extends Vue {
  goodsAddDialogOpen = false;
}
</script>