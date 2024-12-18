<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="isFormEdited || updateInProgress"
                fullscreenOnSmallScreen
                dialogTitle="피드백 작성"
                dialogCancelText="취소"
                dialogPrimaryText="전송"
                @primary="onDialogConfirm"
                @cancel="onDialogCancel"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column">
      <CommonForm v-model="isFormValid"
                  v-model:edited="isFormEdited"
                  v-model:data="formModels"
                  ref="form"
                  class="flex-1-1"
                  :fields="formFields"
                  :disabled="updateInProgress" />

      <p class="text-warning text-subtitle-2 mt-2">※ 피드백을 전송할 때 현재 로그인한 사용자의 고유 ID와 닉네임이 함께 전송됩니다. 이 기능을 상습적으로 오·남용하거나 피드백과 무관한 내용만 작성하여 전송할 경우 서비스 사용에 제한할 수 있습니다. "전송" 버튼을 누르는 동시에 이에 동의한 것으로 간주합니다.</p>
    </VLayout>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { FeedbackSenderType, FeedbackType, type IFeedbackRequest } from "@myboothmanager/common";
import { Component, Model, Ref, Vue, Watch } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { CommonForm, FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

@Component({
  components: {
    FormDataLossWarningDialog,
  },
})
export default class FeedbackDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  @Ref("form")
  declare readonly form?: CommonForm;

  cancelWarningDialogShown = false;
  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  readonly formModels: IFeedbackRequest = {
    senderId: useAdminStore().currentAccount!.id,
    senderName: useAdminStore().currentAccount!.name,
    senderType: FeedbackSenderType.BOOTH_ADMIN,
    type: FeedbackType.FEATURE_REQUEST,
    content: "",
  };

  readonly formFields = {
    senderName: {
      type: FormFieldType.TEXT,
      label: "작성자",
      disabled: true,
    },
    type: {
      type: FormFieldType.SELECT,
      label: "피드백 유형",
      get items() {
        return [
          { value: FeedbackType.FEATURE_REQUEST, text: "기능 제안" },
          { value: FeedbackType.FAIR_REQUEST, text: "행사 정보 등록 요청" },
          { value: FeedbackType.BUG_ISSUES, text: "버그 및 문제 보고" },
          { value: FeedbackType.OTHER, text: "기타" },
        ] as { value: FeedbackType; text: string }[];
      },
      itemTitle: "text",
      itemValue: "value",
    },
    content: {
      type: FormFieldType.TEXTAREA,
      label: "피드백 내용",
      autoGrow: true,
    },
  } as Record<keyof IFeedbackRequest, FormFieldOptions> | Record<string, FormFieldOptions>;

  @Watch("open")
  async onDialogOpen(open: boolean) {
    if(!open) return;

    while(!this.form) await this.$nextTick();

    this.form.setInitialModel(
      Object.assign(this.formModels, {
        senderId: useAdminStore().currentAccount!.id,
        senderName: useAdminStore().currentAccount!.name,
        senderType: FeedbackSenderType.BOOTH_ADMIN,
        type: FeedbackType.FEATURE_REQUEST,
        content: "",
      } as IFeedbackRequest));
  }

  async onDialogConfirm() {
    this.updateInProgress = true;

    const result = await useAdminAPIStore().sendFeedback(this.formModels);

    if(result) {
      this.open = false;
    }

    this.updateInProgress = false;
  }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }
}
</script>
