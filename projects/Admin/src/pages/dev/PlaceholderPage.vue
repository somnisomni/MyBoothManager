<template>
  <main class="pa-4">
    <h1>Not found or not yet implemented route</h1>
    <div>Placeholder Page</div>
    <div>current route: {{ $route.path }}, route name: {{ $route.name }}</div>
    <br>
    <div>Jump to route:</div>
    <VBtn v-for="route in allRoutes"
          :key="route.name"
          class="ma-2"
          @click="$router.push(route.path)">
      {{ route.name }} ( {{ route.path }} )
    </VBtn>
  </main>
</template>

<script lang="ts">
import type { RouteRecord } from "vue-router";
import { unref } from "vue";
import { Component, Vue } from "vue-facing-decorator";
import router from "@/plugins/router";

@Component({})
export default class PlaceholderPage extends Vue {
  readonly $router = router;
  readonly $route = unref(router.currentRoute);

  get allRoutes(): RouteRecord[] {
    return this.$router.getRoutes();
  }
}
</script>
