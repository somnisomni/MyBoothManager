<template>
  <CommonDialog v-model="open"
                width="auto"
                dialogTitle="경고"
                dialogCancelText="돌아가기"
                dialogPrimaryText="닫기"
                :onDialogPrimary="() => { closeCallback(); open = false; }"
                accentColor="red">
    <p><span class="text-red"><strong>아직 반영되지 않은 변경된 정보가 있습니다.</strong></span></p>
    <p>변경한 내용을 취소하고 창을 닫으시겠습니까?</p>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-facing-decorator";
import CommonDialog from "./CommonDialog.vue";

@Component({
  components: {
    CommonDialog,
  },
})
export default class FormDataLossWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Function, default: () => {} }) closeCallback!: () => void;
}
</script>
