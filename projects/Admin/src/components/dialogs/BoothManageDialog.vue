<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogPrimaryText="dynString.primaryText"
                :dialogLeftButtonText="dynString.leftButtonText"
                @cancel="onDialogCancel"
                @secondary="resetForm"
                @primary="onDialogConfirm"
                @leftbutton="onDialogDeleteClick"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !formValid"
                :closeOnCancel="false">
    <VForm v-model="formValid" @submit.prevent>
      <VTextField v-model="formData.name"
                  class="my-1"
                  density="compact"
                  label="부스명"
                  placeholder="예시) 없을 거 빼곤 다 있는 부스"
                  :rules="stringValidator(formData.name!)" />
      <VTextField v-model="formData.description"
                  class="my-1"
                  density="compact"
                  label="부스 한 줄 설명"
                  placeholder="예시) 이번 달 구독비는 굿즈 구매로 납부받습니다"
                  :rules="stringValidator(formData.description!)" />
      <VTextField v-model="formData.location"
                  class="my-1"
                  density="compact"
                  label="부스 위치"
                  placeholder="예시) 일산 킨텍스 5관 / 키보토스존 Kg99"
                  :rules="stringValidator(formData.location!)" />
      <VSelect v-model="formData.currencySymbol"
               class="my-1"
               density="compact"
               :items="currencySymbols"
               item-title="name"
               item-value="symbol"
               label="통화 기호"
               hint="굿즈 가격에 표시될 통화(화폐) 기호입니다. 통화 기호를 변경하면 기존에 등록한 굿즈의 가격이 초기화되거나 자동으로 변환되지 않습니다. 변경에 주의하세요!"
               persistent-hint />
      <VDatePicker v-model="formData.dateOpen"
                   :min="new Date()"
                   hide-header />
      <VDatePicker v-model="formData.dateClose"
                   :min="new Date()"
                   hide-header />
    </VForm>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { reactive } from "vue";
import { Vue, Component, Model, Watch, Prop } from "vue-facing-decorator";
import { currencySymbolInfo, type IBoothCreateRequest, type IBoothUpdateRequest } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

const BOOTH_ADD_DEFAULT_DATA: IBoothCreateRequest = {
  name: "",
  description: "",
  location: "",
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

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "부스 정보 수정" : "부스 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : null,
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
      // const currentBoothData = useAdminStore().boothList[useAdminStore().currentBoothId];
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

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    if(this.editMode) {
      const boothData = useAdminStore().boothList[useAdminStore().currentBoothId];

      this.formData = reactive({
        name: boothData.name,
        location: boothData.location,
        description: boothData.description,
        currencySymbol: boothData.currencySymbol,
        dateOpen: new Date(boothData.dateOpen),
        dateClose: new Date(boothData.dateClose),
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
      const result = await useAdminStore().updateCurrentBoothInfo(requestData as IBoothUpdateRequest);

      if(result === true) {
        success = true;
      } else {
        errorMsg = `오류 (${result})`;
      }
    } else {
      const result = await useAdminStore().createBooth(requestData as IBoothCreateRequest);

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

  onDialogDeleteClick() {
    alert("기능 추가 예정");
  }
}
</script>
