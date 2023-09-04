<template>
  <VBtn title="관리할 부스 선택"
        size="large"
        @click.stop="boothSelectionDialogOpen = !boothSelectionDialogOpen">
    <VToolbarTitle class="d-flex flex-row text-right" style="line-height: 1.1">
      <div style="font-size: 0.66em; font-weight: 300">현재 관리 중인 부스</div>
      <div class="text-decoration-underline">{{ boothName }}</div>
    </VToolbarTitle>
    <VIcon class="ms-4">mdi-refresh</VIcon>
  </VBtn>
  <VBtn icon class="ms-2 me-0" title="부스 정보 수정" @click.stop="boothInfoEditDialogOpen = !boothInfoEditDialogOpen"><VIcon>mdi-storefront-edit</VIcon></VBtn>

  <BoothSelectionDialog v-model="boothSelectionDialogOpen" />
  <BoothInfoEditDialog v-model="boothInfoEditDialogOpen" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import BoothSelectionDialog from "@/components/navbar/BoothSelectionDialog.vue";
import { useAdminStore } from "@/stores/admin";
import BoothInfoEditDialog from "./BoothInfoEditDialog.vue";

@Component({
  components: {
    BoothSelectionDialog,
    BoothInfoEditDialog,
  },
})
export default class BoothSelectionArea extends Vue {
  boothSelectionDialogOpen = false;
  boothInfoEditDialogOpen = false;

  get boothName() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].name;
  }
}
</script>
