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
      <VLayout class="d-flex flex-column flex-grow-1 order-first flex-sm-row order-sm-0"
               :style="{ 'width': smAndUp ? 'auto' : '100%' }">
        <VBtn class="my-1 mx-sm-1 flex-grow-1"
              variant="outlined"
              size="x-large"
              prepend-icon="mdi-plus"
              @click.stop="goodsAddDialogOpen = !goodsAddDialogOpen">굿즈 추가</VBtn>
        <VBtn class="my-1 mx-sm-1"
              variant="outlined"
              size="x-large"
              prepend-icon="mdi-set-all"
              @click.stop="combinationAddDialogOpen = !combinationAddDialogOpen">세트 구성 추가</VBtn>
      </VLayout>
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
  <GoodsCombinationManageDialog v-model="combinationAddDialogOpen" />
</template>

<script lang="ts">
import { Vue, Component, Setup } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/plugins/stores/admin";
import GoodsManageDialog from "@/components/dialogs/GoodsManageDialog.vue";
import { useAdminAPIStore } from "@/plugins/stores/api";
import DashboardPanel from "../dashboard/DashboardPanel.vue";
import GoodsCombinationManageDialog from "../dialogs/GoodsCombinationManageDialog.vue";

@Component({
  components: {
    DashboardPanel,
    GoodsManageDialog,
    GoodsCombinationManageDialog,
  },
})
export default class GoodsManagePanel extends Vue {
  goodsAddDialogOpen = false;
  combinationAddDialogOpen = false;

  goodsListRefreshing = false;

  @Setup(() => useDisplay().smAndUp)
  smAndUp!: boolean;

  get goodsCount(): string {
    return Object.keys(useAdminStore().currentBooth.goods ?? {}).length.toLocaleString();
  }

  async onListRefreshClick() {
    this.goodsListRefreshing = true;
    await useAdminAPIStore().fetchGoodsOfCurrentBooth();
    await useAdminAPIStore().fetchGoodsCategoriesOfCurrentBooth();
    await useAdminAPIStore().fetchGoodsCombinationsOfCurrentBooth();
    this.goodsListRefreshing = false;
  }

  onLoadGoodsFromFileClick(): void {
    alert("준비 중인 기능입니다.");
  }
}
</script>
