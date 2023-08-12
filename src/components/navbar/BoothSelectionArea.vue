<template>
  <VBtn title="Change the booth to manage" @click.stop="dialogOpen = !dialogOpen">
    <VToolbarTitle class="text-right text-decoration-underline">{{ boothName }}</VToolbarTitle>
    <VIcon class="ms-4">mdi-refresh</VIcon>
  </VBtn>
  <VBtn icon class="ms-2 me-0" title="Edit booth information"><VIcon>mdi-storefront-edit</VIcon></VBtn>

  <BoothSelectionDialog v-model="dialogOpen" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import BoothSelectionDialog from "@/components/navbar/BoothSelectionDialog.vue";
import { useAdminStore } from "@/stores/admin";

@Component({
  components: {
    BoothSelectionDialog,
  },
})
export default class BoothSelectionArea extends Vue {
  dialogOpen = false;

  get boothName() {
    return useAdminStore().boothList[useAdminStore().currentBoothId].name;
  }
}
</script>
