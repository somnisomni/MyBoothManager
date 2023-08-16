<template>
  <CommonDialog v-model="open"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynRes.title"
                :dialogPrimaryText="dynRes.primaryText"
                :onDialogPrimary="onDialogConfirm">
    <VForm v-model="manageFormValid">
      <VTextField v-model="manageFormData.name"
                  density="compact"
                  label="굿즈 이름" />
      <VTextField v-model="manageFormData.price"
                  density="compact"
                  type="number"
                  min="0"
                  label="가격 (단가)" />
      <VTextField v-model="manageFormData.stock!.initial"
                  density="compact"
                  type="number"
                  max="10000"
                  min="0"
                  label="초기 재고" />
      <VTextField v-model="manageFormData.stock!.current"
                  density="compact"
                  type="number"
                  :max="manageFormData.stock!.initial"
                  min="0"
                  label="현재 재고"
                  @focus="!manageFormData.stock!.current ? manageFormData.stock!.current = manageFormData.stock!.initial : undefined" />
    </VForm>
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

  manageFormData: Partial<GoodsData | Record<string, any>> = reactive({});
  manageFormValid: boolean = false;
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

      this.manageFormData = reactive({
        name: goodsData.name,
        price: goodsData.price,
        stock: {
          current: goodsData.stock.current,
          initial: goodsData.stock.initial,
        },
      });
    } else {
      this.manageFormData = reactive({
        name: null,
        price: null,
        stock: {
          current: null,
          initial: null,
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
          ...this.manageFormData,
          name: this.manageFormData.name?.trim(),
        });
      } else {
        const id = Date.now();
        useAdminStore().goodsList[id] = {
          id,
          boothId: useAdminStore().currentBoothId,
          name: this.manageFormData.name?.trim(),
          categoryId: 1,
          ...this.manageFormData,
        } as GoodsData;
      }

      this.updateInProgress = false;
      this.open = false;
    }, 1000);
  }
}
</script>
