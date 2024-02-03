<template>
  <CommonDialog v-model="open"
                :width="editMode ? '800px' : '500px'"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                hideCloseButton
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynString.primaryText"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogLeftButtonText="dynString.leftButtonText"
                @secondary="resetForm"
                @primary="onDialogConfirm"
                @cancel="onDialogCancel"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <p v-if="!editMode" class="mb-2 text-warning">※ 굿즈 이미지는 먼저 굿즈를 추가한 후, 굿즈 정보 수정 대화창에서 업로드 가능합니다.</p>
    <VLayout class="d-flex flex-column flex-md-row">
      <ImageWithUpload v-if="editMode"
                       class="flex-0-1 mr-4 align-self-center"
                       :existingSrc="goodsImageUrl"
                       contextName="굿즈"
                       width="200px"
                       height="250px"
                       aspectRatio="4/5"
                       hideSubtitle
                       controlsColumn
                       :uploadCallback="goodsImageUploadCallback"
                       :deleteCallback="goodsImageDeleteCallback" />

      <CommonForm v-model="isFormValid"
                  v-model:edited="isFormEdited"
                  v-model:data="formModels"
                  ref="form"
                  class="flex-1-1"
                  :initialModelValues="formModelsInitial"
                  :fields="formFields" />
    </VLayout>

    <GoodsCategoryManageDialog v-model="goodsCategoryManageDialogShown"
                               @updated="onGoodsCategoryUpdated" />
    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
    <ItemDeleteWarningDialog   v-model="deleteWarningDialogShown"
                               @primary="onDeleteConfirm" />
  </CommonDialog>
</template>

<script lang="ts">
import { ErrorCodes, GoodsStockVisibility, type IGoods, type IGoodsCreateRequest, type IGoodsUpdateRequest } from "@myboothmanager/common";
import { Vue, Component, Model, Prop, Watch, Ref } from "vue-facing-decorator";
import { reactive , readonly } from "vue";
import deepClone from "clone-deep";
import { useAdminStore } from "@/stores/admin";
import FormDataLossWarningDialog from "@/components/dialogs/common/FormDataLossWarningDialog.vue";
import CommonForm from "../common/CommonForm.vue";
import ImageWithUpload from "../common/ImageWithUpload.vue";
import { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import GoodsCategoryManageDialog from "./GoodsCategoryManageDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";

type IGoodsManageFormField = Omit<IGoodsCreateRequest, "boothId">;

@Component({
  components: {
    ImageWithUpload,
    CommonForm,
    GoodsCategoryManageDialog,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
})
export default class GoodsManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null }) goodsId!: number | null;

  @Ref("form") readonly form!: CommonForm;

  readonly formModels: IGoodsManageFormField = reactive({
    name: "",
    description: "",
    categoryId: -1,
    type: "",
    price: 0,
    stockInitial: 0,
    stockRemaining: 0,
    stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
  });
  readonly formFields = readonly({
    name: {
      type: FormFieldType.TEXT,
      label: "굿즈 이름",
      placeholder: "겁나 귀여운 코하루 아크릴 스탠드",
    },
    description: {
      type: FormFieldType.TEXT,
      label: "굿즈 설명",
      placeholder: "1/10 비율 등신대 아크릴 스탠드",
      optional: true,
    },
    categoryId: {
      type: FormFieldType.SELECT,
      label: "카테고리",
      get items() { return [...Object.values(useAdminStore().boothGoodsCategoryList), { boothId: -1, id: -1, name: "미분류" }]; },
      itemTitle: "name",
      itemValue: "id",
      additionalButtons: [
        {
          icon: "mdi-plus",
          title: "굿즈 카테고리 추가",
          onClick: this.openAddCategoryDialog,
        },
      ],
    },
    type: {
      type: FormFieldType.TEXT,
      label: "굿즈 종류",
      placeholder: "아크릴 스탠드",
      optional: true,
    },
    price: {
      type: FormFieldType.CURRENCY,
      label: "가격 (단가)",
      min: 0,
      allowDecimal: true,
    },
    stockInitial: {
      type: FormFieldType.NUMBER,
      label: "초기 재고",
      suffix: "개",
      min: 0,
      onChange: this.resetValidation,
    },
    stockRemaining: {
      type: FormFieldType.NUMBER,
      label: "현재 재고",
      suffix: "개",
      min: 0,
      onChange: this.resetValidation,
      rules: [ this.stockRemainingValidationRule ],
    },
    stockVisibility: {
      type: FormFieldType.SELECT,
      label: "재고 표시 방법",
      items: [
        { title: "남은 재고량 및 전체 재고량 표시", value: GoodsStockVisibility.SHOW_ALL },
        { title: "현재 남은 재고량만 표시", value: GoodsStockVisibility.SHOW_REMAINING_ONLY },
        { title: "전부 숨기기", value: GoodsStockVisibility.HIDE_ALL },
      ],
      itemTitle: "title",
      itemValue: "value",
      hint: "공개 페이지에서만 적용됩니다.",
      persistentHint: true,
    },
  } as Record<keyof IGoodsManageFormField, FormFieldOptions> | Record<string, FormFieldOptions>);
  formModelsInitial: IGoodsManageFormField = deepClone(this.formModels);

  goodsCategoryManageDialogShown = false;
  openAddCategoryDialog() { this.goodsCategoryManageDialogShown = true; }
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "굿즈 정보 수정" : "굿즈 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : null,
    };
  }

  get currentGoods(): IGoods | null {
    return (this.goodsId && (this.goodsId in useAdminStore().boothGoodsList)) ? readonly(useAdminStore().boothGoodsList[this.goodsId]) : null;
  }

  get goodsImageUrl(): string | null {
    return this.editMode && this.currentGoods ? this.currentGoods.goodsImageUrl ?? null : null;
  }

  get allCategoryData() {
    const list = Object.values(useAdminStore().boothGoodsCategoryList);
    list.push({ boothId: -1, id: -1, name: "미분류" });

    return list;
  }

  @Watch("open") mounted() {
    if(this.editMode && this.currentGoods) {
      this.formModels.name = this.currentGoods.name;
      this.formModels.description = this.currentGoods.description;
      this.formModels.categoryId = this.currentGoods.categoryId;
      this.formModels.type = this.currentGoods.type;
      this.formModels.price = this.currentGoods.price;
      this.formModels.stockInitial = this.currentGoods.stockInitial;
      this.formModels.stockRemaining = this.currentGoods.stockRemaining;
      this.formModels.stockVisibility = this.currentGoods.stockVisibility;
    } else {
      this.formModels.name = "";
      this.formModels.description = "";
      this.formModels.categoryId = -1;
      this.formModels.type = "";
      this.formModels.price = 0;
      this.formModels.stockInitial = 0;
      this.formModels.stockRemaining = 0;
      this.formModels.stockVisibility = GoodsStockVisibility.SHOW_REMAINING_ONLY;
    }

    this.formModelsInitial = deepClone(this.formModels);
    this.resetForm();
  }

  resetForm() { if(this.form) this.form.reset(); }
  resetValidation() { if(this.form) this.form.resetValidation(); }

  onGoodsCategoryUpdated(categoryId: number) {
    this.formModels.categoryId = categoryId;
  }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm() {
    this.updateInProgress = true;

    let result: boolean | ErrorCodes = false;

    if(this.editMode && this.goodsId) {
      // UPDATE

      const requestData: IGoodsUpdateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBoothId,
      };

      result = await useAdminStore().updateGoodsInfo(Number(this.goodsId!), requestData);
    } else {
      // CREATE

      const requestData: IGoodsCreateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBoothId,
      };

      result = await useAdminStore().createGoods(requestData);
    }

    if(result === true) {
      this.$emit("updated");
      this.open = false;
    } else {
      this.$emit("error");
      alert("오류 " + result);
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.goodsId) {
      const response = await useAdminStore().deleteGoods(Number(this.goodsId));

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        this.$emit("error");
        alert("오류 " + response);
      }
    }

    this.updateInProgress = false;
  }

  async goodsImageUploadCallback(file: File | Blob | null) {
    return await useAdminStore().uploadGoodsImage(Number(this.goodsId!), file!);
  }

  async goodsImageDeleteCallback() {
    return await useAdminStore().deleteGoodsImage(Number(this.goodsId!));
  }

  stockRemainingValidationRule() {
    if(this.formModels.stockRemaining > this.formModels.stockInitial) {
      return "현재 재고량은 초기 재고량보다 클 수 없습니다.";
    } else {
      return true;
    }
  }
}
</script>
