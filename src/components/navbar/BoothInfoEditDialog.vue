<template>
  <VDialog v-model="open"
           persistent
           width="700"
           max-width="100%"
           class="booth-info-edit-dialog">
    <VCard :loading="updateInProgress">
      <template v-slot:loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         indeterminate
                         color="primary"
                         height="4" />
      </template>

      <VCardTitle>부스 정보 수정</VCardTitle>

      <VDivider />

      <VCardText>
        <VForm v-model="editFormValid">
          <VTextField v-model="editFormData.name"
                      class="my-1"
                      density="compact"
                      label="부스명"
                      :rules="stringValidator(editFormData.name!)" />
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
      </VCardText>

      <VDivider />

      <!-- Dialog action -->
      <VCardActions>
        <VSpacer />
        <VBtn :disabled="updateInProgress" text @click="onDialogCancel">취소</VBtn>
        <VBtn :disabled="updateInProgress || !editFormValid" color="primary" text @click="onDialogConfirm">수정하기</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { reactive } from "vue";
import { Vue, Component, Model } from "vue-facing-decorator";
import type { BoothData } from "@/types/booth";
import { useAdminStore } from "@/stores/admin";
import currencySymbolInfo from "@/data/currency-symbol";

@Component({})
export default class BoothInfoEditDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  updateInProgress = false;
  editFormData!: Partial<BoothData>;
  editFormValid = false;

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

  mounted() {
    const boothData = useAdminStore().boothList[useAdminStore().currentBoothId];

    this.editFormData = reactive({
      name: boothData.name,
      currencySymbol: boothData.currencySymbol,
    });
  }

  stringValidator(input: string): Array<string | boolean> {
    const rules = [
      input.trim().length <= 0 ? "입력한 내용이 없거나 공백으로만 이루어질 수 없습니다." : true,
    ];

    return rules;
  }

  onDialogCancel() {
    this.open = false;
  }

  onDialogConfirm() {
    // TODO: Replace real API call. Below is a mock.

    this.updateInProgress = true;
    setTimeout(() => {
      Object.assign(useAdminStore().boothList[useAdminStore().currentBoothId], {
        ...this.editFormData,
        name: this.editFormData.name?.trim(),
      });

      this.updateInProgress = false;
      this.open = false;
    }, 1000);
  }
}
</script>
