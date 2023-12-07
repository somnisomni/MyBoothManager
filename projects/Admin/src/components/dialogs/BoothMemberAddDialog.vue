<template>
  <CommonDialog v-model="open"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="true"
                dialogTitle="부스 멤버 추가"
                dialogCancelText="취소"
                dialogSecondaryText="초기화"
                dialogPrimaryText="추가"
                @cancel="onDialogCancel"
                @secondary="resetForm"
                @primary="onDialogConfirm"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !formValid"
                :closeOnCancel="false">
    <VForm v-model="formValid" @submit.prevent>
      구현 예정
      <VBtn @click="onDialogConfirm">테스트 데이터 추가</VBtn>
    </VForm>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import { reactive } from "vue";
import { Vue, Component, Model, Watch } from "vue-facing-decorator";
import { type IBoothMemberAddRequest } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

const BOOTH_MEMBER_ADD_DEFAULT_DATA: IBoothMemberAddRequest = {
  boothId: -1,
  name: "",
  descriptionShort: "",
  url: "",
  role: "",
  primaryColor: "#000000",
};

@Component({
  components: {
    FormDataLossWarningDialog,
  },
  emits: ["added", "error"],
})
export default class BoothMemberAddDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  updateInProgress = false;
  formData: IBoothMemberAddRequest = reactive({
    ...BOOTH_MEMBER_ADD_DEFAULT_DATA,
    boothId: useAdminStore().currentBoothId,
  });
  formValid = false;
  cancelWarningDialogShown = false;

  get isFormEdited(): boolean {
    return Object.keys(this.formData).some((key) => {
      const k = key as keyof IBoothMemberAddRequest;
      return this.formData[k] !== BOOTH_MEMBER_ADD_DEFAULT_DATA[k];
    });
  }

  mounted() { this.resetForm(); }
  @Watch("open", { immediate: true }) onDialogOpen(watchValue: boolean) { if(watchValue) this.resetForm(); }

  resetForm() {
    this.formData = reactive({
      ...BOOTH_MEMBER_ADD_DEFAULT_DATA,
    });
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

    // const requestData: IBoothMemberAddRequest = {
    //   ...this.formData,
    //   name: this.formData.name.trim(),
    //   primaryColor: this.formData.primaryColor.trim(),
    //   role: this.formData.role.trim(),
    //   descriptionShort: this.formData.descriptionShort?.trim(),
    //   url: this.formData.url?.trim(),
    // };

    const requestData: IBoothMemberAddRequest = {
      ...this.formData,
      boothId: useAdminStore().currentBoothId,
      name: "테스트 멤버",
      primaryColor: "#123456",
      role: "허수아비",
      descriptionShort: "언제나 배고픈 멤버",
      url: "https://twitter.com/nasa",
    };

    const result = await useAdminStore().addBoothMember(requestData);

    if(result === true) {
      success = true;
    } else {
      errorMsg = `오류 (${result})`;
    }

    this.updateInProgress = false;

    if(success) {
      this.$emit("added");
      this.open = false;
    } else {
      this.$emit("error");

      // TODO: error dialog
      alert(errorMsg);
    }
  }
}
</script>
