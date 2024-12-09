<template>
  <CommonErrorDialog v-model="open"
                     :closeable="false"
                     dialogTitle="데이터 불러오기 오류"
                     :headlineText="headlineText" />
</template>

<script lang="ts">
import { Component, Model, Prop, toNative, Vue } from "vue-facing-decorator";
import CommonErrorDialog from "../common/CommonErrorDialog.vue";

@Component({
  components: {
    CommonErrorDialog,
  },
})
class ServerDataLoadErrorDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
  @Prop({ type: Number, default: null }) errorCode!: number | null;

  get headlineText(): string {
    return `서버로부터 데이터를 불러오는 중 오류가 발생했습니다. ${this.errorCode ? `(${this.errorCode})` : ""}`;
  }
}

export default toNative(ServerDataLoadErrorDialog);
</script>
