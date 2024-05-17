<template>
  <div>
    <CommonForm v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                ref="form"
                :fields="formFields"
                :disabled="createInProgress" />

    <VBtn :loading="createInProgress"
          :disabled="createInProgress"
          @click="createAccount">생성</VBtn>
  </div>
</template>

<script lang="ts">
import type { IAccountCreateRequest } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { reactive } from "vue";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "@/plugins/stores/admin";
import CommonForm, { type FormFieldOptions, FormFieldType } from "../../../components/common/CommonForm.vue";

@Component({
  components: {
    CommonForm,
  },
})
export default class SACreateAccountFragment extends Vue {
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
      label: "새 계정 ID",
    },
    loginPass: {
      type: FormFieldType.PASSWORD,
      label: "새 계정 비밀번호",
    },
  } as Record<keyof IAccountCreateRequest, FormFieldOptions>;

  async createAccount() {
    this.createInProgress = true;

    if(!this.formModels.loginId || !this.formModels.loginPass || !this.formModels.name) {
      alert("계정 생성 데이터 일부분 누락");
    } else {
      const res = await AdminAPI.createAccount(useAdminStore().currentAccount!, this.formModels);
      if(typeof res !== "string") {
        alert("계정 생성 성공");
      } else {
        alert("계정 생성 실패: " + res);
      }
    }

    this.createInProgress = false;
  }
}
</script>
