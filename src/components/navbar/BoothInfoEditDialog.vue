<template>
  <VDialog v-model="open"
           persistent
           width="700"
           max-width="100%"
           class="booth-info-edit-dialog">
    <VCard :loading="updateInProgress">
      <template v-slot:loader="{ isActive }">
        <VProgressLinear :active="isActive"
                         indeterminate
                         color="primary"
                         height="4" />
      </template>

      <VCardTitle>부스 정보 수정</VCardTitle>

      <VDivider />

      <VCardText>
        HERE
      </VCardText>

      <VDivider />

      <!-- Dialog action -->
      <VCardActions>
        <VSpacer />
        <VBtn :disabled="updateInProgress" text @click="onDialogCancel">취소</VBtn>
        <VBtn :disabled="updateInProgress" color="primary" text @click="onDialogConfirm">수정하기</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { Vue, Component, Model } from "vue-facing-decorator";

@Component({})
export default class BoothInfoEditDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  updateInProgress = false;

  onDialogCancel() {
    this.open = false;
  }

  onDialogConfirm() {
    // TODO: Replace real API call. Below is a mock.

    this.updateInProgress = true;
    setTimeout(() => {
      this.updateInProgress = false;
      this.open = false;
    }, 1000);
  }
}
</script>
