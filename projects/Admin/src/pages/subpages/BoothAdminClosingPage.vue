<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    Closing
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue, Hook } from "vue-facing-decorator";
import { BoothStatus } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";

@Component({})
export default class BoothAdminClosingPage extends Vue {
  @Hook
  beforeRouteEnter() {
    if(useAdminStore().currentBooth.booth?.status !== BoothStatus.CLOSE) {
      alert("부스가 운영 종료 상태일 때만 접근할 수 있습니다.");

      router.back();
      return false;
    }
  }
}
</script>
