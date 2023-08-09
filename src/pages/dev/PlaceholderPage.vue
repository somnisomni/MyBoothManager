<template>
  <main class="pa-4">
    <h1>{{ }}</h1>
    <div>Placeholder Page</div>
    <div>current route: {{ $route.path }}, route name: {{ $route.name }}</div>
    <br />
    <div>Jump to route:</div>
    <VBtn v-for="route in allRoutes"
          :key="route.name"
          @click="$router.push(route.path)"
          class="ma-2">
      {{ route.name }} ( {{ route.path }} )
    </VBtn>
  </main>
</template>

<script lang="ts">
import { unref } from "vue";
import { Component, Vue } from "vue-facing-decorator";
import router from "@/router";

@Component({})
export default class PlaceholderPage extends Vue {
  readonly $router = router;
  readonly $route = unref(router.currentRoute);

  get allRoutes() {
    return this.$router.getRoutes();
  }
}
</script>
