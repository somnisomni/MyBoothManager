<template>
  <div class="px-2 my-8">
    <h2>새 부스 관리 계정 생성</h2>

    <CommonForm ref="form"
                v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                :fields="formFields"
                :disabled="createInProgress" />

    <VBtn :loading="createInProgress"
          :disabled="!isFormValid || createInProgress"
          class="w-100"
          @click="createAccount">
      <span>생성</span>
    </VBtn>
  </div>
</template>

<script lang="ts">
import type { FormFieldOptions } from "@/components/common/CommonForm.vue";
import type { IAccountCreateRequest } from "@myboothmanager/common";
import type { SnackbarContextWrapper } from "@myboothmanager/common-ui";
import { reactive } from "vue";
import { Component, Ref, Setup, Vue } from "vue-facing-decorator";
import { CommonForm, FormFieldType } from "@/components/common/CommonForm.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { SuperAdminAPI } from "../SuperAdminPage.lib";

@Component({
  components: {
    CommonForm,
  },
})
export default class SACreateAccountFragment extends Vue {
  @Setup(() => useAdminStore().globalSnackbarContexts)
  declare readonly globalSnackbarContexts: SnackbarContextWrapper;

  @Ref("form")
  declare readonly form: CommonForm;

  isFormValid = false;
  isFormEdited = false;
  createInProgress = false;

  readonly formModels: IAccountCreateRequest = reactive({
    loginId: "",
    loginPass: "",
    name: "",
  });

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "새 계정 이름 (닉네임)",
    },
    loginId: {
      type: FormFieldType.TEXT,
      label: "새 계정 로그인 ID",
    },
    loginPass: {
      type: FormFieldType.PASSWORD,
      label: "새 계정 비밀번호",
    },
  } as Record<keyof IAccountCreateRequest, FormFieldOptions>;

  async createAccount(): Promise<void> {
    this.createInProgress = true;

    if(!this.formModels.loginId || !this.formModels.loginPass || !this.formModels.name) {
      this.globalSnackbarContexts.add({
        type: "warning",
        text: "계정 생성 데이터 일부분 누락",
      });
    } else {
      const res = await SuperAdminAPI.createAccount(this.formModels);

      if(typeof res === "object") {
        this.globalSnackbarContexts.add({
          type: "success",
          text: `계정 생성 성공 (ID: ${res.id})`,
        });
        this.form.reset();
      } else {
        this.globalSnackbarContexts.add({
          type: "error",
          text: `계정 생성 실패: ${res}`,
        });
      }
    }

    this.createInProgress = false;
  }
}
</script>
