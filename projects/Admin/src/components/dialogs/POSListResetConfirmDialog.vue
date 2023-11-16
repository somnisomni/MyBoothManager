<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="경고"
                dialogCancelText="취소"
                dialogPrimaryText="초기화"
                @primary="onDialogPrimary"
                accentColor="red">
    <p><span class="text-red"><strong>주문 목록이 초기화됩니다.</strong></span></p>
    <p>진행하시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class POSListResetConfirmDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  @Emit("confirm")
  onDialogPrimary() {
    this.open = false;
  }
}
</script>
