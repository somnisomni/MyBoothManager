<template>
  <div class="root">
    <img class="bgimage" src="@/res/images/bgimage_jeomo.png" />

    <VAppBar class="pr-6"
             :class="{ 'pl-6': navPersistent }">
      <VAppBarNavIcon v-if="!navPersistent" @click.stop="navOpen = !navOpen" title="내비게이션 메뉴 전환" />

      <VAppBarTitle class="ml-1"><strong>MyBoothManager</strong> | 부스 관리</VAppBarTitle>

      <BoothSelectionArea />
    </VAppBar>

    <VNavigationDrawer v-model="navOpen"
                       :permanent="navPersistent"
                       class="main-navdrawer">
      <VList nav>
        <VListItem prepend-icon="mdi-cash-register" title="현장 판매 모드 (POS)" value="storemode"
                   :to="{ name: 'admin-pos' }" exact />

        <VListSubheader>관리</VListSubheader>
        <VListItem prepend-icon="mdi-view-dashboard" title="대시보드" value="dashboard"
                   :to="{ name: 'admin' }" exact />
        <VListItem prepend-icon="mdi-store" title="굿즈" value="goods"
                   :to="{ name: 'admin-goods' }" exact />
        <VListItem prepend-icon="mdi-chart-bar" title="통계" value="analytics"
                   :to="{ name: 'admin-analytics' }" exact />

        <VDivider />

        <VListSubheader>도구</VListSubheader>
        <VListItem prepend-icon="mdi-cash" title="굿즈 가격 계산기" value="price_calculator"
                   :to="{ name: 'admin-utility-price-calculator' }" exact />

        <VDivider />

        <VListSubheader>계정</VListSubheader>
        <VListItem prepend-icon="mdi-logout" title="로그아웃" value="logout"
                   :href="logoutPageHref" />
      </VList>

      <VSpacer />

      <VList nav>
        <VListItem prepend-icon="mdi-arrow-left" title="부스 페이지로 이동" value="booth_view_page" />
      </VList>
    </VNavigationDrawer>

    <VMain style="height: 100vh; overflow-y: auto">
      <RouterView />
    </VMain>
  </div>
</template>

<script lang="ts">
import type { IBooth } from "@myboothmanager/common";
import { unref } from "vue";
import { Vue, Component } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { useAdminStore } from "@/stores/admin";
import BoothSelectionArea from "@/components/navbar/BoothSelectionArea.vue";
import router from "@/router";

@Component({
  components: {
    BoothSelectionArea,
  },
})
export default class BoothAdminLayout extends Vue {
  _navOpen = false;
  logoutPageHref = router.resolve({ name: "logout" }).href || "/logout";

  set navOpen(value: boolean) { this._navOpen = value; }
  get navOpen() {
    if(this.navPersistent) return true;
    return this._navOpen;
  }

  get navPersistent() {
    return unref(useDisplay().mdAndUp);
  }

  get selectedBooth(): number {
    return useAdminStore().currentBoothId;
  }

  set selectedBooth(value: number) {
    useAdminStore().currentBoothId = value;
  }

  get boothList(): IBooth[] {
    return Object.values(useAdminStore().boothList);
  }
}
</script>

<style lang="scss">
/* Workaround */
.main-navdrawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss" scoped>
.bgimage {
  position: absolute;
  opacity: 0.25;
  z-index: -1;
  width: 50vh;
  right: -2.5%;
  bottom: -7.5%;
}
</style>
