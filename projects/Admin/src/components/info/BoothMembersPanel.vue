<template>
  <DashboardPanel title="참여 멤버">
    <div v-for="member in membersList"
         :key="member.name">
      <VAvatar v-if="member.memberImageUrl" :image="getUploadFilePath(member.memberImageUrl)" size="200px" />
      <div>{{ member.name }} - {{ member.role }}</div>
      <div v-if="member.descriptionShort">{{ member.descriptionShort }}</div>
      <a v-if="member.url" :href="member.url" target="_blank">대표 URL</a>

      <VBtn icon="mdi-pencil" variant="outlined" title="멤버 수정" @click="onMemberEditButtonClick(member.id)" />
    </div>

    <div v-if="membersList.length <= 0">멤버 정보가 없습니다.</div>

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
    // TODO: member image url is not included in the booth list API response, but image id does.
    return Object.values(useAdminStore().boothMemberList) ?? [];
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
