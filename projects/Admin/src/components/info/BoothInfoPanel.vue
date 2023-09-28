<template>
  <DashboardPanel title="부스 등록 정보">
    <div>
      <span>{{ boothData.name }}</span>
      <span v-if="boothData.location">@{{ boothData.location }}</span>
    </div>
    <div v-if="boothData.description">{{ boothData.description }}</div>

    <VBtn variant="outlined" @click="boothEditDialogShown = true;">정보 수정</VBtn>
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
