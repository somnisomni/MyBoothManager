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
                @cancel="onDialogCancel"
                @primary="onDialogConfirm"
                @secondary="resetForm"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column flex-md-row">
      <ImageWithUpload v-if="editMode"
                       class="flex-0-1 mr-4 align-self-center"
                       :existingSrc="combinationImageUrl"
                       contextName="굿즈 세트"
                       width="200px"
                       height="250px"
                       aspectRatio="4/5"
                       hideSubtitle
                       controlsColumn
                       :uploadCallback="combinationImageUploadCallback"
                       :deleteCallback="combinationImageDeleteCallback" />
      <div class="flex-1-1">
        <CommonForm v-model="isFormValid"
                    v-model:edited="isFormEdited"
                    v-model:data="formModels"
                    ref="form"
                    class="flex-1-1"
                    :initialModelValues="formModelsInitial"
                    :fields="formFields" />

        <!-- Selected goods status -->
        <VExpandTransition>
          <div v-if="formModels.goodsIds.length > 0" class="text-subtitle-2 mx-2">
            <div class="d-flex flex-row flex-wrap justify-end">
              <span class="mr-2">굿즈 <b>{{ formModels.goodsIds.length }}개</b> 선택됨</span>
              <VSpacer />
              <span class="text-right">세트 판매 가능한 재고량 <b>{{ minimumStockOfSelectedGoods.toLocaleString() }}개</b></span>
            </div>
            <div class="text-right">선택한 굿즈들의 가격 총합 <b>{{ currencySymbol }}{{ sumPriceOfSelectedGoods.toLocaleString() }}</b></div>
          </div>
        </VExpandTransition>

        <!-- Selected goods count < 2 alert-->
        <VSlideYTransition>
          <VAlert v-if="formModels.goodsIds.length < 2"
                  type="warning"
                  class="mt-2">
            <span><strong>최소 2개 이상</strong>의 굿즈를 세트에 포함시켜야 합니다.</span>
          </VAlert>
        </VSlideYTransition>
      </div>
    </VLayout>
  </CommonDialog>

  <GoodsSelectionDialog      v-model="goodsSelectionDialogShown"
                             v-model:selectedGoodsIds="formModels.goodsIds"
                             :goodsList="boothGoodsList"
                             :disabledIdList="alreadyCombinatedGoodsIdList"
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
import ImageWithUpload from "../common/ImageWithUpload.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";
import GoodsSelectionDialog from "./GoodsSelectionDialog.vue";

export type IGoodsCombinationManageFormField
  = Pick<IGoodsCombination, "name" | "description" | "categoryId" | "price" | "stockVisibility">
    & { goodsIds: number[] };

@Component({
  components: {
    ImageWithUpload,
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
      get items() { return [...Object.values(useAdminStore().boothGoodsCategoryList), { boothId: -1, id: -1, name: "미분류" }]; },
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
    _3: {
      type: FormFieldType.PARAGRAPH,
      content: "※ 동일 카테고리 내의 굿즈만 선택할 수 있습니다. 현재는 한 굿즈에 1개의 세트 할당만 지원됩니다.",
      class: [ "text-center", "text-disabled" ],
    },
    _2: {
      type: FormFieldType.BUTTON,
      content: "포함할 굿즈 선택",
      class: [ "text-center", "mt-4" ],
      size: "x-large",
      color: "primary",
      prependIcon: "mdi-selection-drag",
      onClick: this.openGoodsSelectionDialog,
    },
  } as Record<keyof IGoodsCombinationManageFormField, FormFieldOptions> | Record<string, FormFieldOptions>);
  formModelsInitial: IGoodsCombinationManageFormField = deepClone(this.formModels);

  goodsSelectionDialogShown = false;
  openGoodsSelectionDialog() { this.goodsSelectionDialogShown = true; }
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  _isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get isFormValid() { return this._isFormValid && this.formModels.goodsIds.length >= 2; }
  set isFormValid(value: boolean) { this._isFormValid = value; }

  get minimumStockOfSelectedGoods() {
    return Math.min(...this.formModels.goodsIds.map((goodsId) => useAdminStore().boothGoodsList[goodsId].stockRemaining));
  }

  get sumPriceOfSelectedGoods() {
    return this.formModels.goodsIds.reduce((acc, goodsId) => acc + useAdminStore().boothGoodsList[goodsId].price, 0);
  }

  get boothGoodsList() {
    return Object.values(useAdminStore().boothGoodsList);
  }

  get currencySymbol() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  get alreadyCombinatedGoodsIdList() {
    return Object.values(useAdminStore().boothGoodsList)
      .filter((goods) => goods.combinationId !== null && goods.combinationId !== Number(this.combinationId))
      .map((goods) => goods.id);
  }

  get combinationImageUrl(): string | null {
    return this.editMode ? useAdminStore().boothGoodsCombinationList[Number(this.combinationId)].combinationImageUrl ?? null : null;
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

  async combinationImageUploadCallback(file: File | Blob | null) {
    return await useAdminStore().uploadGoodsCombinationImage(Number(this.combinationId!), file!);
  }

  async combinationImageDeleteCallback() {
    return await useAdminStore().deleteGoodsCombinationImage(Number(this.combinationId!));
  }
}
</script>
