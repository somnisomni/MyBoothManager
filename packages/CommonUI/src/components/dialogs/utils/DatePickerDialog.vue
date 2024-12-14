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
                 :hideHeader="hideHeader" />
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, toNative, Vue } from "vue-facing-decorator";

@Component({})
export class DatePickerDialog extends Vue {
  @Model({ type: Boolean }) declare open: boolean;
  @Prop({ type: String, default: "날짜 선택" }) declare readonly title: string;
  @Prop({ type: Date }) declare readonly min: Date;
  @Prop({ type: Date }) declare readonly max: Date;
  @Prop({ type: Boolean, default: false }) declare readonly hideHeader: boolean;

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
