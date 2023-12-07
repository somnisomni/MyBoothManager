<template>
  <DashboardPanel title="참여 멤버">
    <div v-for="member in membersList"
         :key="member.name">
      <div>{{ member.name }} - {{ member.role }}</div>
      <div v-if="member.descriptionShort">{{ member.descriptionShort }}</div>
      <a v-if="member.url" :href="member.url" target="_blank">대표 URL</a>
    </div>

    <VLayout class="d-flex justify-end align-center w-100">
      <VBtn icon="mdi-plus" variant="outlined" title="멤버 추가" @click="addDialogShown = true" />
    </VLayout>

    <BoothMemberAddDialog v-model="addDialogShown"
                          @added="$forceUpdate()" />
  </DashboardPanel>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import DashboardPanel from "../dashboard/DashboardPanel.vue";
import BoothMemberAddDialog from "../dialogs/BoothMemberAddDialog.vue";

@Component({
  components: {
    DashboardPanel,
    BoothMemberAddDialog,
  },
})
export default class BoothMembersPanel extends Vue {
  addDialogShown = false;

  get membersList(): Array<IBoothMember> {
    return useAdminStore().boothList[useAdminStore().currentBoothId].members ?? [];
  }
}
</script>
