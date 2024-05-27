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
                @primary="onDialogConfirm"
                @secondary="form?.reset"
                @cancel="onDialogCancel"
                :disableSecondary="!isFormEdited"
                :disablePrimary="!isFormEdited || !isFormValid"
                :closeOnCancel="false">
    <VLayout class="d-flex flex-column flex-md-row">
      <div class="d-flex flex-column">
        <!-- Fair selection -->
        <VSelect v-model.number="formModels.fairId"
                 :items="normalizedFairList"
                 label="행사"
                 item-title="name"
                 item-value="id"
                 hint="부스 생성 시에만 지정 가능하며, 이후에는 변경할 수 없습니다."
                 persistent-hint
                 :loading="isFairListLoading"
                 :disabled="isFairListLoading || editMode"
                 @update:modelValue="formModels.datesOpenInFair.splice(0, formModels.datesOpenInFair.length)">
          <template v-slot:item="{ props, item }">
            <VListItem v-bind="props">
              <VListItemSubtitle class="text-subtitle-2"
                                 style="font-size: 0.75em !important">
                <div>{{ item.raw.openingDates }} {{ item.raw.location ? `@ ${item.raw.location}` : undefined }}</div>
              </VListItemSubtitle>
            </VListItem>
          </template>
        </VSelect>

        <!-- Form -->
        <CommonForm v-model="isFormValid"
                    v-model:edited="isFormEdited"
                    v-model:data="formModels"
                    ref="form"
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
import { reactive, ref } from "vue";
import { Vue, Component, Model, Watch, Prop, Ref, Setup } from "vue-facing-decorator";
import { ErrorCodes, currencySymbolInfo, type IBoothCreateRequest, type IBoothCreateWithFairRequest, type IBoothUpdateRequest, type IFairResponse } from "@myboothmanager/common";
import moment from "moment";
import { defineStore } from "pinia";
import deepEqual from "fast-deep-equal";
import deepClone from "clone-deep";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";
import AdminAPI from "@/lib/api-admin";
import CommonForm, { FormFieldType, type FormFieldOptions } from "../common/CommonForm.vue";
import FormDataLossWarningDialog from "./common/FormDataLossWarningDialog.vue";

interface IBoothCreateRequestInternal extends Omit<IBoothCreateRequest, "dateOpen" | "dateClose">, Omit<IBoothCreateWithFairRequest, "datesOpenInFair"> {
  dateOpen?: string,
  dateClose?: string,
  datesOpenInFair: Array<string>,
}

const momentFormat = (date: Date) => moment(date).format("YYYY-MM-DD");

const useProxyStore = defineStore("BoothManageDialog__proxy", () => {
  const _fairId = ref<number | null>(null);

  const availableFairList = ref<Array<IFairResponse>>([]);
  const formModels: IBoothCreateRequestInternal = reactive({
    name: "",
    description: "",
    location: "",
    boothNumber: "",
    currencySymbol: "₩",

    dateOpen: momentFormat(new Date()),
    dateClose: momentFormat(new Date()),
    datesOpenInFair: [],

    get fairId() { return _fairId.value; },
    set fairId(value: number | null) {
      _fairId.value = value;
      this.location = availableFairList.value.find((fair) => fair.id === value)?.location ?? "";
    },
  });
  const editMode = ref(false);

  return {
    availableFairList,
    formModels,
    editMode,
  };
});

@Component({
  components: {
    CommonForm,
    FormDataLossWarningDialog,
  },
  emits: ["updated", "error"],
})
export default class BoothManageDialog extends Vue {
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
    currencySymbol: {
      type: FormFieldType.SELECT,
      label: "통화 기호",
      get items() {
        return Object.keys(currencySymbolInfo).map((key) => ({
          ...currencySymbolInfo[key],
          name: `${currencySymbolInfo[key].name} (${currencySymbolInfo[key].symbol})`,
        }));
      },
      itemTitle: "name",
      itemValue: "symbol",
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
      rules: [ ((v: string) => new Date(v) >= new Date(useProxyStore().formModels.dateOpen!) ? true : "운영 종료 일자는 운영 시작 일자보다 빠를 수 없습니다.") ],
      onChange: this.resetValidationProxy,
      get hide() { return useProxyStore().formModels.fairId; },
    },

    /* Fair-associated fields */
    datesOpenInFair: {
      type: FormFieldType.SELECT,
      label: "운영 일자",
      get items() {
        const targetFair = useProxyStore().availableFairList.find((fair) => fair.id === useProxyStore().formModels.fairId);
        return targetFair?.openingDates.map((date) => ({
          title: new Date(date).toLocaleDateString(),
          value: momentFormat(date),
        }));
      },
      itemTitle: "title",
      itemValue: "value",
      multiple: true,
      get hide() { return !useProxyStore().formModels.fairId; },
    },
  } as Record<keyof IBoothCreateRequestInternal, FormFieldOptions> | Record<string, FormFieldOptions>;
  resetValidationProxy() { this.form?.resetValidation(); }

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
    const normalizeDateRange = (dates: Array<Date | string>) => {
      if(dates.length === 1) return new Date(dates[0]).toLocaleDateString();

      const min = dates.reduce((prev, curr) => new Date(prev) < new Date(curr) ? prev : curr);
      const max = dates.reduce((prev, curr) => new Date(prev) > new Date(curr) ? prev : curr);

      return `${new Date(min).toLocaleDateString()} ~ ${new Date(max).toLocaleDateString()}`;
    };

    return [
      // Placeholder fair data while loading fair list
      ...(this.isFairListLoading ? [{
        ...useAdminStore().currentBooth.booth?.fair,
      }] : []),

      // Actual fair data fetched from API
      ...useProxyStore().availableFairList.map((fair) => ({
        ...fair,
        openingDates: normalizeDateRange(fair.openingDates),
      })),

      // Custom fair
      {
        id: null,
        name: "(사용자 지정)",
      },
    ];
  }

  @Watch("open")
  async onDialogOpen(open: boolean) {
    useProxyStore().editMode = this.editMode;

    if(!open) return;

    while(!this.form) await this.$nextTick();

    if(this.editMode) {
      const boothData = useAdminStore().currentBooth.booth!;

      this.form.setInitialModel({
        fairId: boothData.fair?.id,
        name: boothData.name,
        description: boothData.description,
        location: boothData.fair?.location ?? boothData.location,
        boothNumber: boothData.boothNumber,
        currencySymbol: boothData.currencySymbol,
        dateOpen: boothData.dateOpen ? momentFormat(new Date(boothData.dateOpen)) : undefined,
        dateClose: boothData.dateClose ? momentFormat(new Date(boothData.dateClose)) : undefined,
        datesOpenInFair: boothData.datesOpenInFair,
      } as IBoothUpdateRequest);
    } else {
      this.form.setInitialModel({
        fairId: null,
        name: "",
        description: "",
        location: "",
        boothNumber: "",
        currencySymbol: "₩",
        dateOpen: momentFormat(new Date()),
        dateClose: momentFormat(new Date()),
        datesOpenInFair: [],
      } as IBoothCreateRequestInternal);
    }

    if(this.isFairListLoading) {
      // No `await` here
      AdminAPI.fetchAvailableFairs().then((response) => {
        if(typeof response === "object") {
          useProxyStore().availableFairList = response;
        }

        this.isFairListLoading = false;
      });
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

    if(this.editMode) {
      // UPDATE

      const requestData: IBoothUpdateRequest = {
        ...this.form!.getDiffOfModel(),

        // NOTE: Below is workaround for diff() - this function converts array to object, making the value not valid for the request
        datesOpenInFair: (!deepEqual(this.form!.initialModels.datesOpenInFair, this.formModels.datesOpenInFair) ? deepClone(this.formModels.datesOpenInFair) : undefined) as unknown as Array<Date>,
      };

      result = await useAdminAPIStore().updateCurrentBoothInfo(requestData as IBoothUpdateRequest);
    } else {
      // CREATE

      let requestData = {
        name: this.formModels.name,
        description: this.formModels.description,
        currencySymbol: this.formModels.currencySymbol,
        boothNumber: this.formModels.boothNumber,
      } as IBoothCreateRequest | IBoothCreateWithFairRequest;

      if(this.formModels.fairId !== null) {
        requestData = {
          ...requestData,
          fairId: this.formModels.fairId,
          datesOpenInFair: this.formModels.datesOpenInFair as unknown as Array<Date>,
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
</script>
