<template>
  <VApp class="bg-transparent">
    <RouterView />
  </VApp>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";

@Component({})
export default class App extends Vue { }
</script>
