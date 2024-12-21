<template>
  <div class="root">
    <VAppBar class="pr-6"
             :class="{ 'pl-6': navPersistent }">
      <VAppBarNavIcon v-if="!navPersistent" @click.stop="navOpen = !navOpen" title="내비게이션 메뉴 전환" />

      <VAppBarTitle class="ml-1"><strong>{{ APP_NAME }}</strong> | 부스 관리</VAppBarTitle>

      <BoothSelectionArea />
    </VAppBar>

    <VNavigationDrawer v-model="navOpen"
                       :permanent="navPersistent"
                       class="navdrawer-flex">
      <VList v-model:opened="navOpenedMenuGroups"
             nav
             color="secondary"
             class="overflow-y-auto">
        <VListItem value="pos"
                   prepend-icon="mdi-cash-register"
                   title="현장 판매 모드 (POS)"
                   :to="{ name: 'admin-pos' }"
                   exact
                   :disabled="!currentBoothIsOpened"
                   :subtitle="!currentBoothIsOpened ? '부스가 운영 중이어야 합니다.' : undefined" />

        <VListSubheader>관리</VListSubheader>
        <VListItem value="dashboard"
                   prepend-icon="mdi-view-dashboard"
                   title="대시보드"
                   :to="{ name: 'admin' }"
                   exact />
        <VListGroup value="info-group">
          <template #activator="{ props }">
            <VListItem v-bind="props"
                       prepend-icon="mdi-store-cog"
                       append-icon="null"
                       class="no-interaction"
                       :active="false"
                       title="부스 정보" />
          </template>

          <VListItem value="info"
                     title="부스 등록 정보"
                     :to="{ name: 'admin-info-info' }"
                     exact
                     density="compact" />
          <VListItem value="notice"
                     title="공지 사항"
                     :to="{ name: 'admin-info-notice' }"
                     exact
                     density="compact" />
          <VListItem value="member"
                     title="멤버"
                     :to="{ name: 'admin-info-member' }"
                     exact
                     density="compact" />
          <VListItem value="banner-image"
                     title="배너 이미지"
                     :to="{ name: 'admin-info-banner-image' }"
                     exact
                     density="compact" />
          <VListItem value="info-image"
                     title="인포 이미지"
                     :to="{ name: 'admin-info-info-image' }"
                     exact
                     density="compact" />
        </VListGroup>
        <VListItem value="goods"
                   prepend-icon="mdi-gift-open"
                   title="굿즈"
                   :to="{ name: 'admin-goods' }"
                   exact />
        <VListItem value="orders"
                   prepend-icon="mdi-receipt-text"
                   title="판매 기록"
                   :to="{ name: 'admin-orders' }"
                   exact />
        <VListItem value="analytics"
                   prepend-icon="mdi-chart-bar"
                   title="통계"
                   :to="{ name: 'admin-analytics' }"
                   exact />
        <VListItem value="closing"
                   prepend-icon="mdi-cash-register"
                   title="정산"
                   :to="{ name: 'admin-closing' }"
                   exact />

        <VDivider />

        <!-- <VListSubheader>도구</VListSubheader>
        <VListItem prepend-icon="mdi-cash" title="굿즈 가격 계산기" value="price_calculator"
                   :to="{ name: 'admin-utility-price-calculator' }" exact />

        <VDivider /> -->

        <VListSubheader>지원</VListSubheader>
        <VListItem prepend-icon="mdi-comment-quote"
                   title="피드백"
                   @click="isFeedbackDialogOpen = true" />
        <VListItem value="help"
                   prepend-icon="mdi-help-circle"
                   title="도움말"
                   :to="{ name: 'admin-support-help' }" />

        <VDivider />

        <VListSubheader>계정</VListSubheader>
        <VListItem density="compact"
                   min-height="30px">
          <div class="d-flex flex-column text-subtitle-2 text-disabled">
            <span>현재 로그인 계정: {{ currentAccount?.name }}</span>
            <span style="font-size: 0.8em">로그인 ID: {{ currentAccount?.loginId }}</span>
          </div>
        </VListItem>
        <VListItem prepend-icon="mdi-logout"
                   title="로그아웃"
                   :href="logoutPageHref" />
      </VList>

      <VSpacer />

      <VList nav class="flex-shrink-0">
        <VListItem density="compact" min-height="30px">
          <div v-if="isDevEnv" class="text-subtitle-2 text-disabled text-center">개발 환경에서 실행 중</div>
          <div v-else-if="isStagingEnv" class="text-subtitle-2 text-disabled text-center">테스트를 위해 배포 중인 사이트입니다. 수시로 기능이 변경되거나 각종 버그 발생, 또는 작동이 멈출 수 있습니다.</div>

          <div class="text-subtitle-2 text-disabled text-center">{{ APP_VERSION }} <small>({{ GIT_HASH }})</small></div>
        </VListItem>
        <VListItem prepend-icon="mdi-open-in-new" title="부스 공개 페이지 열기" :href="boothPublicPageHref" target="_blank"
                   :disabled="currentBoothIsNotPublished"
                   :subtitle="currentBoothIsNotPublished ? '부스가 공개 상태이어야 합니다.' : undefined" />
      </VList>
    </VNavigationDrawer>

    <VMain class="pb-4" style="overflow: hidden">
      <RouterView />
    </VMain>

    <FeedbackDialog v-model="isFeedbackDialogOpen" />
  </div>
</template>

<script lang="ts">
import { APP_NAME, BoothStatus, type IAccount, type IBooth } from "@myboothmanager/common";
import { Vue, Component, Setup, Watch } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/plugins/stores/admin";
import BoothSelectionArea from "@/components/navbar/BoothSelectionArea.vue";
import router from "@/plugins/router";
import { Const } from "@/lib/const";
import FeedbackDialog from "@/components/dialogs/FeedbackDialog.vue";

@Component({
  components: {
    BoothSelectionArea,
    FeedbackDialog,
  },
})
export default class AdminLayout extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly APP_NAME = APP_NAME;
  readonly APP_VERSION = Const.APP_VERSION;
  readonly GIT_HASH = Const.APP_GIT_HASH;

  @Setup(() => useDisplay().mdAndUp)
  declare readonly mdAndUp: boolean;

  @Setup(() => useAdminStore().currentAccount)
  declare readonly currentAccount: IAccount;

  @Setup(() => useAdminStore().currentBooth.booth)
  declare readonly currentBooth: IBooth;

  _navOpen = false;
  logoutPageHref = router.resolve({ name: "logout" }).href || "/logout";

  isFeedbackDialogOpen = false;
  get navOpenedMenuGroups(): string[] {
    return [ "info-group" ];
  }
  set navOpenedMenuGroups(value: string[]) { /* do nothing */ }

  @Watch("navOpenedMenuGroups")
  test() { console.log(this.navOpenedMenuGroups); }

  set navOpen(value: boolean) { this._navOpen = value; }
  get navOpen() {
    if(this.navPersistent) return true;
    return this._navOpen;
  }

  get navPersistent() {
    return this.mdAndUp;
  }

  get currentBoothIsOpened(): boolean {
    return this.currentBooth.status.status === BoothStatus.OPEN;
  }

  get currentBoothIsClosed(): boolean {
    return this.currentBooth.status.status === BoothStatus.CLOSE;
  }

  get currentBoothIsNotPublished(): boolean {
    return !this.currentBooth.status.contentPublished;
  }

  get boothPublicPageHref(): string {
    return `${import.meta.env.VITE_MBM_PUBLIC_URL}/booth/${this.currentBooth.id}`;
  }

  get isDevEnv(): boolean {
    return import.meta.env.DEV;
  }

  get isStagingEnv(): boolean {
    return window.location.hostname.includes("staging");
  }
}
</script>

<style lang="scss" scoped>
.bgimage {
  position: fixed;
  opacity: 0.25;
  z-index: -1;
  width: 50vh;
  right: -2.5%;
  bottom: -7.5%;
}
</style>
