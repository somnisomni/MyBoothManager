<template>
  <DashboardPanel title="부스 등록 정보">
    <VLayout class="d-flex flex-row text-center w-100">
      <VLayout class="d-flex flex-column">
        <div class="text-h4 font-weight-medium">{{ boothData.name }}</div>
        <div v-if="boothData.location" class="text-overline text-grey-darken-1">@ {{ boothData.location }}</div>
      </VLayout>
      <VLayout v-if="boothData.boothNumber" class="d-flex flex-column flex-0-1 mx-2">
        <div class="text-h3">{{ boothData.boothNumber }}</div>
      </VLayout>
    </VLayout>
    <VSheet v-if="boothData.description"
            class="my-2 pa-2 text-center text-subtitle-1 bg-blue-grey-lighten-5"
            rounded>
      {{ boothData.description }}
    </VSheet>

    <VLayout class="d-flex justify-end align-center mt-4">
      <VBtn prepend-icon="mdi-note-edit" variant="outlined" @click="boothEditDialogShown = true;">정보 수정</VBtn>
    </VLayout>
  </DashboardPanel>

  <BoothManageDialog v-model="boothEditDialogShown"
                     :editMode="true" />
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import BoothManageDialog from "@/components/dialogs/BoothManageDialog.vue";
import DashboardPanel from "../dashboard/DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
    BoothManageDialog,
  },
})
export default class BoothInfoPanel extends Vue {
  boothEditDialogShown: boolean = false;

  get boothData(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }
}
</script>
