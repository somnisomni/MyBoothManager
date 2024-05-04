<template>
  <div class="root">
    <VAppBar class="pr-6"
             :class="{ 'pl-6': navPersistent }">
      <VAppBarNavIcon v-if="!navPersistent" @click.stop="navOpen = !navOpen" title="내비게이션 메뉴 전환" />

      <VAppBarTitle class="ml-1"><strong>MyBoothManager</strong> | 부스 관리</VAppBarTitle>

      <BoothSelectionArea />
    </VAppBar>

    <VNavigationDrawer v-model="navOpen"
                       :permanent="navPersistent"
                       class="navdrawer-flex">
      <VList nav class="overflow-y-auto">
        <VListItem prepend-icon="mdi-cash-register" title="현장 판매 모드 (POS)" value="pos"
                   :to="{ name: 'admin-pos' }" exact
                   :disabled="!currentBoothIsOpened"
                   :subtitle="!currentBoothIsOpened ? '부스가 운영 중이어야 합니다.' : undefined" />

        <VListSubheader>관리</VListSubheader>
        <VListItem prepend-icon="mdi-view-dashboard" title="대시보드" value="dashboard"
                   :to="{ name: 'admin' }" exact />
        <VListItem prepend-icon="mdi-store-cog" title="부스 정보 / 인포" value="info"
                   :to="{ name: 'admin-info' }" exact />
        <VListItem prepend-icon="mdi-gift-open" title="굿즈" value="goods"
                   :to="{ name: 'admin-goods' }" exact />
        <VListItem prepend-icon="mdi-receipt-text" title="판매 기록" value="orders"
                   :to="{ name: 'admin-orders' }" exact />
        <VListItem prepend-icon="mdi-chart-bar" title="통계" value="analytics"
                   :to="{ name: 'admin-analytics' }" exact />
        <VListItem prepend-icon="mdi-cash-register" title="정산" value="closing"
                   :to="{ name: 'admin-closing' }" exact />

        <VDivider />

        <!-- <VListSubheader>도구</VListSubheader>
        <VListItem prepend-icon="mdi-cash" title="굿즈 가격 계산기" value="price_calculator"
                   :to="{ name: 'admin-utility-price-calculator' }" exact />

        <VDivider /> -->

        <VListSubheader>계정</VListSubheader>
        <VListItem density="compact" min-height="30px">
          <span class="text-subtitle-2 text-disabled">로그인 계정: {{ currentAccount?.name }}</span>
        </VListItem>
        <VListItem prepend-icon="mdi-logout" title="로그아웃" value="logout"
                   :href="logoutPageHref" />
      </VList>

      <VSpacer />

      <VList nav class="flex-shrink-0">
        <VListItem density="compact" min-height="30px">
          <div v-if="isDevEnv" class="text-subtitle-2 text-disabled text-center">개발 환경에서 실행 중</div>
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
  </div>
</template>

<script lang="ts">
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { Vue, Component, Setup } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/plugins/stores/admin";
import BoothSelectionArea from "@/components/navbar/BoothSelectionArea.vue";
import router from "@/plugins/router";
import { Const } from "@/lib/const";

@Component({
  components: {
    BoothSelectionArea,
  },
})
export default class BoothAdminLayout extends Vue {
  readonly BoothStatus = BoothStatus;
  readonly APP_VERSION = Const.APP_VERSION;
  readonly GIT_HASH = Const.APP_GIT_HASH;

  @Setup(() => useDisplay().mdAndUp)
  readonly mdAndUp!: boolean;

  _navOpen = false;
  logoutPageHref = router.resolve({ name: "logout" }).href || "/logout";

  set navOpen(value: boolean) { this._navOpen = value; }
  get navOpen() {
    if(this.navPersistent) return true;
    return this._navOpen;
  }

  get navPersistent() {
    return this.mdAndUp;
  }

  get currentBooth(): IBooth {
    return useAdminStore().currentBooth.booth!;
  }

  get currentBoothIsOpened(): boolean {
    return this.currentBooth.status.status === BoothStatus.OPEN;
  }

  get currentBoothIsClosed(): boolean {
    return this.currentBooth.status.status === BoothStatus.CLOSE;
  }

  get currentBoothIsNotPublished(): boolean {
    return this.currentBooth.status.status === BoothStatus.PREPARE && !this.currentBooth.status.contentPublished;
  }

  get boothPublicPageHref(): string {
    return `${import.meta.env.VITE_MBM_PUBLIC_URL}/booth/${useAdminStore().currentBooth.booth!.id}`;
  }

  get currentAccount() {
    return useAdminStore().currentAccount;
  }

  get isDevEnv(): boolean {
    return import.meta.env.DEV;
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
