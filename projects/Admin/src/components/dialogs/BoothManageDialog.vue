<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogPrimaryText="dynString.primaryText"
                @cancel="onDialogCancel"
                @secondary="resetForm"
                @primary="onDialogConfirm"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !formValid"
                :closeOnCancel="false">
    <VForm v-model="formValid" @submit.prevent>
      <VTextField v-model.trim="formData.name"
                  class="my-1"
                  density="compact"
                  label="부스명 *"
                  placeholder="예시) 없을 거 빼곤 다 있는 부스"
                  :rules="stringValidator(formData.name!)" />
      <VTextField v-model.trim="formData.description"
                  class="my-1"
                  density="compact"
                  label="부스 한 줄 설명"
                  placeholder="예시) 이번 달 구독비는 굿즈 구매로 납부받습니다" />
      <VLayout class="d-flex flex-row">
        <VTextField v-model.trim="formData.location"
                    class="my-1"
                    density="compact"
                    label="부스 위치 *"
                    placeholder="예시) 일산 킨텍스 5관 / 키보토스존"
                    :rules="stringValidator(formData.location!)" />
        <VTextField v-model.trim="formData.boothNumber"
                    class="flex-0-0 my-1 ml-2"
                    style="width: 200px"
                    density="compact"
                    label="부스 번호"
                    placeholder="Kg99"
                    hint="부스 공개 페이지에서 부스 번호가 강조 표시됩니다."
                    persistent-hint />
      </VLayout>
      <VSelect v-model="formData.currencySymbol"
               class="my-1 mb-4"
               density="compact"
               :items="currencySymbols"
               item-title="name"
               item-value="symbol"
               label="통화 기호 *"
               hint="굿즈 가격에 표시될 통화(화폐) 기호입니다. 통화 기호를 변경하면 기존에 등록한 굿즈의 가격이 초기화되거나 자동으로 변환되지 않습니다. 변경에 주의하세요!"
               persistent-hint />
      <VLayout class="d-flex flex-row">
        <VTextField v-model="formDateOpenModel"
                    class="my-1 pr-2"
                    type="date"
                    label="운영 시작 일자 *"
                    density="compact"
                    :min="today"
                    :rules="[() => formData.dateOpen! <= formData.dateClose! ? true : '운영 종료 일자 이전으로 지정해야 합니다.']" />
        <span class="pa-2 text-h5">~</span>
        <VTextField v-model="formDateCloseModel"
                    class="my-1 pl-2"
                    type="date"
                    label="운영 종료 일자 *"
                    density="compact"
                    :min="today"
                    :rules="[() => formData.dateClose! >= formData.dateOpen! ? true : '운영 시작 일자 이후로 지정해야 합니다.']" />
      </VLayout>

    </VForm>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { reactive } from "vue";
import { Vue, Component, Model, Watch, Prop } from "vue-facing-decorator";
import { useDate } from "vuetify";
import { currencySymbolInfo, type IBoothCreateRequest, type IBoothUpdateRequest } from "@myboothmanager/common";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

const BOOTH_ADD_DEFAULT_DATA: IBoothCreateRequest = {
  name: "",
  description: "",
  location: "",
  boothNumber: "",
  currencySymbol: "₩",
  dateOpen: new Date(),
  dateClose: new Date(),
};

@Component({
  components: {
    FormDataLossWarningDialog,
  },
  emits: ["updated", "error"],
})
export default class BoothManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;

  updateInProgress = false;
  formData: IBoothUpdateRequest | IBoothCreateRequest = reactive({});
  formValid = false;
  cancelWarningDialogShown = false;

  get today(): string {
    const today = new Date();
    return useDate().toISO(today);
  }

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "부스 정보 수정" : "부스 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
    };
  }

  get currencySymbols(): Array<Record<string, string>> {
    return Object.keys(currencySymbolInfo).map((key) => ({
      ...currencySymbolInfo[key],
      name: `${currencySymbolInfo[key].name} (${currencySymbolInfo[key].symbol})`,
    }));
  }

  get isFormEdited(): boolean {
    let edited = false;

    if(this.editMode) {
      // const currentBoothData = useAdminStore().currentBooth.booth!;
      // edited = Object.keys(this.formData).some((key) => {
      //   const k = key as keyof IBoothUpdateRequest;
      //   return this.formData[k] !== currentBoothData[k];
      // });

      /* *** FIXME: Need to find more robust way for checking whether the form is edited *** */
      return true;
    } else {
      edited = Object.keys(this.formData).some((key) => {
        const k = key as keyof IBoothCreateRequest;
        return this.formData[k] !== BOOTH_ADD_DEFAULT_DATA[k];
      });
    }

    return edited;
  }

  get formDateOpenModel(): string | undefined { return useDate().toISO(this.formData.dateOpen); }
  get formDateCloseModel(): string | undefined { return useDate().toISO(this.formData.dateClose); }
  set formDateOpenModel(value: string) { this.formData.dateOpen = new Date(value); }
  set formDateCloseModel(value: string) { this.formData.dateClose = new Date(value); }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    if(this.editMode) {
      const boothData = useAdminStore().currentBooth.booth!;

      this.formData = reactive({
        ...boothData,
        dateOpen: new Date(boothData.dateOpen!),
        dateClose: new Date(boothData.dateClose!),
      } as IBoothUpdateRequest);
    } else {
      this.formData = reactive({
        ...BOOTH_ADD_DEFAULT_DATA,
      } as IBoothCreateRequest);
    }
  }

  stringValidator(input: string): Array<string | boolean> {
    const rules = [
      (!input || input.trim().length <= 0) ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
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

    const requestData: IBoothUpdateRequest | IBoothCreateRequest = {
      ...this.formData,
      name: this.formData.name?.trim(),
      description: this.formData.description?.trim(),
      location: this.formData.location?.trim(),
    };

    if(this.editMode) {
      const result = await useAdminAPIStore().updateCurrentBoothInfo(requestData as IBoothUpdateRequest);

      if(result === true) {
        success = true;
      } else {
        errorMsg = `오류 (${result})`;
      }
    } else {
      const result = await useAdminAPIStore().createBooth(requestData as IBoothCreateRequest);

      if(result === true) {
        success = true;
      } else {
        errorMsg = `오류 (${result})`;
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
}
</script>
