<template>
  <CommonDialog v-model="open"
                width="500px"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                hideCloseButton
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynString.primaryText"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogLeftButtonText="dynString.leftButtonText"
                @cancel="onDialogCancel"
                @primary="onDialogConfirm"
                @secondary="resetForm"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <CommonForm v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                ref="form"
                :initialModelValues="formModelsInitial"
                :fields="formFields" />
  </CommonDialog>

  <GoodsSelectionDialog      v-model="goodsSelectionDialogShown"
                             v-model:selectedGoodsIds="formModels.goodsIds"
                             :goodsList="boothGoodsList"
                             :categoryId="formModels.categoryId" />
  <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                             @primary="() => { open = false; }" />
  <ItemDeleteWarningDialog   v-model="deleteWarningDialogShown"
                             @primary="onDeleteConfirm" />
</template>

<script lang="ts">
import { GoodsStockVisibility, type IGoodsCombination, type IGoodsCombinationCreateRequest, type IGoodsCombinationUpdateRequest } from "@myboothmanager/common";
import { Component, Model, Prop, Ref, Vue, Watch } from "vue-facing-decorator";
import { reactive, readonly } from "vue";
import deepClone from "clone-deep";
import { useAdminStore } from "@/stores/admin";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";
import GoodsSelectionDialog from "./GoodsSelectionDialog.vue";

export type IGoodsCombinationManageFormField
  = Pick<IGoodsCombination, "name" | "description" | "categoryId" | "price" | "stockVisibility">
    & { goodsIds: number[] };

@Component({
  components: {
    CommonForm,
    GoodsSelectionDialog,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
})
export default class GoodsCombinationManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null }) combinationId!: number | string | null;

  @Ref("form") readonly form!: CommonForm;

  readonly dynString = {
    title: this.editMode ? "세트 구성 수정" : "세트 구성 추가",
    primaryText: this.editMode ? "수정" : "추가",
    secondaryText: this.editMode ? "되돌리기" : "초기화",
    leftButtonText: this.editMode ? "삭제" : undefined,
  };

  readonly formModels: IGoodsCombinationManageFormField = reactive({
    name: "",
    description: "",
    categoryId: -1,
    price: 0,
    goodsIds: [],
    stockVisibility: GoodsStockVisibility.SHOW_ALL,
  });
  readonly formFields = readonly({
    name: {
      type: FormFieldType.TEXT,
      label: "세트명",
      placeholder: "귀여운 코롯토 세트",
    },
    description: {
      type: FormFieldType.TEXT,
      optional: true,
      label: "세트 설명",
      placeholder: "귀엽고 맛있고 깨물어주고 싶은 코롯토를 세트로 사면 할인!",
    },
    categoryId: {
      type: FormFieldType.SELECT,
      label: "카테고리",
      items: [...Object.values(useAdminStore().boothGoodsCategoryList), { boothId: -1, id: -1, name: "미분류" }],
      itemTitle: "name",
      itemValue: "id",
      onSelectionChange: this.clearSelectedGoods,
      // additionalButtons: [
      //   {
      //     icon: "mdi-plus",
      //     title: "카테고리 추가",
      //     onClick() { alert("카테고리 추가"); },
      //   },
      // ],
    },
    price: {
      type: FormFieldType.CURRENCY,
      label: "세트 가격",
      allowDecimal: true,
    },
    _1: {
      type: FormFieldType.PARAGRAPH,
      content: "※ 세트 재고 수량은 포함된 굿즈 중 재고 수량이 가장 낮은 값으로 자동으로 설정됩니다.",
      class: [ "text-center", "text-disabled" ],
    },
    _2: {
      type: FormFieldType.PARAGRAPH,
      content: "세트에 포함할 굿즈 선택",
      class: [ "text-center" ],
      additionalButtons: [
        {
          icon: "mdi-plus",
          title: "굿즈 선택",
          onClick: this.openGoodsSelectionDialog,
        },
      ],
    },
  } as Record<keyof IGoodsCombinationManageFormField, FormFieldOptions> | Record<string, FormFieldOptions>);
  formModelsInitial: IGoodsCombinationManageFormField = deepClone(this.formModels);

  goodsSelectionDialogShown = false;
  openGoodsSelectionDialog() { this.goodsSelectionDialogShown = true; }
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get boothGoodsList() {
    return Object.values(useAdminStore().boothGoodsList);
  }

  @Watch("open") mounted() {
    if(this.editMode && this.combinationId) {
      const combination = useAdminStore().boothGoodsCombinationList[Number(this.combinationId)];

      if(combination) {
        this.formModels.name = combination.name;
        this.formModels.description = combination.description;
        this.formModels.categoryId = combination.categoryId;
        this.formModels.price = combination.price;
        this.formModels.goodsIds = Object.values(useAdminStore().boothGoodsList).filter((goods) => goods.combinationId === combination.id).map((goods) => goods.id);
        this.formModels.stockVisibility = combination.stockVisibility;

        this.formModelsInitial = deepClone(this.formModels);
      }
    } else {
      this.formModels.name = "";
      this.formModels.description = "";
      this.formModels.categoryId = -1;
      this.formModels.price = 0;
      this.formModels.goodsIds.splice(0, this.formModels.goodsIds.length);
      this.formModels.stockVisibility = GoodsStockVisibility.SHOW_ALL;

      this.formModelsInitial = deepClone(this.formModels);
    }

    this.resetForm();
  }

  resetForm() { if(this.form) this.form.reset(); }
  clearSelectedGoods() { this.formModels.goodsIds.splice(0, this.formModels.goodsIds.length); }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm() {
    this.updateInProgress = true;

    if(this.editMode) {
      const requestData: IGoodsCombinationUpdateRequest = {
        boothId: useAdminStore().currentBoothId,
        categoryId: this.formModels.categoryId,
        name: this.formModels.name,
        description: this.formModels.description,
        price: this.formModels.price,
        goodsIds: this.formModels.goodsIds,
        stockVisibility: this.formModels.stockVisibility,
      };
      const result = await useAdminStore().updateGoodsCombinationInfo(Number(this.combinationId!), requestData);

      if(result === true) {
        this.$emit("updated");
        this.open = false;
      } else {
        alert("오류 " + result);
      }
    } else {
      const requestData: IGoodsCombinationCreateRequest = {
        boothId: useAdminStore().currentBoothId,
        categoryId: this.formModels.categoryId,
        name: this.formModels.name,
        description: this.formModels.description,
        price: this.formModels.price,
        goodsIds: this.formModels.goodsIds,
      };
      const result = await useAdminStore().createGoodsCombination(requestData);

      if(result === true) {
        this.$emit("updated");
        this.open = false;
      } else {
        alert("오류 " + result);
      }
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.combinationId) {
      const response = await useAdminStore().deleteGoodsCombination(Number(this.combinationId));

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        alert("오류 " + response);
      }
    }

    this.updateInProgress = false;
  }
}
</script>
