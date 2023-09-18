<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center flex-column">
    <VProgressCircular indeterminate size="96" class="mb-4" />
    <div class="text-h6">데이터를 불러오는 중...</div>
  </VContainer>
</template>

<script lang="ts">
import { useAdminStore } from "@/stores/admin";
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class FirstLoad extends Vue {
  async mounted() {
    if(await useAdminStore().startupFetch()) {
      this.$emit("complete");
    } else {
      // TODO: alert dialog
      alert("Error caused during fetch first startup data from server!");
    }
  }
}
</script>
