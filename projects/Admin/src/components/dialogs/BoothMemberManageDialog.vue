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
                @primary="onDialogConfirm"
                @secondary="form?.reset"
                @cancel="onDialogCancel"
                @leftbutton="() => { deleteWarningDialogShown = true; }"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column flex-md-row">
      <ImageWithUpload v-if="editMode"
                       class="flex-0-1 mr-4 align-self-center"
                       :existingSrc="avatarImagePath"
                       contextName="멤버"
                       width="200px"
                       height="200px"
                       aspectRatio="1/1"
                       hideSubtitle
                       controlsColumn
                       :uploadCallback="memberImageUploadCallback"
                       :deleteCallback="memberImageDeleteCallback" />

      <CommonForm v-model="isFormValid"
                  v-model:edited="isFormEdited"
                  v-model:data="formModels"
                  ref="form"
                  class="flex-1-1"
                  :fields="formFields"
                  :disabled="updateInProgress" />
    </VLayout>
  </CommonDialog>

  <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                             @primary="() => { open = false; }" />
  <ItemDeleteWarningDialog   v-model="deleteWarningDialogShown"
                             @primary="onDeleteConfirm" />
</template>

<script lang="ts">
import { reactive, readonly } from "vue";
import { Vue, Component, Model, Watch, Prop, Ref } from "vue-facing-decorator";
import { ErrorCodes, type IBoothMember, type IBoothMemberCreateRequest, type IBoothMemberUpdateRequest } from "@myboothmanager/common";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import ImageWithUpload from "../common/ImageWithUpload.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";
import ItemDeleteWarningDialog from "./common/ItemDeleteWarningDialog.vue";

@Component({
  components: {
    ImageWithUpload,
    CommonForm,
    FormDataLossWarningDialog,
    ItemDeleteWarningDialog,
  },
  emits: ["updated", "deleted", "error"],
})
export default class BoothMemberManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) editMode!: boolean;
  @Prop({ type: Number, default: null }) boothMemberId!: number | null;

  @Ref("form") readonly form?: CommonForm;

  readonly formModels: IBoothMemberCreateRequest = reactive({
    boothId: -1,
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
  } as Record<keyof IBoothMemberCreateRequest, FormFieldOptions> | Record<string, FormFieldOptions>);

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

  get currentMember(): IBoothMember | null {
    return (this.boothMemberId && (this.boothMemberId in useAdminStore().currentBooth.boothMembers!)) ? readonly(useAdminStore().currentBooth.boothMembers![this.boothMemberId]) : null;
  }

  get avatarImagePath(): string | null {
    return this.editMode && this.currentMember ? this.currentMember.avatarImage?.path ?? null : null;
  }

  @Watch("open")
  async onDialogOpen(open: boolean) {
    if(!open) return;

    while(!this.form) await this.$nextTick();

    if(this.editMode && this.currentMember) {
      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        name: this.currentMember.name,
        descriptionShort: this.currentMember.descriptionShort,
        url: this.currentMember.url,
        role: this.currentMember.role,
        primaryColor: this.currentMember.primaryColor,
      } as IBoothMemberUpdateRequest);
    } else {
      this.form.setInitialModel({
        boothId: useAdminStore().currentBooth.booth!.id,
        name: "",
        descriptionShort: "",
        url: "",
        role: "",
        primaryColor: "#000000",
      } as IBoothMemberCreateRequest);
    }
  }

  onDialogCancel() {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm() {
    this.updateInProgress = true;

    let result: boolean | ErrorCodes = false;

    if(this.editMode && this.boothMemberId) {
      // UPDATE

      const requestData: IBoothMemberUpdateRequest = {
        ...this.form!.getDiffOfModel(),
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().updateBoothMemberInfo(this.boothMemberId, requestData);
    } else {
      // CREATE

      const requestData: IBoothMemberCreateRequest = {
        ...this.formModels,
        boothId: useAdminStore().currentBooth.booth!.id,
      };

      result = await useAdminAPIStore().createBoothMember(requestData);
    }

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

    if(this.boothMemberId) {
      const response = await useAdminAPIStore().deleteBoothMember(this.boothMemberId);

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

  async memberImageUploadCallback(file: File | Blob | null) {
    return await useAdminAPIStore().uploadBoothMemberImage(this.boothMemberId!, file!);
  }

  async memberImageDeleteCallback() {
    return await useAdminAPIStore().deleteBoothMemberImage(this.boothMemberId!);
  }
}
</script>
