<template>
  <VBtn title="Change the booth to manage" @click.stop="boothSelectionDialogOpen = !boothSelectionDialogOpen">
    <VToolbarTitle class="text-right text-decoration-underline">{{ boothName }}</VToolbarTitle>
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
