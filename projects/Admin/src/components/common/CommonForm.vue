<template>
  <VForm v-model="isValid" ref="form" @submit="onFormSubmit">
    <!-- Manual slot (prepend) -->
    <slot name="prepend"></slot>

    <div v-for="(field, fieldname, index) in fields"
         :key="field.label"
         class="d-flex flex-row flex-nowrap justify-center">
      <component :is="FORM_FIELD_TYPE_COMPONENT_MAP[field.type]"
                 v-model.trim.lazy="models[fieldname]"
                 :tabindex="index + 1    /* tabindex should be started with 1 */"
                 :type="isNumericField(field.type) ? 'number' : field.type"
                 :label="`${field.label}` + (field.optional ? '' : ' *')"
                 :hint="field.hint"
                 :persistent-hint="field.persistentHint"
                 :placeholder="field.placeholder"
                 :class="[ 'my-1', 'flex-1-1', ...(field.class ? [field.class].flat() : [])]"
                 :style="field.style"
                 :density="field.density"
                 :prefix="field.type === FormFieldType.CURRENCY ? ((field as IFormFieldCurrencyOptions).currencySymbol ?? currentBoothCurrencySymbol) : field.prefix"
                 :suffix="field.suffix"
                 :min="isNumericField(field.type) ? ((field as IFormFieldNumericOptions).min ?? (field as IFormFieldNumericOptions).allowNegative ? undefined : 0) : undefined"
                 :max="isNumericField(field.type) ? (field as IFormFieldNumericOptions).max : undefined"
                 :step="isNumericField(field.type) ? (field as IFormFieldNumericOptions).step : undefined"
                 :items="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).items : undefined"
                 :item-title="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).itemTitle : undefined"
                 :item-value="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).itemValue : undefined"
                 :rules="[...(field.rules ?? []),
                          ...(field.optional ? [] : RULE_MANDATORY),
                          ...((!isNumericField(field.type) || (field as IFormFieldNumericOptions).allowNegative) ? [] : RULE_NUMBER_PROHIBIT_NEGATIVE)]"
                 @change="isNumericField(field.type)
                          ? ((field as IFormFieldNumericOptions).allowDecimal ? normalizeDecimalNumberField(fieldname, (field as IFormFieldNumericOptions).decimalDigits) : normalizeIntegerNumberField(fieldname))
                          : undefined" />

      <VBtn v-for="button in field.additionalButtons"
            :key="button.title"
            icon
            class="flex-0-0 ml-2 mt-2"
            :title="button.title"
            :variant="button.variant ?? 'flat'"
            @click="button.onClick">
        <VTooltip activator="parent" location="bottom">{{ button.title }}</VTooltip>
        <VIcon>{{ button.icon }}</VIcon>
      </VBtn>
    </div>

    <!-- Manual slot -->
    <slot></slot>
  </VForm>
</template>

<script lang="ts">
import { markRaw, type Component as VueComponent } from "vue";
import { Component, Emit, Model, Prop, Ref, Vue, Watch } from "vue-facing-decorator";
import { VCheckbox, VForm, VSelect, VTextField } from "vuetify/components";
import { useAdminStore } from "@/stores/admin";

export enum FormFieldType {
  TEXT = "text",
  NUMBER = "number",
  CURRENCY = "currency",
  DATE = "date",
  // TIME = "time",
  // DATETIME = "datetime",
  SELECT = "select",
  CHECKBOX = "checkbox",
  // TEXTAREA = "textarea",
  PASSWORD = "password",
  // FILE = "file",
  // EMAIL = "email",
  // URL = "url",
  HEADING = "heading",
}

export const FORM_FIELD_TYPE_COMPONENT_MAP: Record<FormFieldType, VueComponent | string> = {
  [FormFieldType.TEXT]: markRaw(VTextField),
  [FormFieldType.NUMBER]: markRaw(VTextField),
  [FormFieldType.CURRENCY]: markRaw(VTextField),
  [FormFieldType.DATE]: markRaw(VTextField),
  // [FormFieldType.TIME]: markRaw(VTextField),
  // [FormFieldType.DATETIME]: markRaw(VTextField),
  [FormFieldType.SELECT]: markRaw(VSelect),
  [FormFieldType.CHECKBOX]: markRaw(VCheckbox),
  // [FormFieldType.TEXTAREA]: "VTextarea",
  [FormFieldType.PASSWORD]: markRaw(VTextField),
  // [FormFieldType.FILE]: "VFileInput",
  // [FormFieldType.EMAIL]: markRaw(VTextField),
  // [FormFieldType.URL]: markRaw(VTextField),
  [FormFieldType.HEADING]: "h2",
};

export interface IFormFieldOptions {
  type: FormFieldType;

  // styles
  class?: string | string[];
  style?: string | Record<string, string | number>;
  density?: string;

  // UX
  label: string;
  hint?: string;
  persistentHint?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;

  // Validation
  optional?: boolean;
  rules?: (true | string | ((value: any) => true | string))[];

  // Additional buttons
  additionalButtons?: Array<IFormFieldAdditionalButtonOptions>;
}

export interface IFormFieldAdditionalButtonOptions {
  icon: string;
  title: string;
  variant?: string;
  onClick(): void;
}

export interface IFormFieldNumericOptions extends IFormFieldOptions {
  min?: number;
  max?: number;
  step?: number;

  allowDecimal?: boolean;
  decimalDigits?: number;

  allowNegative?: boolean;
}

export interface IFormFieldCurrencyOptions extends IFormFieldNumericOptions {
  currencySymbol?: string;
}

export interface IFormFieldSelectOptions extends IFormFieldOptions {
  items: any[];
  itemTitle: string;
  itemValue: string;
}

export interface IFormFieldDateOptions extends IFormFieldOptions {
  min?: string;
  max?: string;
}

export type FormFieldOptions = IFormFieldOptions
                               | ({ type: FormFieldType.NUMBER } & IFormFieldNumericOptions)
                               | ({ type: FormFieldType.CURRENCY } & IFormFieldCurrencyOptions)
                               | ({ type: FormFieldType.SELECT } & IFormFieldSelectOptions)
                               | ({ type: FormFieldType.DATE } & IFormFieldDateOptions);

@Component({
  emits: ["submit"],
})
export default class CommonForm extends Vue {
  readonly FormFieldType = FormFieldType;
  readonly FORM_FIELD_TYPE_COMPONENT_MAP = FORM_FIELD_TYPE_COMPONENT_MAP;

  @Model({ type: Boolean, default: false }) isValid!: boolean;
  @Model({ name: "edited", type: Boolean, default: false }) isEdited!: boolean;
  @Model({ name: "data", type: Object, default: {}, required: true }) models!: Record<string, any>;
  @Prop({ type: Object, default: {}, required: true }) initialModelValues!: Record<string, any>;
  @Prop({ type: Object, default: {}, required: true }) fields!: Record<string, FormFieldOptions>;

  @Ref("form") readonly form!: VForm;

  /* Model value update */
  @Watch("models", { deep: true, immediate: true })
  onModelDataUpdate() {
    this.isEdited = Object.keys(this.models).some((key) => {
      const k = key as keyof typeof this.models;
      return this.models[k] !== this.initialModelValues[k];
    });
  }

  /* Common rules */
  readonly RULE_MANDATORY = [(v: string | number) => (!!v || (typeof v === "string" && v.trim().length > 0) || (typeof v === "number" && Number.isFinite(v))) || "필수로 입력해야 하는 항목입니다."];
  readonly RULE_NUMBER_PROHIBIT_NEGATIVE = [(v: number) => v >= 0 || "음수는 입력할 수 없습니다."];

  /* Common getters */
  get currentBoothCurrencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
  }

  /* Component event emits */
  @Emit("submit")
  onFormSubmit(): boolean { return this.isValid; }

  /* Form utility functions */
  // FORM
  public reset() { this.models = { ...this.initialModelValues }; }
  public resetValidation() { if(this.form) this.form.resetValidation(); }

  // NUMBER
  isNumericField(fieldType: FormFieldType): boolean {
    return fieldType === FormFieldType.NUMBER || fieldType === FormFieldType.CURRENCY;
  }

  normalizeIntegerNumberField(fieldName: string) {
    const value = Math.floor(new Number(this.models[fieldName]).valueOf());
    this.models[fieldName] = value ? value : 0;
  }

  normalizeDecimalNumberField(fieldName: string, decimalDigits: number = 3) {
    const value = new Number(new Number(this.models[fieldName]).toFixed(decimalDigits ?? 3)).valueOf();
    this.models[fieldName] = value ? value : 0;
  }
}
</script>
