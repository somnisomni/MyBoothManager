<template>
  <DashboardPanel title="참여 멤버">
    <div v-if="membersList.length > 0" class="d-flex flex-row flex-wrap justify-center">
      <VSlideYTransition group leave-absolute>
        <BoothMemberItem v-for="member in membersList"
                         :key="member.id"
                         :memberData="member"
                         :imageUrlResolver="getUploadFilePath"
                         editable
                         @click="onMemberEditButtonClick" />
      </VSlideYTransition>
    </div>
    <div v-else class="text-center text-grey">등록된 멤버 정보가 없습니다.</div>

    <VLayout class="d-flex justify-end align-center w-100">
      <VBtn icon="mdi-plus" variant="outlined" title="멤버 추가" @click="onMemberAddButtonClick" />
    </VLayout>

    <BoothMemberManageDialog v-model="memberManageDialogShown"
                             :editMode="memberManageDialogEditMode"
                             :boothMemberId="memberManageDialogMemberId"
                             @updated="$forceUpdate()"
                             @deleted="$forceUpdate()" />
  </DashboardPanel>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { getUploadFilePath } from "@/lib/functions";
import DashboardPanel from "../dashboard/DashboardPanel.vue";
import BoothMemberManageDialog from "../dialogs/BoothMemberManageDialog.vue";

@Component({
  components: {
    DashboardPanel,
    BoothMemberManageDialog,
  },
})
export default class BoothMembersPanel extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  memberManageDialogShown = false;
  memberManageDialogEditMode = false;
  memberManageDialogMemberId: number | null = null;

  get membersList(): Array<IBoothMember> {
    return Object.values(useAdminStore().currentBooth.boothMembers ?? {}) ?? [];
  }

  onMemberAddButtonClick() {
    this.memberManageDialogShown = true;
    this.memberManageDialogEditMode = false;
    this.memberManageDialogMemberId = null;
  }

  onMemberEditButtonClick(id: number) {
    this.memberManageDialogShown = true;
    this.memberManageDialogEditMode = true;
    this.memberManageDialogMemberId = id;
  }
}
</script>
