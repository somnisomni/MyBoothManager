<template>
  <div class="px-2 my-8">
    <h2>새 부스 관리 계정 생성</h2>

    <CommonForm v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                ref="form"
                :fields="formFields"
                :disabled="createInProgress" />

    <VBtn :loading="createInProgress"
          :disabled="!isFormValid || createInProgress"
          class="w-100"
          @click="createAccount">생성</VBtn>
  </div>
</template>

<script lang="ts">
import type { IAccountCreateRequest } from "@myboothmanager/common";
import type { SnackbarContextWrapper } from "@myboothmanager/common-ui";
import { Component, Ref, Setup, Vue } from "vue-facing-decorator";
import { reactive } from "vue";
import { CommonForm, type FormFieldOptions, FormFieldType } from "@/components/common/CommonForm.vue";
import { useAdminStore } from "@/plugins/stores/admin";
import { SuperAdminAPI } from "../SuperAdminPage.lib";

@Component({
  emits: ["created"],
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

  async mounted() {
    await this.$nextTick();

    this.form.setInitialModel({
      loginId: "",
      loginPass: "",
      name: "",
    } as IAccountCreateRequest);
  }

  async createAccount() {
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
        this.$emit("created");
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
