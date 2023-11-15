<template>
  <VContainer class="position-fixed w-100 h-100 d-flex align-center justify-center flex-column bg-background"
              style="left: 0; right: 0; top: 0; bottom: 0;">
    <VProgressCircular indeterminate size="96" class="mb-4" />
    <div class="text-h6">데이터를 불러오는 중...</div>
  </VContainer>

  <ServerDataLoadErrorDialog v-model="errorDialogShown"
                             :errorCode="errorCode" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";

@Component({
  emits: ["completed"],
})
export default class BoothAdminLoadDataOverlay extends Vue {
  errorDialogShown = false;
  errorCode: number | null = null;

  async mounted() {
    if(!useAdminStore().currentAccount) {
      const response = await useAdminStore().fetchCurrentAccountInfo();
      if(typeof response === "number") {
        this.errorCode = response;
        this.errorDialogShown = true;
        return;
      }
    }

    const response = await useAdminStore().fetchAllBoothData();
    if(response) {
      this.$emit("completed");
    } else {
      this.errorCode = null;
      this.errorDialogShown = true;
    }
  }
}
</script>
