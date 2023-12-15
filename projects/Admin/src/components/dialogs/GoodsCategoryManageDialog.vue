<template>
  <CommonDialog v-model="open"
                width="500px"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
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
                :disablePrimary="!isFormEdited || !formValid"
                :closeOnCancel="false">
    <VForm v-model="formValid" @submit.prevent>
      <VTextField v-model.trim="formData.name"
                  tabindex="1"
                  density="compact"
                  label="굿즈 카테고리 이름"
                  placeholder="예시) 블루아카이브"
                  :rules="stringValidator(formData.name)" />
    </VForm>

    <VAlert v-if="typeof updateErrorCode === 'number'" type="error">
      <span v-if="updateErrorCode === ErrorCodes.ENTITY_DUPLICATED">같은 이름의 카테고리가 이미 존재합니다.</span>
      <span v-else>오류가 발생했습니다. ({{ updateErrorCode }})</span>
    </VAlert>
  </CommonDialog>

  <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                             @primary="() => { open = false; }" />
  <ItemDeleteWarningDialog   v-model="deleteWarningDialogShown"
                             @primary="onDeleteConfirm" />
</template>

<script lang="ts">
import { ErrorCodes, type IGoodsCategoryCreateRequest, type IGoodsCategoryUpdateRequest } from "@myboothmanager/common";
import { reactive } from "vue";
import { Vue, Component, Model, Prop, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";

@Component({
  components: {
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
  emits: ["error", "updated", "deleted"],
})
export default class GoodsCategoryManageDialog extends Vue {
  readonly ErrorCodes = ErrorCodes;

  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null }) categoryId!: number | null;

  readonly GOODS_CATEGORY_ADD_DEFAULT_DATA: Partial<IGoodsCategoryCreateRequest> = {
    boothId: useAdminStore().currentBoothId,
    name: "",
  };

  updateInProgress = false;
  formData: IGoodsCategoryCreateRequest | IGoodsCategoryUpdateRequest = reactive({ boothId: useAdminStore().currentBoothId });
  formValid = false;
  updateErrorCode: ErrorCodes | null = null;
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "굿즈 카테고리 수정" : "굿즈 카테고리 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : null,
    };
  }

  get isFormEdited(): boolean {
    let edited = false;

    if(this.categoryId && this.editMode) {
      const currentGoodsData = useAdminStore().boothGoodsCategoryList[Number(this.categoryId!)];

      if(currentGoodsData) {
        const formDataTyped = this.formData as IGoodsCategoryUpdateRequest;

        edited = Object.keys(this.formData).some((key) => {
          const k = key as keyof IGoodsCategoryUpdateRequest;
          return formDataTyped[k] !== currentGoodsData[k];
        });
      }
    } else {
      const formDataTyped = this.formData as IGoodsCategoryCreateRequest;

      edited = Object.keys(this.formData).some((key) => {
        const k = key as keyof IGoodsCategoryCreateRequest;
        return formDataTyped[k] !== this.GOODS_CATEGORY_ADD_DEFAULT_DATA[k];
      });
    }

    return edited;
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen() { this.resetForm(); }

  @Watch("formData", { deep: true })
  onFormDataUpdated() {
    this.updateErrorCode = null;
  }

  resetForm(): void {
    if(this.categoryId && this.editMode) {
      const goodsData = useAdminStore().boothGoodsCategoryList[Number(this.categoryId)];

      if(goodsData) {
        this.formData = reactive({
          name: goodsData.name,
        } as IGoodsCategoryUpdateRequest);
      }
    } else {
      this.formData = reactive({
        ...this.GOODS_CATEGORY_ADD_DEFAULT_DATA,
      } as IGoodsCategoryCreateRequest);
    }

    this.formData.boothId = useAdminStore().currentBoothId;
  }

  stringValidator(input?: string): Array<string | boolean> {
    const rules = [
      (!input || input.trim().length <= 0) ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
    ];

    return rules;
  }

  async onDialogConfirm() {
    let success = false;

    this.updateInProgress = true;

    let result: { id: number } | ErrorCodes;
    if(this.editMode) {
      const requestData: IGoodsCategoryUpdateRequest = {
        ...this.formData as IGoodsCategoryUpdateRequest,
        boothId: useAdminStore().currentBoothId,
        name: this.formData.name?.trim(),
      };
      result = await useAdminStore().updateGoodsCategoryInfo(Number(this.categoryId!), requestData);

      if(typeof result === "object" && "id" in result) {
        success = true;
      } else {
        this.updateErrorCode = result;
      }
    } else {
      const requestData: IGoodsCategoryCreateRequest = {
        ...this.formData as IGoodsCategoryCreateRequest,
        boothId: useAdminStore().currentBoothId,
        name: this.formData.name!.trim(),
      };
      result = await useAdminStore().createGoodsCategory(requestData);

      if(typeof result === "object" && "id" in result) {
        success = true;
      } else {
        this.updateErrorCode = result;
      }
    }

    this.updateInProgress = false;

    if(success && typeof result === "object" && "id" in result) {
      this.$emit("updated", result.id);
      this.open = false;
    } else {
      this.$emit("error");
    }
  }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.categoryId) {
      const response = await useAdminStore().deleteGoodsCategory(this.categoryId);

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      }
    }

    this.updateInProgress = false;
  }
}
</script>
