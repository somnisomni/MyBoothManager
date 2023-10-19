<template>
  <VContainer class="position-fixed w-100 h-100 d-flex align-center justify-center flex-column bg-background"
              style="left: 0; right: 0; top: 0; bottom: 0;">
    <VProgressCircular indeterminate size="96" class="mb-4" />
    <div class="text-h6">데이터를 불러오는 중...</div>
  </VContainer>

  <ServerDataLoadErrorDialog v-model="errorDialogShown" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import ServerDataLoadErrorDialog from "@/components/dialogs/common/ServerDataLoadErrorDialog.vue";

@Component({
  emits: ["completed"],
  components: {
    ServerDataLoadErrorDialog,
  },
})
export default class BoothAdminLoadDataOverlay extends Vue {
  errorDialogShown = false;

  async mounted() {
    if(!useAdminStore().currentAccount) {
      if(typeof (await useAdminStore().fetchCurrentAccountInfo()) === "string") {
        this.errorDialogShown = true;
        return;
      }
    }

    if(await useAdminStore().fetchAllBoothData()) {
      this.$emit("completed");
    } else {
      this.errorDialogShown = true;
    }
  }
}
</script>
