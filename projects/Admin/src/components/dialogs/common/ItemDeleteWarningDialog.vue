<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="삭제 경고"
                dialogCancelText="취소"
                dialogPrimaryText="삭제"
                @primary="onDialogPrimary"
                accentColor="red">
    <p><span class="text-red"><strong>해당 항목을 삭제하면 복구할 수 없습니다.</strong></span></p>
    <p>정말로 삭제하시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class ItemDeleteWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  @Emit("confirm")
  onDialogPrimary(): void {
    this.open = false;
  }
}
</script>
