<template>
  <CommonWarningDialog v-model="open"
                       dialogTitle="삭제 경고"
                       cancelText="취소"
                       primaryText="삭제"
                       headlineText="해당 항목을 삭제하면 복구할 수 없습니다."
                       accentColor="red">
    <p>정말로 삭제하시겠습니까?</p>
  </CommonWarningDialog>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class ItemDeleteWarningDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
}
</script>
