<template>
  <CommonDialog v-model="open"
                width="500px"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="isFormEdited || updateInProgress"
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
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column flex-md-row">
      <CommonForm v-model="isFormValid"
                  v-model:edited="isFormEdited"
                  v-model:data="formModels"
                  ref="form"
                  class="flex-1-1"
                  :fields="formFields"
                  :disabled="updateInProgress" />
    </VLayout>

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
import { Vue, Component, Model, Prop, Watch, Ref } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { CommonForm, FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
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
  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;
  @Prop({ type: Number, default: null }) readonly categoryId!: number | null;

  @Ref("form") readonly form?: CommonForm;

  readonly formModels: IGoodsCategoryCreateRequest = reactive({
    boothId: -1,
    name: "",
  });

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "굿즈 카테고리 이름",
      placeholder: "장르명, 단일 장르 부스인 경우 굿즈 종류명 등",
    },
  } as Record<keyof IGoodsCategoryCreateRequest, FormFieldOptions> | Record<string, FormFieldOptions>;

  updateErrorCode: ErrorCodes | null = null;
  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "굿즈 카테고리 수정" : "굿즈 카테고리 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : null,
    };
  }

  @Watch("open")
  async onDialogOpen(open: boolean) {
    if(!open) return;

    while(!this.form) await this.$nextTick();

    this.formModels.boothId = useAdminStore().currentBooth.booth!.id;

    if(this.categoryId && this.editMode) {
      const categoryData = useAdminStore().currentBooth.goodsCategories![Number(this.categoryId)];

      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        name: categoryData.name,
      } as IGoodsCategoryUpdateRequest);
    } else {
      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        name: "",
      } as IGoodsCategoryCreateRequest);
    }
  }

  @Watch("formData", { deep: true })
  onFormDataUpdated() {
    this.updateErrorCode = null;
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

    let result: { id: number } | ErrorCodes = ErrorCodes.SUCCESS;

    if(this.editMode && this.categoryId) {
      // UPDATE

      const requestData: IGoodsCategoryUpdateRequest = {
        ...this.form!.getDiffOfModel(),
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().updateGoodsCategoryInfo(Number(this.categoryId!), requestData);
    } else {
      // CREATE

      const requestData: IGoodsCategoryCreateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().createGoodsCategory(requestData);
    }

    if(typeof result === "object") {
      this.updateErrorCode = null;
      this.$emit("updated", result.id);
      this.open = false;
    } else {
      this.updateErrorCode = result;
      this.$emit("error");
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.categoryId) {
      const response = await useAdminAPIStore().deleteGoodsCategory(this.categoryId);

      if(response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        this.updateErrorCode = response;
        this.$emit("error");
      }
    }

    this.updateInProgress = false;
  }
}
</script>
