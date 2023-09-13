<template>
  <FirstLoad v-if="!firstLoadCompleted" @complete="firstLoadCompleted = true" />
  <RouterView v-if="firstLoadCompleted" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import FirstLoad from "./BoothAdminFirstLoad.vue";

@Component({
  components: {
    FirstLoad,
  },
})
export default class BoothAdminRoot extends Vue {
  firstLoadCompleted: boolean = false;
}
</script>
