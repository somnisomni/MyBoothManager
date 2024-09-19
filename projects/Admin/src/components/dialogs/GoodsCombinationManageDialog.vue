<template>
  <CommonDialog v-model="open"
                :width="editMode ? '800px' : '500px'"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="isFormEdited || updateInProgress"
                fullscreenOnSmallScreen
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynString.primaryText"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogLeftButtonText="dynString.leftButtonText"
                @primary="onDialogConfirm"
                @secondary="form?.reset"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                @cancel="onDialogCancel"
                :disableSecondary="!isFormEdited"
                :disablePrimary="(!duplicate && !isFormEdited) || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column flex-md-row">
      <ImageWithUpload v-if="editMode"
                       class="flex-0-1 mr-4 align-self-center"
                       :existingSrc="combinationImagePath"
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
                    :fields="formFields"
                    :disabled="updateInProgress" />

        <!-- Selected goods status -->
        <VExpandTransition>
          <div v-if="formModels.goodsIds.length > 0" class="text-subtitle-2 mx-2">
            <div class="d-flex flex-row flex-wrap justify-end">
              <span class="mr-2">굿즈 <b>{{ formModels.goodsIds.length }}종</b> 선택됨</span>
              <VSpacer />
              <span class="text-right">세트 판매 가능한 재고량 <b>{{ minimumStockOfSelectedGoods.toLocaleString() }}세트</b></span>
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

  <GoodsSelectionDialog v-model="goodsSelectionDialogShown"
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
import { GoodsStockVisibility, type IGoodsCombinationCreateRequest, type IGoodsCombinationUpdateRequest } from "@myboothmanager/common";
import { Component, Model, Prop, Ref, Setup, toNative, Vue, Watch } from "vue-facing-decorator";
import { reactive, readonly } from "vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import ImageWithUpload from "../common/ImageWithUpload.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";
import GoodsSelectionDialog from "./GoodsSelectionDialog.vue";

@Component({
  components: {
    ImageWithUpload,
    CommonForm,
    GoodsSelectionDialog,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
  emits: [ "updated", "deleted", "error" ],
})
class GoodsCombinationManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Number,  default: null  }) readonly combinationId?: number | string | null;
  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;
  @Prop({ type: Boolean, default: false }) readonly duplicate!: boolean;

  @Ref("form") readonly form?: CommonForm;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  readonly formModels: IGoodsCombinationCreateRequest = reactive({
    boothId: -1,
    categoryId: -1,
    name: "",
    description: "",
    price: 0,
    stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
    goodsIds: [],
  });

  readonly formFields = readonly({
    name: {
      type: FormFieldType.TEXT,
      label: "세트명",
      placeholder: "귀여운 코롯토 세트",
    },
    description: {
      type: FormFieldType.TEXTAREA,
      optional: true,
      label: "세트 설명",
      placeholder: "귀엽고 맛있고 깨물어주고 싶은 코롯토를 세트로 사면 할인!",
      autoGrow: true,
      rows: 3,
    },
    categoryId: {
      type: FormFieldType.SELECT,
      label: "카테고리",
      get items() { return [...Object.values(useAdminStore().currentBooth.goodsCategories ?? {}), { boothId: -1, id: -1, name: "미분류" }]; },
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
      get step() { return useAdminStore().currentBoothCurrencyInfo.step; },
      min: 0,
    },
    stockVisibility: {
      type: FormFieldType.SELECT,
      label: "재고 표시 방법",
      items: [
        { title: "현재 남은 재고량만 표시", value: GoodsStockVisibility.SHOW_REMAINING_ONLY },
        { title: "전부 숨기기", value: GoodsStockVisibility.HIDE_ALL },
      ],
      itemTitle: "title",
      itemValue: "value",
      hint: "공개 페이지에서만 적용되며, 관리자 페이지에선 항상 모든 재고량 정보가 표시됩니다.",
      persistentHint: true,
    },
    _1: {
      type: FormFieldType.PARAGRAPH,
      content: "※ 세트 재고 수량은 포함된 굿즈 중 재고 수량이 가장 낮은 값으로 자동으로 설정됩니다.",
      class: [ "text-center", "text-disabled", "mt-4" ],
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
  } as Record<keyof IGoodsCombinationCreateRequest, FormFieldOptions> | Record<string, FormFieldOptions>);

  goodsSelectionDialogShown = false;
  openGoodsSelectionDialog() { this.goodsSelectionDialogShown = true; }
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  _isFormValid = false;
  get isFormValid() { return this._isFormValid && this.formModels.goodsIds.length >= 2; }
  set isFormValid(value: boolean) { this._isFormValid = value; }
  isFormEdited = false;
  updateInProgress = false;

  get dynString() {
    return {
      title: this.editMode ? "세트 구성 수정" : "세트 구성 추가",
      primaryText: this.editMode ? "수정" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : undefined,
    };
  }

  get minimumStockOfSelectedGoods() {
    return Math.min(...this.formModels.goodsIds.map((goodsId) => useAdminStore().currentBooth.goods![goodsId].stock.remaining));
  }

  get sumPriceOfSelectedGoods() {
    return this.formModels.goodsIds.reduce((acc, goodsId) => acc + useAdminStore().currentBooth.goods![goodsId].price, 0);
  }

  get boothGoodsList() {
    return Object.values(useAdminStore().currentBooth.goods ?? {});
  }

  get alreadyCombinatedGoodsIdList() {
    return Object.values(useAdminStore().currentBooth.goods ?? {})
      .filter((goods) => (this.duplicate && goods.combinationId === Number(this.combinationId)) || (goods.combinationId !== null && goods.combinationId !== Number(this.combinationId)))
      .map((goods) => goods.id);
  }

  get combinationImagePath(): string | null {
    return this.editMode ? useAdminStore().currentBooth.goodsCombinations![Number(this.combinationId)]?.goodsImage?.path ?? null : null;
  }

  @Watch("open")
  async onDialogOpen(open: boolean) {
    if(!open) return;

    while(!this.form) await this.$nextTick();

    if(this.combinationId && (this.editMode || this.duplicate)) {
      const combination = useAdminStore().currentBooth.goodsCombinations![Number(this.combinationId)];

      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        categoryId: combination.categoryId,
        name: combination.name,
        description: combination.description,
        price: combination.price,
        stockVisibility: combination.stock.visibility,
        goodsIds: !this.duplicate
          ? Object.values(useAdminStore().currentBooth.goods ?? {}).filter((goods) => goods.combinationId === combination.id).map((goods) => goods.id)
          : [],
      } as IGoodsCombinationUpdateRequest);
    } else {
      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        categoryId: -1,
        name: "",
        description: "",
        price: 0,
        stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
        goodsIds: [],
      } as IGoodsCombinationCreateRequest);
    }
  }

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
        ...this.form!.getDiffOfModel(),
        boothId: useAdminStore().currentBooth.booth!.id,
      };
      const result = await useAdminAPIStore().updateGoodsCombinationInfo(Number(this.combinationId!), requestData);

      if(result === true) {
        this.$emit("updated");
        this.open = false;
      } else {
        this.$emit("error");
      }
    } else {
      const requestData: IGoodsCombinationCreateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBooth.booth!.id,
      };
      const result = await useAdminAPIStore().createGoodsCombination(requestData);

      if(result === true) {
        this.$emit("updated");
        this.open = false;
      } else {
        this.$emit("error");
      }
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.combinationId) {
      const response = await useAdminAPIStore().deleteGoodsCombination(Number(this.combinationId));

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        this.$emit("error");
      }
    }

    this.updateInProgress = false;
  }

  async combinationImageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadGoodsCombinationImage(Number(this.combinationId!), file!);
  }

  async combinationImageDeleteCallback() {
    return await useAdminAPIStore().deleteGoodsCombinationImage(Number(this.combinationId!));
  }
}

export default toNative(GoodsCombinationManageDialog);
</script>
