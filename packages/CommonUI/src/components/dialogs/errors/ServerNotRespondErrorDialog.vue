<template>
  <CommonErrorDialog v-model="open"
                     :closeable="false"
                     dialogTitle="서버 응답 없음"
                     headlineText="서버에 연결할 수 없습니다.">
    <p>네트워크 연결 상태를 확인하거나, 나중에 다시 시도해주세요.</p>
  </CommonErrorDialog>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-facing-decorator";
import CommonErrorDialog from "../common/CommonErrorDialog.vue";

@Component({
  components: {
    CommonErrorDialog,
  },
})
export default class ServerNotRespondErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
}
</script>
