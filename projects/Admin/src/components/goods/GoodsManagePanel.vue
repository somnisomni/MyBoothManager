<template>
  <DashboardPanel>
    <VRow class="pa-2">
      <p>등록된 굿즈 아이템 개수: {{ goodsCount }}종</p>
    </VRow>
    <VRow class="pa-2 justify-space-between">
      <VBtn class="mr-2 my-1 px-0 order-1 order-sm-0"
            variant="outlined"
            min-width="64px"
            size="x-large"
            :disabled="goodsListRefreshing"
            :loading="goodsListRefreshing"
            @click.stop="onListRefreshClick">
        <VTooltip activator="parent" location="bottom">목록 새로고침</VTooltip>
        <VIcon>mdi-refresh</VIcon>
      </VBtn>
      <VBtn class="my-1 flex-grow-1 order-first order-sm-0"
            variant="outlined"
            size="x-large"
            :width="smAndUp ? 'auto' : '100%'"
            @click.stop="goodsAddDialogOpen = !goodsAddDialogOpen"><VIcon>mdi-plus</VIcon> 굿즈 추가</VBtn>
      <VBtn class="ml-2 my-1 px-0 order-1 order-sm-0"
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
import { useDisplay } from "vuetify";
import { unref } from "vue";
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

  goodsListRefreshing = false;

  get goodsCount(): string {
    return Object.keys(useAdminStore().boothGoodsList).length.toLocaleString();
  }

  get smAndUp(): boolean {
    return unref(useDisplay().smAndUp);
  }

  async onListRefreshClick() {
    this.goodsListRefreshing = true;
    await useAdminStore().fetchGoodsOfCurrentBooth(true);
    this.goodsListRefreshing = false;
  }

  onLoadGoodsFromFileClick(): void {
    alert("준비 중인 기능입니다.");
  }
}
</script>
