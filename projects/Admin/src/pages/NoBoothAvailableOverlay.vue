<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center flex-column bg-background">
    <div class="text-h4">계정에 등록된 부스가 없습니다.</div>
    <div class="text-h5 mt-2">아래 버튼을 클릭해 새로운 부스를 추가하세요!</div>

    <VBtn class="mt-4"
          size="x-large"
          color="primary"
          @click="boothAddDialogOpened = true">
      <span>부스 추가</span>
    </VBtn>
    <VBtn class="mt-2"
          size="large"
          :to="{ name: 'logout' }">
      <span>로그아웃</span>
    </VBtn>
  </VContainer>

  <BoothManageDialog v-model="boothAddDialogOpened"
                     :editMode="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import BoothManageDialog from "@/components/dialogs/BoothManageDialog.vue";

@Component({
  components: {
    BoothManageDialog,
  },
})
export default class NoBoothAvailableOverlay extends Vue {
  boothAddDialogOpened = false;
}
</script>
