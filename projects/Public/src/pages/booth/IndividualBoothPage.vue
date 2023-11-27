<template>
  <VMain>
    <SharePanel />

    <VContainer v-if="isDataLoaded">
      <GoodsListView :currencySymbol="boothData?.currencySymbol"
                     :goodsList="boothGoodsList"
                     :goodsCategoryList="boothCategoryList"
                     :editable="false"
                     omitEmptyGoodsCategory />
    </VContainer>
  </VMain>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { type IBooth, type IGoods, type IGoodsCategory } from "@myboothmanager/common";
import SharePanel from "@/components/booth/SharePanel.vue";
import { usePublicStore } from "@/stores/public";

@Component({
  components: {
    SharePanel,
  },
})
export default class IndividualBoothPage extends Vue {
  isDataLoaded: boolean = false;

  boothData: IBooth | null = null;
  boothGoodsList: Array<IGoods> = [];
  boothCategoryList: Array<IGoodsCategory> = [];

  get boothId(): number {
    return parseInt(useRoute().params["boothId"] as string);
  }

  async mounted() {
    await this.fetchData();
    this.isDataLoaded = true;
  }

  async fetchData() {
    this.boothData = await usePublicStore().apiCaller.fetchSingleBooth(this.boothId);
    this.boothGoodsList = await usePublicStore().apiCaller.fetchAllGoodsOfBooth(this.boothId);
    this.boothCategoryList = await usePublicStore().apiCaller.fetchAllGoodsCategoryOfBooth(this.boothId);
  }
}
</script>
