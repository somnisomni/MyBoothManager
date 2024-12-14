<template>
  <CommonDialog v-model="open"
                width="300"
                dialogCancelText="취소"
                dialogPrimaryText="확인"
                @primary="onDialogPrimary">
    <p>POS 페이지를 떠나시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Emit, Model, Vue } from "vue-facing-decorator";

@Component({
  emits: [ "confirm" ],
})
export default class POSPageLeaveConfirmDialog extends Vue {
  @Model({ type: Boolean }) declare open: boolean;

  @Emit("confirm")
  onDialogPrimary(): void {
    this.open = false;
  }
}
</script>
