<template>
  <VBtn class="d-block flex-shrink-1 mr-0 px-2"
        title="관리할 부스 선택"
        size="large"
        @click.stop="boothSelectionDialogOpen = !boothSelectionDialogOpen">
    <VToolbarTitle class="d-flex flex-row text-right" style="line-height: 1.1">
      <div style="font-size: 0.66em; font-weight: 300">현재 관리 중인 부스</div>
      <div class="text-decoration-underline overflow-hidden" style="text-overflow: ellipsis;">{{ boothName }}</div>
    </VToolbarTitle>
    <VIcon class="ms-4">mdi-store-search</VIcon>
  </VBtn>

  <BoothSelectionDialog v-model="boothSelectionDialogOpen" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import BoothSelectionDialog from "@/components/dialogs/BoothSelectionDialog.vue";

@Component({
  components: {
    BoothSelectionDialog,
  },
})
export default class BoothSelectionArea extends Vue {
  boothSelectionDialogOpen = false;

  get boothName() {
    return useAdminStore().currentBooth.booth!.name;
  }
}
</script>
