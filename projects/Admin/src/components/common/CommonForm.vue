<template>
  <VForm v-model="isValid" @submit="onFormSubmit">
    <!-- Manual slot (prepend) -->
    <slot name="prepend"></slot>

    <component v-for="(field, fieldname, index) in fields"
               :key="field.label"
               :is="FORM_FIELD_TYPE_COMPONENT_MAP[field.type]"

               v-model.trim.lazy="models[fieldname]"
               :tabindex="index"
               :type="isNumericField(field.type) ? 'number' : field.type"
               :label="`${field.label}` + (field.optional ? '' : ' *')"
               :hint="field.hint"
               :persistent-hint="field.persistentHint"
               :placeholder="field.placeholder"
               :class="field.class"
               :style="field.style"
               :density="field.density"
               :prefix="field.type === FormFieldType.CURRENCY ? ((field as IFormFieldCurrencyOptions).currencySymbol ?? currentBoothCurrencySymbol) : field.prefix"
               :suffix="field.suffix"
               :min="isNumericField(field.type) ? ((field as IFormFieldNumericOptions).min ?? (field as IFormFieldNumericOptions).allowNegative ? undefined : 0) : undefined"
               :max="isNumericField(field.type) ? (field as IFormFieldNumericOptions).max : undefined"
               :step="isNumericField(field.type) ? (field as IFormFieldNumericOptions).step : undefined"
               :rules="[...(field.rules ?? []),
                        ...(field.optional ? [] : RULE_MANDATORY),
                        ...((!isNumericField(field.type) || (field as IFormFieldNumericOptions).allowNegative) ? [] : RULE_NUMBER_PROHIBIT_NEGATIVE)]"
               @change="isNumericField(field.type)
                        ? ((field as IFormFieldNumericOptions).allowDecimal ? normalizeDecimalNumberField(fieldname, (field as IFormFieldNumericOptions).decimalDigits) : normalizeIntegerNumberField(fieldname))
                        : undefined" />

    <!-- Manual slot -->
    <slot></slot>
  </VForm>
</template>

<script lang="ts">
import type { Component as VueComponent } from "vue";
import { Component, Emit, Model, Prop, Vue, Watch } from "vue-facing-decorator";
import { VCheckbox, VSelect, VTextField } from "vuetify/components";
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
  [FormFieldType.TEXT]: VTextField,
  [FormFieldType.NUMBER]: VTextField,
  [FormFieldType.CURRENCY]: VTextField,
  [FormFieldType.DATE]: VTextField,
  // [FormFieldType.TIME]: VTextField,
  // [FormFieldType.DATETIME]: VTextField,
  [FormFieldType.SELECT]: VSelect,
  [FormFieldType.CHECKBOX]: VCheckbox,
  // [FormFieldType.TEXTAREA]: "VTextarea",
  [FormFieldType.PASSWORD]: VTextField,
  // [FormFieldType.FILE]: "VFileInput",
  // [FormFieldType.EMAIL]: VTextField,
  // [FormFieldType.URL]: VTextField,
  [FormFieldType.HEADING]: "h2",
};

export interface IFormFieldOptions {
  type: FormFieldType;

  // styles
  class?: string;
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
                               | { type: FormFieldType.NUMBER } & IFormFieldNumericOptions
                               | { type: FormFieldType.CURRENCY } & IFormFieldCurrencyOptions
                               | { type: FormFieldType.SELECT } & IFormFieldSelectOptions
                               | { type: FormFieldType.DATE } & IFormFieldDateOptions;

@Component({
  emits: ["submit"],
})
export default class CommonForm extends Vue {
  readonly FormFieldType = FormFieldType;
  readonly FORM_FIELD_TYPE_COMPONENT_MAP = FORM_FIELD_TYPE_COMPONENT_MAP;

  @Model({ type: Boolean, default: false }) isValid!: boolean;
  @Model({ name: "edited", type: Boolean, default: false }) isEdited!: boolean;
  @Prop({ type: Object, default: {}, required: true }) models!: Record<string, any>;
  @Prop({ type: Object, default: {}, required: true }) initialModelValues!: Record<string, any>;
  @Prop({ type: Object, default: {}, required: true }) fields!: Record<string, FormFieldOptions>;

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
