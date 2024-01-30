<template>
  <CommonDialog v-model="open"
                :width="editMode ? '800px' : '500px'"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                hideCloseButton
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogPrimaryText="dynString.primaryText"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogLeftButtonText="dynString.leftButtonText"
                @secondary="resetForm"
                @primary="onDialogConfirm"
                @cancel="onDialogCancel"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <CommonForm v-model="isFormValid"
                v-model:edited="isFormEdited"
                v-model:data="formModels"
                ref="form"
                class="flex-1-1"
                :initialModelValues="formModelsInitial"
                :fields="formFields" />
  </CommonDialog>

  <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                             @primary="() => { open = false; }" />
  <ItemDeleteWarningDialog   v-model="deleteWarningDialogShown"
                             @primary="onDeleteConfirm" />
</template>

<script lang="ts">
import { reactive, readonly } from "vue";
import deepClone from "clone-deep";
import { Vue, Component, Model, Watch, Prop, Ref } from "vue-facing-decorator";
import { type IBoothMember, type IBoothMemberAddRequest } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";

export type IBoothMemberManageFormField
  = Pick<IBoothMember, "name" | "descriptionShort" | "url" | "role" | "primaryColor">;

@Component({
  components: {
    CommonForm,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
  emits: ["added", "error"],
})
export default class BoothMemberManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: String, default: null }) boothMemberUuid!: string | null;

  @Ref("form") readonly form!: CommonForm;

  readonly formModels: IBoothMemberManageFormField = reactive({
    name: "",
    descriptionShort: "",
    url: "",
    role: "",
    primaryColor: "#000000",
  });
  readonly formFields = readonly({
    name: {
      type: FormFieldType.TEXT,
      label: "멤버 이름 (닉네임)",
      placeholder: "김뫄뫄",
    },
    descriptionShort: {
      type: FormFieldType.TEXT,
      optional: true,
      label: "멤버 설명",
      placeholder: "어썸한 멤버에용",
    },
    url: {
      type: FormFieldType.TEXT,
      optional: true,
      label: "대표 URL",
      placeholder: "https://twitter.com/nasa",
      rules: [
        (input: string) =>
          input.length <= 0 || input.match(/^(https?:\/\/)(.+\..+)/) ? true : "URL 형식이 올바르지 않습니다.",
      ],
    },
    // primaryColor: {
    //   type: FormFieldType.COLOR,
    //   label: "대표 색상",
    // },
    role: {
      type: FormFieldType.TEXT,
      optional: true,
      label: "멤버 역할 (또는 참여 형태)",
      placeholder: "부스장, 위탁 등...",
    },
  } as Record<keyof IBoothMemberManageFormField, FormFieldOptions> | Record<string, FormFieldOptions>);
  formModelsInitial: IBoothMemberManageFormField = deepClone(this.formModels);

  cancelWarningDialogShown = false;
  deleteWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = true;
  updateInProgress = false;

  get dynString() {
    return {
      title: this.editMode ? "부스 멤버 수정" : "부스 멤버 추가",
      primaryText: this.editMode ? "수정" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
      leftButtonText: this.editMode ? "삭제" : undefined,
    };
  }

  @Watch("open") mounted() {
    if(this.editMode && this.boothMemberUuid) {
      const member = useAdminStore().boothList[useAdminStore().currentBoothId].members.find(
        (member) => member.uuid === this.boothMemberUuid,
      );

      if(member) {
        this.formModels.name = member.name;
        this.formModels.descriptionShort = member.descriptionShort;
        this.formModels.url = member.url;
        this.formModels.role = member.role;
        this.formModels.primaryColor = member.primaryColor;

        this.formModelsInitial = deepClone(this.formModels);
      }
    } else {
      this.formModels.name = "";
      this.formModels.descriptionShort = "";
      this.formModels.url = "";
      this.formModels.role = "";
      this.formModels.primaryColor = "#000000";

      this.formModelsInitial = deepClone(this.formModels);
    }

    this.resetForm();
  }

  resetForm() { if(this.form) this.form.reset(); }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm() {
    this.updateInProgress = true;

    const requestData: IBoothMemberAddRequest = {
      boothId: useAdminStore().currentBoothId,
      name: this.formModels.name,
      descriptionShort: this.formModels.descriptionShort,
      url: this.formModels.url,
      role: this.formModels.role,
      primaryColor: this.formModels.primaryColor,
    };
    const result = await useAdminStore().addBoothMember(requestData);

    if(result === true) {
      this.$emit("updated");
      this.open = false;
    } else {
      this.$emit("error");
      alert("오류 " + result);
    }

    this.updateInProgress = false;
  }

  async onDeleteConfirm() {
    this.updateInProgress = true;

    if(this.boothMemberUuid) {
      const response = await useAdminStore().deleteBoothMember(this.boothMemberUuid);

      if(typeof response === "boolean" && response === true) {
        this.$emit("deleted");
        this.open = false;
      } else {
        this.$emit("error");
        alert("오류 " + response);
      }
    }

    this.updateInProgress = false;
  }
}
</script>
