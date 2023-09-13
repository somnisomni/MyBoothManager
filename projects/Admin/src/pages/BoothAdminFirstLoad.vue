<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center flex-column">
    <VProgressCircular indeterminate size="96" class="mb-4" />
    <div class="text-h6">데이터를 불러오는 중...</div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class FirstLoad extends Vue {
  mounted() {
    setTimeout(() => {
      this.$emit("complete");
    }, 3000);
  }
}
</script>
