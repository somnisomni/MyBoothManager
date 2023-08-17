<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynRes.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynRes.primaryText"
                :dialogSecondaryText="dynRes.secondaryText"
                :onDialogCancel="onDialogCancel"
                :onDialogSecondary="resetForm"
                :onDialogPrimary="onDialogConfirm"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !manageFormValid"
                :closeOnCancel="false">
    <VForm v-model="manageFormValid">
      <VTextField v-model="manageFormData.name"
                  tabindex="1"
                  density="compact"
                  label="굿즈 이름"
                  :rules="stringValidator(manageFormData.name)" />
      <VRow class="ma-0 d-flex flex-row">
        <VSelect v-model="manageFormData.categoryId"
                 tabindex="2"
                 class="flex-grow-1"
                 :items="allCategoryData"
                 item-title="name"
                 item-value="id"
                 label="카테고리"
                 :rules="[!manageFormData.categoryId ? '카테고리를 선택해주세요.' : true]" />
        <VBtn icon variant="flat" class="mt-1 ml-2"
              @click="goodsCategoryAddDialogOpen = !goodsCategoryAddDialogOpen">
          <VIcon>mdi-plus</VIcon>
        </VBtn>
      </VRow>
      <VTextField v-model="goodsitemtype_temp"
                  tabindex="3"
                  density="compact"
                  label="굿즈 종류"
                  :rules="stringValidator(goodsitemtype_temp)" />
      <VTextField v-model="manageFormData.price"
                  tabindex="4"
                  density="compact"
                  type="number"
                  min="0"
                  :prefix="currentBoothCurrencySymbol"
                  label="가격 (단가)"
                  :rules="numberValidator(manageFormData.price)" />
      <VRow class="ma-0 d-flex flex-row">
        <VTextField v-model="manageFormData.stock!.current"
                    tabindex="6"
                    density="compact"
                    type="number"
                    :max="manageFormData.stock!.initial"
                    min="0"
                    suffix="개"
                    label="현재 재고"
                    :rules="numberValidator(manageFormData.stock!.current)"
                    @focus="!manageFormData.stock!.current ? manageFormData.stock!.current = manageFormData.stock!.initial : undefined" />
        <span class="mx-2 mt-1" style="font-size: 1.5em"> / </span>
        <VTextField v-model="manageFormData.stock!.initial"
                    tabindex="5"
                    density="compact"
                    type="number"
                    max="10000"
                    min="0"
                    suffix="개"
                    label="초기 재고"
                    :rules="numberValidator(manageFormData.stock!.initial)" />
      </VRow>
    </VForm>

    <GoodsCategoryAddDialog v-model="goodsCategoryAddDialogOpen" />
    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               :closeCallback="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import CommonDialog from "@/components/common/CommonDialog.vue";
import GoodsCategoryAddDialog from "./GoodsCategoryAddDialog.vue";
import type { GoodsData } from "@/types/goods";
import { reactive } from "vue";
import FormDataLossWarningDialog from "@/components/common/FormDataLossWarningDialog.vue";

@Component({
  components: {
    CommonDialog,
    GoodsCategoryAddDialog,
    FormDataLossWarningDialog,
  },
})
export default class GoodsManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null, required: true }) goodsId!: number | string | null;

  goodsCategoryAddDialogOpen: boolean = false;
  cancelWarningDialogShown: boolean = false;
  manageFormData: Partial<GoodsData | Record<string, any>> = reactive({});
  manageFormValid: boolean = false;
  updateInProgress: boolean = false;

  goodsitemtype_temp: string = "";

  get dynRes(): Record<string, any> {
    return {
      title: this.editMode ? "굿즈 수정" : "굿즈 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
    };
  }

  get currentBoothCurrencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get currentGoodsData(): GoodsData | null {
    if(this.goodsId) {
      return useAdminStore().goodsList[parseInt(this.goodsId.toString())];
    } else {
      return null;
    }
  }

  get allCategoryData() {
    return Object.values(useAdminStore().goodsCategoryList);
  }

  get isFormEdited(): boolean {
    // FIXME: Only 1-level nested object( {a:{b:c}} ) will be flatten.
    const manageFormDataFlatten = Object.values(this.manageFormData).flatMap((v) => {
      if(v && typeof v === "object") return Object.values(v);
      else return v;
    });

    if(!this.editMode && manageFormDataFlatten.some((v) => v)) {
      return true;
    } else if(this.editMode && this.currentGoodsData) {
      // FIXME: Only valid for single-level object( {a:b} ). Not working for current GoodsData type.
      for(const key in this.manageFormData) {
        const k = key as keyof GoodsData;

        if(this.manageFormData[k] !== this.currentGoodsData[k]) {
          return true;
        }
      }
    }

    return false;
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    if(this.currentGoodsData) {
      this.manageFormData = reactive({
        name: this.currentGoodsData.name,
        price: this.currentGoodsData.price,
        categoryId: this.currentGoodsData.categoryId,
        stock: {
          current: this.currentGoodsData.stock.current,
          initial: this.currentGoodsData.stock.initial,
        },
      });
    } else {
      this.manageFormData = reactive({
        name: null,
        price: null,
        categoryId: null,
        stock: {
          current: null,
          initial: null,
        },
      });
    }
  }

  stringValidator(input: string): Array<string | boolean> {
    const rules = [
      (!input || input.trim().length <= 0) ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
    ];

    return rules;
  }

  numberValidator(input: number): Array<string | boolean> {
    const rules = [
      !input ? "숫자를 입력해야 합니다." : true,
      input < 0 ? "0 이하의 숫자는 입력할 수 없습니다." : true,
    ];

    return rules;
  }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
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
