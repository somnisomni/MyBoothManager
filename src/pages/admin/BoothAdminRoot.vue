<template>
  <VApp>
    <VAppBar class="px-6">
      <VAppBarTitle class="ml-0">Booth Administration</VAppBarTitle>

      <VSelect density="compact" hide-details />
    </VAppBar>

    <VNavigationDrawer permanent>
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
import { Vue, Component } from "vue-facing-decorator";

@Component({})
export default class BoothAdminRoot extends Vue { }
</script>
