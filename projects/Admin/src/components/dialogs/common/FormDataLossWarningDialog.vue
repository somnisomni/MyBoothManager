<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="경고"
                dialogCancelText="돌아가기"
                dialogPrimaryText="닫기"
                :onDialogPrimary="onDialogPrimary"
                accentColor="red">
    <p><span class="text-red"><strong>아직 반영되지 않은 변경된 정보가 있습니다.</strong></span></p>
    <p>변경한 내용을 취소하고 창을 닫으시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class FormDataLossWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  @Emit("confirm")
  onDialogPrimary(): void {
    this.open = false;
  }
}
</script>
