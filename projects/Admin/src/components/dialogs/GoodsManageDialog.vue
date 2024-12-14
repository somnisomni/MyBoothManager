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
                :disableSecondary="!isFormEdited"
                :disablePrimary="(!duplicate && !isFormEdited) || !isFormValid"
                :closeOnCancel="false"
                @primary="onDialogConfirm"
                @secondary="form?.reset"
                @cancel="onDialogCancel"
                @leftbutton="() => { deleteWarningDialogShown = true; }">
    <p v-if="!editMode"
       class="mb-2 text-warning">
      ※ 굿즈 이미지는 먼저 굿즈를 추가한 후, 굿즈 정보 수정 대화창에서 업로드 가능합니다.
    </p>
    <VLayout class="d-flex flex-column flex-md-row">
      <ImageWithUpload v-if="editMode"
                       class="flex-0-1 mr-4 align-self-center"
                       :existingSrc="goodsImagePath"
                       contextName="굿즈"
                       width="200px"
                       height="250px"
                       aspectRatio="4/5"
                       hideSubtitle
                       controlsColumn
                       :uploadCallback="goodsImageUploadCallback"
                       :deleteCallback="goodsImageDeleteCallback" />

      <CommonForm ref="form"
                  v-model="isFormValid"
                  v-model:edited="isFormEdited"
                  v-model:data="formModels"
                  class="flex-1-1"
                  :fields="formFields"
                  :disabled="updateInProgress" />
    </VLayout>

    <GoodsCategoryManageDialog v-model="goodsCategoryManageDialogShown"
                               @updated="onGoodsCategoryUpdated" />
    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
    <ItemDeleteWarningDialog v-model="deleteWarningDialogShown"
                             @primary="onDeleteConfirm" />
  </CommonDialog>
</template>

<script lang="ts">
import type { FormFieldOptions } from "../common/CommonForm.vue";
import type { GoodsAdmin } from "@/lib/classes";
import type { ErrorCodes, IGoodsCategory, IGoodsCreateRequest, IGoodsUpdateRequest } from "@myboothmanager/common";
import type { DeepReadonly } from "vue";
import { GoodsStockVisibility } from "@myboothmanager/common";
import deepClone from "clone-deep";
import { reactive, readonly } from "vue";
import { Vue, Component, Model, Prop, Watch, Ref } from "vue-facing-decorator";
import FormDataLossWarningDialog from "@/components/dialogs/common/FormDataLossWarningDialog.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { CommonForm, FormFieldType } from "../common/CommonForm.vue";
import ImageWithUpload from "../common/ImageWithUpload.vue";
import GoodsCategoryManageDialog from "./GoodsCategoryManageDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";

@Component({
  components: {
    ImageWithUpload,
    CommonForm,
    GoodsCategoryManageDialog,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
  emits: [ "created", "updated", "deleted", "error" ],
})
export default class GoodsManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;
  @Prop({ type: Number, default: null }) declare readonly goodsId?: number | null;
  @Prop({ type: Boolean, default: false }) declare readonly editMode: boolean;
  @Prop({ type: Boolean, default: false }) declare readonly duplicate: boolean;

  @Ref("form") readonly form?: CommonForm;

  readonly formModels: IGoodsCreateRequest = reactive({
    boothId: -1,
    name: "",
    description: "",
    categoryId: -1,
    type: "",
    price: 0,
    stockInitial: 0,
    stockRemaining: 0,
    stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
    ownerMemberIds: [],
  });

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "굿즈 이름",
      placeholder: "겁나 귀여운 코하루 아크릴 스탠드",
    },
    description: {
      type: FormFieldType.TEXTAREA,
      label: "굿즈 설명",
      placeholder: "1/10 비율 등신대 아크릴 스탠드",
      optional: true,
      autoGrow: true,
      rows: 3,
    },
    categoryId: {
      type: FormFieldType.SELECT,
      label: "카테고리",
      get items() { return [ ...Object.values(useAdminStore().currentBooth.goodsCategories ?? {}), { boothId: -1, id: -1, name: "미분류" } ]; },
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
      get step() { return useAdminStore().currentBoothCurrencyInfo.step; },
      allowDecimal: true,
      hint: "가격을 0으로 설정하면 해당 굿즈를 증정용으로 표시합니다.",
      persistentHint: true,
    },
    stockInitial: {
      type: FormFieldType.NUMBER,
      label: "초기 재고",
      suffix: "개",
      min: 0,
      onChange: this.resetValidationProxy,
    },
    stockRemaining: {
      type: FormFieldType.NUMBER,
      label: "현재 재고",
      suffix: "개",
      min: 0,
      onChange: this.resetValidationProxy,
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
      hint: "공개 페이지에서만 적용되며, 관리자 페이지에선 항상 모든 재고량 정보가 표시됩니다.",
      persistentHint: true,
    },
    ownerMemberIds: {
      type: FormFieldType.SELECT,
      label: "소유자 멤버",
      optional: true,
      get items() {
        return Object.values(useAdminStore().currentBooth.boothMembers ?? {}).map(
          (member) => { return { title: member.name, id: member.id }; },
        );
      },
      itemTitle: "title",
      itemValue: "id",
      multiple: true,
    },
  } as Record<keyof IGoodsCreateRequest, FormFieldOptions> | Record<string, FormFieldOptions>;

  resetValidationProxy(): void {
    this.form?.resetValidation();
  }

  openAddCategoryDialog(): void {
    this.goodsCategoryManageDialogShown = true;
  }

  goodsCategoryManageDialogShown = false;
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

  get currentGoods(): DeepReadonly<GoodsAdmin> | null {
    return (this.goodsId && (this.goodsId in (useAdminStore().currentBooth.goods ?? {}))) ? readonly(useAdminStore().currentBooth.goods?.[this.goodsId] as GoodsAdmin) : null;
  }

  get goodsImagePath(): string | null {
    return this.editMode && this.currentGoods ? this.currentGoods.goodsImage?.path ?? null : null;
  }

  get allCategoryData(): DeepReadonly<Record<number, IGoodsCategory>> {
    return readonly([
      ...Object.values(useAdminStore().currentBooth.goodsCategories as Record<number, IGoodsCategory>),
      { boothId: -1, id: -1, name: "미분류" },
    ]);
  }

  @Watch("open")
  async onDialogOpen(open: boolean): Promise<void> {
    if(!open) {
      return;
    }

    while(!this.form) {
      await this.$nextTick();
    }

    const booth = useAdminStore().currentBooth.booth;

    if(!booth) {
      this.open = false;
      return;
    }

    if(this.currentGoods && (this.editMode || this.duplicate)) {
      this.form.setInitialModel({
        boothId: booth.id,
        categoryId: this.currentGoods.categoryId,
        name: this.currentGoods.name,
        description: this.currentGoods.description,
        type: this.currentGoods.type,
        price: this.currentGoods.price,
        stockInitial: this.currentGoods.stock.initial,
        stockRemaining: this.currentGoods.stock.remaining,
        stockVisibility: this.currentGoods.stock.visibility,
        ownerMemberIds: deepClone(this.currentGoods.ownerMemberIds),
      } as IGoodsUpdateRequest);
    } else {
      this.form.setInitialModel({
        boothId: booth.id,
        categoryId: -1,
        name: "",
        description: "",
        type: "",
        price: 0,
        stockInitial: 0,
        stockRemaining: 0,
        stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
        ownerMemberIds: [],
      } as IGoodsCreateRequest);
    }
  }

  onGoodsCategoryUpdated(categoryId: number): void {
    this.formModels.categoryId = categoryId;
  }

  onDialogCancel(): void {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm(): Promise<void> {
    this.updateInProgress = true;

    let result: boolean | ErrorCodes;

    if(this.editMode && this.goodsId) {
      // UPDATE

      const requestData: IGoodsUpdateRequest = {
        ...this.form?.getDiffOfModel(),
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().updateGoodsInfo(Number(this.goodsId!), requestData);
    } else {
      // CREATE

      const requestData: IGoodsCreateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().createGoods(requestData);
    }

    if(result === true) {
      this.$emit(this.editMode ? "updated" : "created");
      this.open = false;
    } else {
      this.$emit("error", result);
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm(): Promise<void> {
    this.updateInProgress = true;

    if(this.goodsId) {
      const response = await useAdminAPIStore().deleteGoods(Number(this.goodsId));

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        this.$emit("error", response);
      }
    }

    this.updateInProgress = false;
  }

  async goodsImageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadGoodsImage(Number(this.goodsId!), file!);
  }

  async goodsImageDeleteCallback() {
    return await useAdminAPIStore().deleteGoodsImage(Number(this.goodsId!));
  }

  stockRemainingValidationRule() {
    if(this.formModels.stockRemaining! > this.formModels.stockInitial!) {
      return "현재 재고량은 초기 재고량보다 클 수 없습니다.";
    } else {
      return true;
    }
  }
}
</script>
