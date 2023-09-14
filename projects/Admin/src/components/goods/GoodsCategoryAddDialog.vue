<template>
  <CommonDialog v-model="open">
    <h1>TODO</h1>
  </CommonDialog>
</template>

<script lang="ts">
import { Vue, Component, Model } from "vue-facing-decorator";

@Component({})
export default class GoodsCategoryAddDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;
}
</script>
