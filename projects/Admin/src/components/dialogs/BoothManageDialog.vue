<template>
  <CommonDialog v-model="open"
                width="500px"
                :persistent="isFormEdited"
                :progressActive="updateInProgress"
                :hideCloseButton="isFormEdited || updateInProgress"
                fullscreenOnSmallScreen
                :dialogTitle="dynString.title"
                dialogCancelText="취소"
                :dialogSecondaryText="dynString.secondaryText"
                :dialogPrimaryText="dynString.primaryText"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false"
                @primary="onDialogConfirm"
                @secondary="form?.reset"
                @cancel="onDialogCancel">
    <VLayout class="d-flex flex-column flex-md-row">
      <div class="d-flex flex-column">
        <!-- Fair selection -->
        <VAutocomplete v-model.number="formModels.fairId"
                       :items="normalizedFairList"
                       itemTitle="name"
                       itemValue="id"
                       label="행사"
                       hint="부스 생성 시에만 지정 가능하며, 이후에는 변경할 수 없습니다."
                       persistentHint
                       :loading="isFairListLoading"
                       :disabled="isFairListLoading || editMode"
                       @update:modelValue="formModels.datesOpenInFair.splice(0, formModels.datesOpenInFair.length)">
          <template #item="{ props, item }">
            <VListItem v-bind="props">
              <VListItemSubtitle class="text-subtitle-2"
                                 style="font-size: 0.75em !important">
                <div>{{ item.raw.openingDates }} {{ item.raw.location ? `@ ${item.raw.location}` : undefined }}</div>
              </VListItemSubtitle>
            </VListItem>
          </template>
        </VAutocomplete>

        <!-- Form -->
        <CommonForm ref="form"
                    v-model="isFormValid"
                    v-model:edited="isFormEdited"
                    v-model:data="formModels"
                    class="flex-1-1"
                    :fields="formFields"
                    :disabled="updateInProgress" />
      </div>
    </VLayout>

    <FormDataLossWarningDialog v-model="cancelWarningDialogShown"
                               @primary="() => { open = false; }" />
  </CommonDialog>
</template>

<script lang="ts">
import type { FormFieldOptions } from "../common/CommonForm.vue";
import type { ErrorCodes, IBooth, IBoothCreateRequest, IBoothCreateWithFairRequest, IBoothUpdateRequest, IFairResponse } from "@myboothmanager/common";
import { CURRENCY_INFO, toDateRangeString } from "@myboothmanager/common";
import deepClone from "clone-deep";
import moment from "moment";
import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { Vue, Component, Model, Watch, Prop, Ref, Setup, toNative } from "vue-facing-decorator";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import { useLocalStore } from "@/plugins/stores/local";
import { CommonForm, FormFieldType } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

interface IBoothCreateRequestInternal extends Omit<IBoothCreateRequest, "dateOpen" | "dateClose">, Omit<IBoothCreateWithFairRequest, "datesOpenInFair"> {
  dateOpen?: string;
  dateClose?: string;
  datesOpenInFair: string[];
}

function momentFormat(date: Date): string {
  return moment(date).format("YYYY-MM-DD");
}

const useProxyStore = defineStore("BoothManageDialog__proxy", () => {
  const _fairId = ref<number | null>(null);
  const availableFairList = ref<IFairResponse[]>([]);
  const isCurrentBoothFairPassed = computed(() => useAdminStore().currentBooth.booth?.fair && (availableFairList.value.findIndex(fair => fair.id === useAdminStore().currentBooth.booth?.fair?.id) < 0));

  const formModels: IBoothCreateRequestInternal = reactive({
    name: "",
    description: "",
    location: "",
    boothNumber: "",
    currencyCode: "KRW",

    dateOpen: momentFormat(new Date()),
    dateClose: momentFormat(new Date()),
    datesOpenInFair: [],

    get fairId() { return _fairId.value; },
    set fairId(value: number | null) {
      _fairId.value = value;
      this.location = availableFairList.value.find(fair => fair.id === value)?.location ?? "";
    },
  });
  const editMode = ref(false);

  return {
    availableFairList,
    isCurrentBoothFairPassed,

    formModels,
    editMode,
  };
});

@Component({
  components: {
    CommonForm,
    FormDataLossWarningDialog,
  },
  emits: [ "updated", "error" ],
})
class BoothManageDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;

  @Ref("form")
  declare readonly form?: CommonForm;

  @Setup(() => useProxyStore().formModels)
  declare readonly formModels: IBoothCreateRequestInternal;

  isFairListLoading = true;

  readonly formFields = {
    name: {
      type: FormFieldType.TEXT,
      label: "부스 이름",
      placeholder: "예시) 없을 거 빼곤 다 있는 부스",
    },
    description: {
      type: FormFieldType.TEXT,
      label: "부스 한 줄 설명",
      placeholder: "예시) 만들고 싶은걸 만들어요",
      optional: true,
    },
    boothNumber: {
      type: FormFieldType.TEXT,
      label: "부스 번호",
      placeholder: "A12 ~ 13",
      hint: "부스 공개 페이지에서 부스 번호가 강조 표시됩니다.",
      persistentHint: true,
      optional: true,
    },
    currencyCode: {
      type: FormFieldType.SELECT,
      label: "통화 기호",
      get items() {
        return Object.values(CURRENCY_INFO).map((info) => {
          return {
            name: `${info.nameLocalized[useLocalStore().settings.language ?? "ko"]} (${info.symbol})`,
            code: info.code,
          };
        });
      },
      itemTitle: "name",
      itemValue: "code",
      hint: "굿즈 가격에 표시될 통화(화폐) 기호입니다. 부스 생성 시에만 변경 가능하며, 이후에는 변경할 수 없습니다.",
      persistentHint: true,
      get disabled() { return useProxyStore().editMode; },
    },

    /* Custom fair fields */
    location: {
      type: FormFieldType.TEXT,
      label: "부스 위치",
      placeholder: "예시) 일산 킨텍스 5관",
      get disabled() { return useProxyStore().formModels.fairId; },
    },
    dateOpen: {
      type: FormFieldType.DATE,
      label: "운영 시작 일자",
      get min() { return momentFormat(new Date()); },
      onChange: this.resetValidationProxy,
      get hide() { return useProxyStore().formModels.fairId; },
    },
    dateClose: {
      type: FormFieldType.DATE,
      label: "운영 종료 일자",
      get min() { return useProxyStore().formModels.dateOpen; },
      rules: [ (v: string) => new Date(v) >= new Date(useProxyStore().formModels.dateOpen as string) ? true : "운영 종료 일자는 운영 시작 일자보다 빠를 수 없습니다." ],
      onChange: this.resetValidationProxy,
      get hide() { return useProxyStore().formModels.fairId; },
    },

    /* Fair-associated fields */
    datesOpenInFair: {
      type: FormFieldType.SELECT,
      label: "운영 일자",
      get items() {
        const targetFair = useProxyStore().availableFairList.find(fair => fair.id === useProxyStore().formModels.fairId);
        return targetFair?.openingDates.map((date) => {
          return {
            title: new Date(date).toLocaleDateString(),
            value: momentFormat(date),
          };
        });
      },
      itemTitle: "title",
      itemValue: "value",
      multiple: true,
      get hide() { return !useProxyStore().formModels.fairId; },
      get disabled() { return useProxyStore().editMode && useProxyStore().isCurrentBoothFairPassed; },
    },
  } as Record<keyof IBoothCreateRequestInternal, FormFieldOptions> | Record<string, FormFieldOptions>;

  resetValidationProxy(): void { this.form?.resetValidation(); }

  cancelWarningDialogShown = false;

  isFormValid = false;
  isFormEdited = false;
  updateInProgress = false;

  get dynString(): Record<string, string | null> {
    return {
      title: this.editMode ? "부스 정보 수정" : "부스 추가",
      primaryText: this.editMode ? "업데이트" : "추가",
      secondaryText: this.editMode ? "되돌리기" : "초기화",
    };
  }

  get normalizedFairList(): Array<Record<string, unknown>> {
    return [
      // Placeholder fair data while loading fair list
      ...(this.editMode && (this.isFairListLoading || useProxyStore().isCurrentBoothFairPassed)
        ? [ {
          ...useAdminStore().currentBooth.booth?.fair,
        } ]
        : []),

      // Actual fair data fetched from API
      ...useProxyStore().availableFairList.map((fair) => {
        return {
          ...fair,
          openingDates: toDateRangeString(fair.openingDates),
        };
      }),

      // Custom fair
      {
        id: null,
        name: "(사용자 지정)",
      },
    ];
  }

  @Watch("open")
  async onDialogOpen(open: boolean): Promise<void> {
    useProxyStore().editMode = this.editMode;

    if(!open) {
      return;
    }

    while(!this.form) {
      await this.$nextTick();
    }

    if(this.editMode) {
      const boothData = useAdminStore().currentBooth.booth as IBooth;

      this.form.setInitialModel({
        fairId: boothData.fair?.id,
        name: boothData.name,
        description: boothData.description,
        location: boothData.fair?.location ?? boothData.location,
        boothNumber: boothData.boothNumber,
        currencyCode: boothData.currencyCode,
        dateOpen: boothData.dateOpen ? momentFormat(new Date(boothData.dateOpen)) : undefined,
        dateClose: boothData.dateClose ? momentFormat(new Date(boothData.dateClose)) : undefined,
        datesOpenInFair: deepClone(boothData.datesOpenInFair),
      } as IBoothUpdateRequest);
    } else {
      this.form.setInitialModel({
        fairId: null,
        name: "",
        description: "",
        location: "",
        boothNumber: "",
        currencyCode: "KRW",
        dateOpen: momentFormat(new Date()),
        dateClose: momentFormat(new Date()),
        datesOpenInFair: [],
      } as IBoothCreateRequestInternal);
    }

    if(this.isFairListLoading) {
      // No `await` here

      // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
      AdminAPI.fetchAvailableFairs().then((response) => {
        // eslint-disable-next-line promise/always-return
        if(typeof response === "object") {
          useProxyStore().availableFairList = response;
        }

        this.isFairListLoading = false;
      });
    }
  }

  onDialogCancel(): void {
    if(this.isFormEdited) {
      this.cancelWarningDialogShown = true;
    } else {
      this.open = false;
    }
  }

  async onDialogConfirm(): Promise<void> {
    this.updateInProgress = true;

    let result: boolean | ErrorCodes;

    if(this.editMode) {
      // UPDATE

      const requestData: IBoothUpdateRequest = {
        ...this.form?.getDiffOfModel(),
      };

      result = await useAdminAPIStore().updateCurrentBoothInfo(requestData as IBoothUpdateRequest);
    } else {
      // CREATE

      let requestData = {
        name: this.formModels.name,
        description: this.formModels.description,
        currencyCode: this.formModels.currencyCode,
        boothNumber: this.formModels.boothNumber,
      } as IBoothCreateRequest | IBoothCreateWithFairRequest;

      if(this.formModels.fairId !== null) {
        requestData = {
          ...requestData,
          fairId: this.formModels.fairId,
          datesOpenInFair: this.formModels.datesOpenInFair as unknown as Date[],
        } as IBoothCreateWithFairRequest;
      } else {
        requestData = {
          ...requestData,
          location: this.formModels.location,
          dateOpen: this.formModels.dateOpen as unknown as Date,
          dateClose: this.formModels.dateClose as unknown as Date,
        } as IBoothCreateRequest;
      }

      result = await useAdminAPIStore().createBooth(requestData);
    }

    if(result === true) {
      this.$emit("updated");
      this.open = false;
    } else {
      this.$emit("error");
    }

    this.updateInProgress = false;
  }
}

export default toNative(BoothManageDialog);
</script>
