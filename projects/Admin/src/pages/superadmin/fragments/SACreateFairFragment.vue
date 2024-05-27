<template>
  <div class="px-2 my-8">
    <h2>새 행사 정보 생성</h2>

    <CommonForm v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                ref="form"
                :fields="formFields"
                :disabled="createInProgress" />

    <VBtn :loading="createInProgress"
          :disabled="!isFormValid || createInProgress"
          class="w-100"
          @click="createFair">생성</VBtn>
  </div>
</template>

<script lang="ts">
import type { IFairCreateRequest } from "@myboothmanager/common";
import type { SnackbarContextWrapper } from "@myboothmanager/common-ui";
import { reactive } from "vue";
import { Component, Ref, Setup, Vue } from "vue-facing-decorator";
import CommonForm, { FormFieldType, type FormFieldOptions } from "@/components/common/CommonForm.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { SuperAdminAPI } from "../SuperAdminPage.lib";

@Component({
  components: {
    CommonForm,
  },
})
export default class SACreateFairFragment extends Vue {
  @Setup(() => useAdminStore().globalSnackbarContexts)
  declare readonly globalSnackbarContexts: SnackbarContextWrapper;

  @Ref("form")
  declare readonly form: CommonForm;

  isFormValid = false;
  isFormEdited = false;
  createInProgress = false;

  readonly formModels: IFairCreateRequest = reactive({
    name: "",
    description: "",
    location: "",
    openingDates: [],
    websiteUrl: "",
  });

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "행사 이름",
    },
    description: {
      type: FormFieldType.TEXT,
      label: "행사 설명",
      optional: true,
    },
    location: {
      type: FormFieldType.TEXT,
      label: "행사 개최 장소",
    },
    openingDates: {
      type: FormFieldType.TEXT,
      label: "행사 개최 일자 목록",
      hint: "YYYY-MM-DD, YYYY-MM-DD, ...  (ISO 8601 형식 날짜를 쉼표(,)로 구분하여 입력)",
      persistentHint: true,
      rules: [(value: string) => (value.length > 0 && value.split(",").every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date.trim()))) || "YYYY-MM-DD, YYYY-MM-DD, ...  (ISO 8601 형식 날짜를 쉼표(,)로 구분하여 입력"],
    },
    websiteUrl: {
      type: FormFieldType.TEXT,
      label: "행사 메인 웹사이트 URL",
      optional: true,
    },
  } as Record<keyof IFairCreateRequest, FormFieldOptions>;

  async createFair() {
    this.createInProgress = true;

    const requestData: IFairCreateRequest = {
      ...this.formModels,
      openingDates: typeof this.formModels.openingDates === "string"
        ? (this.formModels.openingDates as string).split(",").map((date) => date.trim()) as unknown as Array<Date>
        : this.formModels.openingDates,
    };

    if(!this.formModels.name || !this.formModels.location || !this.formModels.openingDates) {
      this.globalSnackbarContexts.add({
        type: "warning",
        text: "행사 정보 생성 데이터 일부분 누락",
      });
    } else {
      const res = await SuperAdminAPI.createFair(requestData);

      if(typeof res === "object") {
        this.globalSnackbarContexts.add({
          type: "success",
          text: `행사 정보 생성 성공 (ID: ${res.id})`,
        });
        this.form.reset();
      } else {
        this.globalSnackbarContexts.add({
          type: "error",
          text: `행사 정보 생성 실패: ${res}`,
        });
      }
    }

    this.createInProgress = false;
  }
}
</script>
