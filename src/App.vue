<template>
  <RouterView />
</template>

<script lang="ts">
import { RouterView } from "vue-router";
import { Vue, Component } from "vue-facing-decorator";

@Component
export default class App extends Vue { }
</script>
