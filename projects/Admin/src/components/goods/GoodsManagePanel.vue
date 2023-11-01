<template>
  <DashboardPanel>
    <VRow class="pa-2">
      <p>등록된 굿즈 아이템 개수: {{ goodsCount }}종</p>
    </VRow>
    <VRow class="pa-2">
      <VBtn class="flex-grow-1"
            variant="outlined"
            size="x-large"
            @click.stop="goodsAddDialogOpen = !goodsAddDialogOpen"><VIcon>mdi-plus</VIcon> 굿즈 추가</VBtn>
      <VBtn class="ml-4 px-0"
            variant="outlined"
            min-width="64px"
            size="x-large"
            @click.stop="onLoadGoodsFromFileClick">
        <VTooltip activator="parent" location="bottom">파일로부터 굿즈 목록 불러오기</VTooltip>
        <VIcon>mdi-file-upload</VIcon>
      </VBtn>
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

  onLoadGoodsFromFileClick(): void {
    alert("준비 중인 기능입니다.");
  }
}
</script>
