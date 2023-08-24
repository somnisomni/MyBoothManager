<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                dialogTitle="부스 정보 수정"
                dialogCancelText="취소"
                dialogSecondaryText="되돌리기"
                dialogPrimaryText="업데이트"
                :onDialogCancel="onEditDialogCancel"
                :onDialogSecondary="resetForm"
                :onDialogPrimary="onEditDialogConfirm"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !editFormValid"
                :closeOnCancel="false">
    <VForm v-model="editFormValid">
      <VTextField v-model="editFormData.name"
                  class="my-1"
                  density="compact"
                  label="부스명"
                  :rules="stringValidator(editFormData.name!)" />
      <VTextField v-model="editFormData.description"
                  class="my-1"
                  density="compact"
                  label="부스 한 줄 설명"
                  :rules="stringValidator(editFormData.description!)" />
      <VSelect v-model="editFormData.currencySymbol"
                class="my-1"
                density="compact"
                :items="currencySymbols"
                item-title="name"
                item-value="symbol"
                label="통화 기호"
                hint="굿즈 가격에 표시될 통화(화폐) 기호입니다. 통화 기호를 변경하면 기존에 등록한 굿즈의 가격이 초기화되거나 자동으로 변환되지 않습니다. 변경에 주의하세요!"
                persistent-hint />
    </VForm>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               :closeCallback="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { reactive } from "vue";
import { Vue, Component, Model, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import currencySymbolInfo from "@/data/currency-symbol";
import CommonDialog from "@/components/common/CommonDialog.vue";
import FormDataLossWarningDialog from "../common/FormDataLossWarningDialog.vue";
import type { IBooth } from "myboothmanager-common/interfaces";

@Component({
  components: {
    CommonDialog,
    FormDataLossWarningDialog,
  },
})
export default class BoothInfoEditDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  updateInProgress = false;
  editFormData: Partial<IBooth> = reactive({});
  editFormValid = false;
  cancelWarningDialogShown = false;

  get currencySymbols(): Array<Record<string, string>> {
    const symbols = [];

    for(const symbol in currencySymbolInfo) {
      symbols.push({
        name: `${currencySymbolInfo[symbol].name} (${currencySymbolInfo[symbol].symbol})`,
        symbol: currencySymbolInfo[symbol].symbol,
      });
    }

    return symbols;
  }

  get isFormEdited(): boolean {
    const currentBoothData = useAdminStore().boothList[useAdminStore().currentBoothId];
    let edited = false;

    for(const key in this.editFormData) {
      const k = key as keyof IBooth;

      if(this.editFormData[k] !== currentBoothData[k]) {
        edited = true;
        break;
      }
    }

    return edited;
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    const boothData = useAdminStore().boothList[useAdminStore().currentBoothId];

    this.editFormData = reactive({
      name: boothData.name,
      description: boothData.description,
      currencySymbol: boothData.currencySymbol,
    });
  }

  stringValidator(input: string): Array<string | boolean> {
    const rules = [
      input.trim().length <= 0 ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
    ];

    return rules;
  }

  onEditDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  onEditDialogConfirm() {
    // TODO: Replace real API call. Below is a mock.

    this.updateInProgress = true;
    setTimeout(() => {
      Object.assign(useAdminStore().boothList[useAdminStore().currentBoothId], {
        ...this.editFormData,
        name: this.editFormData.name?.trim(),
        description: this.editFormData.description?.trim(),
      });

      this.updateInProgress = false;
      this.open = false;
    }, 1000);
  }
}
</script>
