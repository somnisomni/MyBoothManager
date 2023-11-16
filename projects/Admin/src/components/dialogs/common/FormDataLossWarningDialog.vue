<template>
  <CommonWarningDialog v-model="open"
                       dialogTitle="경고"
                       cancelText="돌아가기"
                       headlineText="아직 반영되지 않은 변경된 정보가 있습니다.">
    <p>변경한 내용을 취소하고 창을 닫으시겠습니까?</p>
  </CommonWarningDialog>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class FormDataLossWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
}
</script>
