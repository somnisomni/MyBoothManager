<template>
  <VApp>
    <VAppBar class="pr-6"
             :class="{ 'pl-6': navPersistent }">
      <VAppBarNavIcon v-if="!navPersistent" @click.stop="navOpen = !navOpen" />

      <VAppBarTitle class="ml-0">Booth Administration</VAppBarTitle>

      <VSelect density="compact" hide-details />
    </VAppBar>

    <VNavigationDrawer v-model="navOpen"
                       :permanent="navPersistent">
      <VList nav>
        <VListItem prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
                  :to="{ name: 'admin' }" exact />
        <VListItem prepend-icon="mdi-chart-bar" title="Analytics" value="analytics"
                  :to="{ name: 'admin-analytics' }" exact />
        <VListItem prepend-icon="mdi-store" title="Goods" value="goods"
                  :to="{ name: 'admin-goods' }" exact />
        <VSpacer />
        <VListItem prepend-icon="mdi-arrow-left" title="Go to booth view page" value="booth_view_page" />
      </VList>
    </VNavigationDrawer>

    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>

<script lang="ts">
import { unref } from "vue";
import { Vue, Component } from "vue-facing-decorator";
import { useDisplay } from "vuetify";

@Component({})
export default class BoothAdminRoot extends Vue {
  _navOpen = false;

  set navOpen(value: boolean) { this._navOpen = value; }
  get navOpen() {
    if(this.navPersistent) return true;
    return this._navOpen;
  }

  get navPersistent() {
    return unref(useDisplay().mdAndUp);
  }
}
</script>
