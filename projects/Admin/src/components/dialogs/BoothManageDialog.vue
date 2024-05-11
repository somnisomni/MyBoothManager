<template>
  <CommonDialog v-model="open"
                width="500px"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="isFormEdited || updateInProgress"
                fullscreenOnSmallScreen
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogPrimaryText="dynString.primaryText"
                @primary="onDialogConfirm"
                @secondary="resetForm"
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
                  :initialModelValues="formModelsInitial"
                  :fields="formFields" />
    </VLayout>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { Vue, Component, Model, Watch, Prop, Ref } from "vue-facing-decorator";
import { ErrorCodes, currencySymbolInfo, type IBoothCreateRequest, type IBoothUpdateRequest } from "@myboothmanager/common";
import deepClone from "clone-deep";
import { diff } from "deep-object-diff";
import moment from "moment";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

interface IBoothCreateRequestInternal extends Omit<IBoothCreateRequest, "dateOpen" | "dateClose"> {
  dateOpen?: string,
  dateClose?: string,
}

const momentFormat = (date: Date) => moment(date).format("YYYY-MM-DD");

const editModeProxied = ref(false);
const dateOpenProxied = ref(new Date());
const dateCloseProxied = ref(new Date());

@Component({
  components: {
    CommonForm,
    FormDataLossWarningDialog,
  },
  emits: ["updated", "error"],
})
export default class BoothManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;

  @Ref("form") readonly form!: CommonForm;

  readonly formModels: IBoothCreateRequestInternal = reactive({
    name: "",
    description: "",
    location: "",
    boothNumber: "",
    currencySymbol: "₩",

    get dateOpen(): string { return momentFormat(new Date(dateOpenProxied.value)); },
    set dateOpen(value: string) { dateOpenProxied.value = new Date(value); },

    get dateClose(): string { return momentFormat(dateCloseProxied.value); },
    set dateClose(value: string) { dateCloseProxied.value = new Date(value); },
  });

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "부스 이름",
      placeholder: "예시) 없을 거 빼곤 다 있는 부스",
    },
    description: {
      type: FormFieldType.TEXT,
      label: "부스 한 줄 설명",
      placeholder: "예시) 만들고 싶은걸 만들어요",
      optional: true,
    },
    location: {
      type: FormFieldType.TEXT,
      label: "부스 위치",
      placeholder: "예시) 일산 킨텍스 5관",
    },
    boothNumber: {
      type: FormFieldType.TEXT,
      label: "부스 번호",
      placeholder: "A12 ~ 13",
      hint: "부스 공개 페이지에서 부스 번호가 강조 표시됩니다.",
      persistentHint: true,
      optional: true,
    },
    currencySymbol: {
      type: FormFieldType.SELECT,
      label: "통화 기호",
      get items() {
        return Object.keys(currencySymbolInfo).map((key) => ({
          ...currencySymbolInfo[key],
          name: `${currencySymbolInfo[key].name} (${currencySymbolInfo[key].symbol})`,
        }));
      },
      itemTitle: "name",
      itemValue: "symbol",
      hint: "굿즈 가격에 표시될 통화(화폐) 기호입니다. 부스 생성 시에만 변경 가능하며, 이후에는 변경할 수 없습니다.",
      persistentHint: true,
      get disabled() { return editModeProxied.value; },
    },
    dateOpen: {
      type: FormFieldType.DATE,
      label: "운영 시작 일자",
      get min() { return momentFormat(new Date()); },
    },
    dateClose: {
      type: FormFieldType.DATE,
      label: "운영 종료 일자",
      get min() { return momentFormat(dateOpenProxied.value); },
      rules: [ ((v: string) => new Date(v) >= new Date(dateOpenProxied.value) ? true : "운영 종료 일자는 운영 시작 일자보다 빠를 수 없습니다.") ],
    },
  } as Record<keyof IBoothCreateRequestInternal, FormFieldOptions> | Record<string, FormFieldOptions>;
  formModelsInitial: IBoothCreateRequestInternal = deepClone(this.formModels);

  cancelWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "부스 정보 수정" : "부스 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
    };
  }

  @Watch("open") mounted() {
    editModeProxied.value = this.editMode;

    if(this.editMode) {
      const boothData = useAdminStore().currentBooth.booth!;

      this.formModels.name = boothData.name;
      this.formModels.description = boothData.description;
      this.formModels.location = boothData.location;
      this.formModels.boothNumber = boothData.boothNumber;
      this.formModels.currencySymbol = boothData.currencySymbol;
      this.formModels.dateOpen = boothData.dateOpen ? momentFormat(new Date(boothData.dateOpen)) : undefined;
      this.formModels.dateClose = boothData.dateClose ? momentFormat(new Date(boothData.dateClose)) : undefined;
    } else {
      this.formModels.name = "";
      this.formModels.description = "";
      this.formModels.location = "";
      this.formModels.boothNumber = "";
      this.formModels.currencySymbol = "₩";
      this.formModels.dateOpen = momentFormat(new Date());
      this.formModels.dateClose = momentFormat(new Date());
    }

    this.formModelsInitial = deepClone(this.formModels);
    this.resetForm();
  }

  resetForm() { if(this.form) this.form.reset(); }
  resetValidation() { if(this.form) this.form.resetValidation(); }

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

    if(this.editMode) {
      // UPDATE

      const requestData: IBoothUpdateRequest = {
        ...diff(this.formModelsInitial, this.formModels),
      };

      result = await useAdminAPIStore().updateCurrentBoothInfo(requestData as IBoothUpdateRequest);
    } else {
      // CREATE

      const requestData: IBoothCreateRequestInternal = {
        ...this.formModels,
      };

      result = await useAdminAPIStore().createBooth(requestData as IBoothCreateRequest);
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
}
</script>
