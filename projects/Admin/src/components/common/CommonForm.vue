<template>
  <VForm v-model="isValid" ref="form" @submit="onFormSubmit">
    <!-- Manual slot (prepend) -->
    <slot name="prepend"></slot>

    <div v-for="(field, fieldName, index) in fields"
         :key="field.label"
         class="d-flex flex-row flex-nowrap justify-center align-center">
      <component v-if="isFormField(field.type)"
                 v-show="!field.hide"
                 v-model.trim.lazy="models[fieldName]"
                 :is="FORM_FIELD_TYPE_COMPONENT_MAP[field.type]"
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
                 :min="
                   ((isNumericField(field.type) ? ((field as IFormFieldNumericOptions).min ?? (field as IFormFieldNumericOptions).allowNegative ? undefined : 0) : undefined)?.toString())
                   || (field.type === FormFieldType.DATE ? (field as IFormFieldDateOptions).min : undefined)"
                 :max="
                   ((isNumericField(field.type) ? (field as IFormFieldNumericOptions).max : undefined)?.toString())
                   || (field.type === FormFieldType.DATE ? (field as IFormFieldDateOptions).max : undefined)"
                 :step="isNumericField(field.type) ? (field as IFormFieldNumericOptions).step : undefined"
                 :control-variant="isNumericField(field.type) ? 'stacked' : undefined"
                 :rows="field.type === FormFieldType.TEXTAREA ? (field as IFormFieldTextareaOptions).rows : undefined"
                 :auto-grow="field.type === FormFieldType.TEXTAREA ? (field as IFormFieldTextareaOptions).autoGrow : undefined"
                 :clearable="field.optional"
                 :disabled="field.hide || field.disabled"
                 :multiple="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).multiple : undefined"
                 :items="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).items : undefined"
                 :item-title="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).itemTitle : undefined"
                 :item-value="field.type === FormFieldType.SELECT ? (field as IFormFieldSelectOptions).itemValue : undefined"
                 :rules="field.hide ? [] : [
                          ...(field.rules ?? []),
                          ...(field.optional ? [] : RULE_MANDATORY),
                          ...((!isNumericField(field.type) || (field as IFormFieldNumericOptions).allowNegative) ? [] : RULE_NUMBER_PROHIBIT_NEGATIVE)]"
                 @change="() => {
                            if(field.onChange) field.onChange(String(models[fieldName]));
                            if(isNumericField(field.type)) ((field as IFormFieldNumericOptions).allowDecimal ? normalizeDecimalNumberField(fieldName, (field as IFormFieldNumericOptions).decimalDigits) : normalizeIntegerNumberField(fieldName));
                          }"
                 @update:modelValue="() => {
                                       if(field.type === FormFieldType.SELECT && (field as IFormFieldSelectOptions).onSelectionChange) (field as IFormFieldSelectOptions).onSelectionChange!();
                                     }" />
      <component v-else
                 :is="FORM_FIELD_TYPE_COMPONENT_MAP[field.type]"
                 :class="[ 'my-1', 'flex-1-1', ...(field.class ? [field.class].flat() : [])]"
                 :style="field.style"
                 :size="field.type === FormFieldType.BUTTON ? (field as IFormButtonFieldOptions).size : undefined"
                 :color="field.type === FormFieldType.BUTTON ? (field as IFormButtonFieldOptions).color : undefined"
                 :variant="field.type === FormFieldType.BUTTON ? ((field as IFormButtonFieldOptions).variant ?? 'flat') : undefined"
                 :prepend-icon="field.type === FormFieldType.BUTTON ? (field as IFormButtonFieldOptions).prependIcon : undefined"
                 :append-icon="field.type === FormFieldType.BUTTON ? (field as IFormButtonFieldOptions).appendIcon : undefined"
                 @click="(field as IFormOtherFieldOptions).onClick">
        {{ (field as IFormOtherFieldOptions).content }}
      </component>

      <VBtn v-for="button in field.additionalButtons"
            :key="button.title"
            :icon="true"
            class="flex-0-0 align-self-start ml-2 mt-2"
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
/* eslint-disable @typescript-eslint/no-explicit-any, import/exports-last */

import { markRaw, toRaw, readonly, type Component as VueComponent } from "vue";
import { Component, Emit, Model, Prop, Ref, toNative, Vue, Watch } from "vue-facing-decorator";
import { VBtn, VCheckbox, VForm, VSelect, VTextarea, VTextField } from "vuetify/components";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import deepEqual from "fast-deep-equal";
import deepClone from "clone-deep";
import { diff } from "deep-object-diff";
import { toValue } from "vue";
import { useAdminStore } from "@/plugins/stores/admin";

export enum FormFieldType {
  TEXT = "text",
  NUMBER = "number",
  CURRENCY = "currency",
  DATE = "date",
  // TIME = "time",
  // DATETIME = "datetime",
  SELECT = "select",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PASSWORD = "password",
  // FILE = "file",
  // EMAIL = "email",
  // URL = "url",

  HEADING = "heading",
  PARAGRAPH = "paragraph",
  BUTTON = "button",
}

export const FORM_FIELD_TYPE_COMPONENT_MAP: Record<FormFieldType, VueComponent | string> = {
  [FormFieldType.TEXT]: markRaw(VTextField),
  [FormFieldType.NUMBER]: markRaw(VNumberInput),
  [FormFieldType.CURRENCY]: markRaw(VNumberInput),
  [FormFieldType.DATE]: markRaw(VTextField),
  // [FormFieldType.TIME]: markRaw(VTextField),
  // [FormFieldType.DATETIME]: markRaw(VTextField),
  [FormFieldType.SELECT]: markRaw(VSelect),
  [FormFieldType.CHECKBOX]: markRaw(VCheckbox),
  [FormFieldType.TEXTAREA]: markRaw(VTextarea),
  [FormFieldType.PASSWORD]: markRaw(VTextField),
  // [FormFieldType.FILE]: "VFileInput",
  // [FormFieldType.EMAIL]: markRaw(VTextField),
  // [FormFieldType.URL]: markRaw(VTextField),

  [FormFieldType.HEADING]: "h2",
  [FormFieldType.PARAGRAPH]: "p",
  [FormFieldType.BUTTON]: markRaw(VBtn),
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
  hide?: boolean;
  disabled?: boolean;

  // Validation
  optional?: boolean;
  rules?: (true | string | ((value: any) => true | string))[];

  // Additional buttons
  additionalButtons?: Array<IFormFieldAdditionalButtonOptions>;

  // Event
  onChange?(newValue: string): void;
}

export interface IFormFieldAdditionalButtonOptions {
  icon: string;
  title: string;
  variant?: InstanceType<typeof VBtn>["variant"];
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

export interface IFormFieldTextareaOptions extends IFormFieldOptions {
  rows?: number;
  autoGrow?: boolean;
}

export interface IFormFieldSelectOptions extends IFormFieldOptions {
  items: any[];
  itemTitle: string;
  itemValue: string;
  multiple?: boolean;
  onSelectionChange?(): void;
}

export interface IFormFieldDateOptions extends IFormFieldOptions {
  min?: string;
  max?: string;
}

export interface IFormOtherFieldOptions extends Omit<IFormFieldOptions, "label">, Partial<Pick<IFormFieldOptions, "label">> {
  content: string;
  onClick?(): void;
}

export interface IFormButtonFieldOptions extends IFormOtherFieldOptions {
  size?: string;
  color?: string;
  variant?: InstanceType<typeof VBtn>["variant"];
  prependIcon?: string;
  appendIcon?: string;
}

export type FormFieldOptions = IFormFieldOptions
                               | ({ type: FormFieldType.NUMBER } & IFormFieldNumericOptions)
                               | ({ type: FormFieldType.CURRENCY } & IFormFieldCurrencyOptions)
                               | ({ type: FormFieldType.TEXTAREA } & IFormFieldTextareaOptions)
                               | ({ type: FormFieldType.SELECT } & IFormFieldSelectOptions)
                               | ({ type: FormFieldType.DATE } & IFormFieldDateOptions)
                               | ({ type: FormFieldType.HEADING } & IFormOtherFieldOptions)
                               | ({ type: FormFieldType.PARAGRAPH } & IFormOtherFieldOptions)
                               | ({ type: FormFieldType.BUTTON } & IFormButtonFieldOptions);

@Component({
  emits: ["submit"],
})
class CommonForm extends Vue {
  readonly FormFieldType = FormFieldType;
  readonly FORM_FIELD_TYPE_COMPONENT_MAP = FORM_FIELD_TYPE_COMPONENT_MAP;

  @Model({ type: Boolean, default: false }) isValid!: boolean;
  @Model({ name: "edited", type: Boolean, default: false }) isEdited!: boolean;
  @Model({ name: "data", type: Object, default: {}, required: true }) models!: Record<string, any>;
  @Prop({ type: Object, default: {}, required: true }) readonly fields!: Readonly<Record<string, FormFieldOptions>>;

  @Ref("form") readonly form!: VForm;

  private _initialModels: Readonly<Record<string, any>> = readonly({ } as const);
  public  get initialModels() { return toRaw(this._initialModels); }
  private set initialModels(value: Record<string, any>) { this._initialModels = readonly(deepClone(toValue(value))); }

  /* Model value update */
  @Watch("models", { deep: true, immediate: true })
  onModelDataUpdate() {
    this.isEdited = !deepEqual(toRaw(this.models), toRaw(this.initialModels));
  }

  public setInitialModel(initial: Record<string, any>): void {
    this.initialModels = initial;
    this.reset();
  }

  public getDiffOfModel(): Record<string, any> {
    const result: Record<string, any> = diff(toRaw(this.initialModels), toRaw(this.models));

    // NOTE: Below is workaround for diff() ...
    //       ... the diff() function converts array to record object, making the value not valid for the API request
    for(const key in this.models) {
      if(typeof this.models[key] === "object" && this.models[key] instanceof Array) {
        result[key] = !deepEqual(this.initialModels[key], this.models[key]) ? deepClone(this.models[key]) : undefined;
      }
    }

    return result;
  }

  /* Common rules */
  readonly RULE_MANDATORY = [(v: any) => (
    ((typeof v === "string" && v.trim().length > 0)
      || (typeof v === "number" && Number.isFinite(v))
      || (v instanceof Array && v.length > 0))
      && v !== undefined
      && v !== null)
    || "필수로 입력해야 하는 항목입니다."];
  readonly RULE_NUMBER_PROHIBIT_NEGATIVE = [(v: number) => v >= 0 || "음수는 입력할 수 없습니다."];

  /* Common getters */
  get currentBoothCurrencySymbol(): string {
    return useAdminStore().currentBoothCurrencyInfo.symbol;
  }

  /* Component event emits */
  @Emit("submit")
  onFormSubmit(): boolean { return this.isValid; }

  /* Form utility functions */
  // FORM
  public reset() {
    for(const key in this.initialModels) {
      this.models[key] = deepClone(this.initialModels[key]);
    }

    // Force execute data update callback
    this.onModelDataUpdate();
  }

  public resetValidation() {
    if(this.form) {
      this.form.resetValidation();
      this.form.validate();
    }
  }

  isFormField(fieldType: FormFieldType): boolean {
    switch(fieldType) {
      case FormFieldType.HEADING:
      case FormFieldType.PARAGRAPH:
      case FormFieldType.BUTTON:
        return false;
      default:
        return true;
    }
  }

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

export default toNative(CommonForm);
</script>
