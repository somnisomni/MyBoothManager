<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="경고"
                dialogCancelText="취소"
                dialogPrimaryText="초기화"
                accentColor="red"
                @primary="onDialogPrimary">
    <p><span class="text-red"><strong>주문 목록이 초기화됩니다.</strong></span></p>
    <p>진행하시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class POSListResetConfirmDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;

  @Emit("confirm")
  onDialogPrimary(): void {
    this.open = false;
  }
}
</script>
