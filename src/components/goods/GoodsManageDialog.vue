<template>
  <CommonDialog v-model="open"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynRes.title"
                :dialogPrimaryText="dynRes.primaryText"
                :onDialogPrimary="onDialogConfirm">
    <p>굿즈 이름: {{ editFormData.name }}</p>
    <p>가격: {{ currentBoothCurrencySymbol }}{{ editFormData.price?.toLocaleString() }}</p>
    <p>재고: 현재 {{ editFormData.stock?.current }} / 전체 {{ editFormData.stock?.initial }}</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import CommonDialog from "@/components/common/CommonDialog.vue";
import type { GoodsData } from "@/types/goods";
import { reactive } from "vue";

@Component({
  components: {
    CommonDialog,
  },
})
export default class GoodsManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null, required: true }) goodsId!: number | string | null;

  editFormData: Partial<GoodsData> = reactive({});
  updateInProgress: boolean = false;

  get dynRes(): Record<string, any> {
    return {
      title: this.editMode ? "굿즈 수정" : "굿즈 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
    };
  }

  get currentBoothCurrencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    if(this.goodsId) {
      const goodsData = useAdminStore().goodsList[parseInt(this.goodsId.toString())];

      this.editFormData = reactive({
        name: goodsData.name,
        price: goodsData.price,
        stock: {
          current: goodsData.stock.current,
          initial: goodsData.stock.initial,
        },
      });
    }
  }

  onDialogConfirm() {
    // TODO: Replace real API call. Below is a mock.

    this.updateInProgress = true;
    setTimeout(() => {
      if(this.goodsId) {
        Object.assign(useAdminStore().goodsList[parseInt(this.goodsId.toString())], {
          ...this.editFormData,
          name: this.editFormData.name?.trim(),
        });
      }

      this.updateInProgress = false;
      this.open = false;
    }, 1000);
  }
}
</script>
