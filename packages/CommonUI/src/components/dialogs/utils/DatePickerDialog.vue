<template>
  <CommonDialog v-model="open"
                style="overflow-x: auto;"
                width="auto"
                maxWidth="100%"
                :dialogTitle="title"
                dialogCancelText="취소"
                dialogPrimaryText="확인"
                @primary="onDialogPrimary">
    <VDatePicker v-model="date"
                 class="dialog-date-picker pt-4"
                 :title="undefined"
                 :min="min"
                 :max="max"
                 :hide-header="hideHeader" />
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, toNative, Vue } from "vue-facing-decorator";

@Component({})
export class DatePickerDialog extends Vue {
  @Model({ type: Boolean }) open!: boolean;
  @Prop({ type: String, default: "날짜 선택" }) title!: string;
  @Prop({ type: Date }) min!: Date;
  @Prop({ type: Date }) max!: Date;
  @Prop({ type: Boolean, default: false }) hideHeader!: boolean;

  date: Date = new Date();

  @Emit("primary")
  onDialogPrimary(): Date {
    return this.date;
  }
}

export default toNative(DatePickerDialog);
</script>

<style lang="scss">
.dialog-date-picker {
  .v-picker-title {
    display: none;
  }
}
</style>
