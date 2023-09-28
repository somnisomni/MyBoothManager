<template>
  <DashboardPanel>
    <VRow class="pa-2">
      <p>등록된 굿즈 아이템 개수: {{ goodsCount }}종</p>
    </VRow>
    <VRow class="pa-2">
      <VBtn class="flex-grow-1"
            variant="outlined"
            size="x-large"
            @click.stop="goodsAddDialogOpen = !goodsAddDialogOpen">굿즈 추가</VBtn>
    </VRow>
  </DashboardPanel>

  <GoodsManageDialog v-model="goodsAddDialogOpen" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import DashboardPanel from "../dashboard/DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
    GoodsManageDialog,
  },
})
export default class GoodsManagePanel extends Vue {
  goodsAddDialogOpen = false;

  get goodsCount(): string {
    return Object.keys(useAdminStore().boothGoodsList).length.toLocaleString();
  }
}
</script>
