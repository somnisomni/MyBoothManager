<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynRes.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynRes.primaryText"
                :dialogSecondaryText="dynRes.secondaryText"
                :dialogLeftButtonText="dynRes.leftButtonText"
                :onDialogCancel="onDialogCancel"
                :onDialogPrimary="onDialogConfirm"
                :onDialogSecondary="resetForm"
                :onDialogLeftButton="onDialogDeleteClick"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !formValid"
                :closeOnCancel="false">
    <VForm v-model="formValid">
      <VTextField v-model="formData.name"
                  tabindex="1"
                  density="compact"
                  label="굿즈 이름"
                  placeholder="예시) 겁나 귀여운 코하루 아크릴 스탠드"
                  :rules="stringValidator(formData.name)" />
      <VRow class="ma-0 d-flex flex-row">
        <VSelect v-model="formData.categoryId"
                 tabindex="2"
                 class="flex-grow-1"
                 :items="allCategoryData"
                 item-title="name"
                 item-value="id"
                 label="카테고리"
                 :rules="[!formData.categoryId ? '카테고리를 선택해주세요.' : true]" />
        <VBtn icon variant="flat" class="mt-1 ml-2"
              @click="goodsCategoryManageDialogShown = !goodsCategoryManageDialogShown">
          <VIcon>mdi-plus</VIcon>
        </VBtn>
      </VRow>
      <VTextField v-model="formData.description"
                  tabindex="3"
                  density="compact"
                  label="굿즈 설명"
                  placeholder="예시) 1/10 비율 등신대 아크릴 스탠드"
                  :rules="stringValidator(formData.description)" />
      <VTextField v-model="formData.type"
                  tabindex="4"
                  density="compact"
                  label="굿즈 종류"
                  placeholder="예시) 아크릴 스탠드"
                  :rules="stringValidator(formData.type)" />
      <VTextField v-model="formData.price"
                  tabindex="5"
                  density="compact"
                  type="number"
                  min="0"
                  :prefix="currencySymbol"
                  label="가격 (단가)"
                  :rules="numberValidator(formData.price)" />
      <VRow class="ma-0 d-flex flex-row">
        <VTextField v-model="formData.stockRemaining"
                    tabindex="7"
                    density="compact"
                    type="number"
                    :max="formData.stockInitial"
                    min="0"
                    suffix="개"
                    label="현재 재고"
                    :rules="numberValidatorStockRemaining(formData.stockRemaining)"
                    @focus="!formData.stockRemaining ? formData.stockRemaining = formData.stockInitial : undefined" />
        <span class="mx-2 mt-1" style="font-size: 1.5em"> / </span>
        <VTextField v-model="formData.stockInitial"
                    tabindex="6"
                    density="compact"
                    type="number"
                    max="10000"
                    min="0"
                    suffix="개"
                    label="초기 재고"
                    :rules="numberValidator(formData.stockInitial)" />
      </VRow>
    </VForm>

    <GoodsCategoryManageDialog v-model="goodsCategoryManageDialogShown" />
    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               :closeCallback="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import type { IGoodsCreateRequest, IGoodsUpdateRequest } from "@myboothmanager/common";
import { Vue, Component, Model, Prop, Watch } from "vue-facing-decorator";
import { reactive } from "vue";
import { useAdminStore } from "@/stores/admin";
import FormDataLossWarningDialog from "@/components/dialogs/common/FormDataLossWarningDialog.vue";
import GoodsCategoryManageDialog from "./GoodsCategoryManageDialog.vue";

@Component({
  components: {
    GoodsCategoryManageDialog,
    FormDataLossWarningDialog,
  },
})
export default class GoodsManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null }) goodsId!: number | string | null;

  readonly GOODS_ADD_DEFAULT_DATA: Partial<IGoodsCreateRequest> = {
    boothId: useAdminStore().currentBoothId,
    name: "",
    description: "",
    type: "",
    price: undefined,
    categoryId: -1,
    stockInitial: undefined,
    stockRemaining: undefined,
  };

  readonly dynRes = {
    title: this.editMode ? "굿즈 수정" : "굿즈 추가",
    primaryText: this.editMode ? "업데이트" : "추가",
    secondaryText: this.editMode ? "되돌리기" : "초기화",
    leftButtonText: this.editMode ? "삭제" : null,
  };

  updateInProgress = false;
  formData: IGoodsUpdateRequest | IGoodsCreateRequest = reactive({ boothId: useAdminStore().currentBoothId });
  formValid = false;
  goodsCategoryManageDialogShown = false;
  cancelWarningDialogShown = false;

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get allCategoryData() {
    const list = Object.values(useAdminStore().boothGoodsCategoryList);
    list.push({ boothId: -1, id: -1, name: "미분류" });

    return list;
  }

  get isFormEdited(): boolean {
    let edited = false;

    if(this.goodsId && this.editMode) {
      const currentGoodsData = useAdminStore().boothGoodsList[Number(this.goodsId!)];
      const formDataTyped = this.formData as IGoodsUpdateRequest;

      edited = Object.keys(this.formData).some((key) => {
        const k = key as keyof IGoodsUpdateRequest;
        return formDataTyped[k] !== currentGoodsData[k];
      });
    } else {
      const formDataTyped = this.formData as IGoodsCreateRequest;

      edited = Object.keys(this.formData).some((key) => {
        const k = key as keyof IGoodsCreateRequest;
        return formDataTyped[k] !== this.GOODS_ADD_DEFAULT_DATA[k];
      });
    }

    return edited;
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    if(this.goodsId && this.editMode) {
      const goodsData = useAdminStore().boothGoodsList[Number(this.goodsId)];

      this.formData = reactive({
        name: goodsData.name,
        description: goodsData.description,
        type: goodsData.type,
        price: goodsData.price,
        categoryId: goodsData.categoryId,
        stockInitial: goodsData.stockInitial,
        stockRemaining: goodsData.stockRemaining,
      } as IGoodsUpdateRequest);
    } else {
      this.formData = reactive({
        ...this.GOODS_ADD_DEFAULT_DATA,
      } as IGoodsCreateRequest);
    }

    this.formData.boothId = useAdminStore().currentBoothId;
  }

  stringValidator(input?: string): Array<string | boolean> {
    const rules = [
      (!input || input.trim().length <= 0) ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
    ];

    return rules;
  }

  numberValidator(input?: number): Array<string | boolean> {
    const rules = [
      !input ? "숫자를 입력해야 합니다." : true,
      (input && input < 0) ? "0 이하의 숫자는 입력할 수 없습니다." : true,
    ];

    return rules;
  }

  numberValidatorStockRemaining(input?: number): Array<string | boolean> {
    const rules = [
      ...this.numberValidator(input),
      (input && input > this.formData.stockInitial!) ? "현재 재고량은 초기 재고량보다 클 수 없습니다." : true,
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

  async onDialogConfirm() {
    let success = false;
    let errorMsg = "";

    this.updateInProgress = true;

    if(this.editMode) {
      const requestData: IGoodsUpdateRequest = {
        ...this.formData as IGoodsUpdateRequest,
        name: this.formData.name?.trim(),
        description: this.formData.description?.trim(),
        type: this.formData.type?.trim(),
      };
      const result = await useAdminStore().updateGoodsInfo(Number(this.goodsId!), requestData);

      if(result === true) {
        success = true;
      } else {
        errorMsg = result as string;
      }
    } else {
      const requestData: IGoodsCreateRequest = {
        ...this.formData as IGoodsCreateRequest,
        boothId: useAdminStore().currentBoothId,
        name: this.formData.name!.trim(),
        description: this.formData.description?.trim(),
        type: this.formData.type?.trim(),
      };
      const result = await useAdminStore().createGoods(requestData);

      if(result === true) {
        success = true;
      } else {
        errorMsg = result as string;
      }
    }

    this.updateInProgress = false;

    if(success) {
      this.$emit("updated");
      this.open = false;
    } else {
      this.$emit("error");

      // TODO: error dialog
      alert(errorMsg);
    }
  }

  onDialogDeleteClick() {
    alert("기능 추가 예정");
  }
}
</script>