<template>
  <VSheet class="panel"
          :min-width="minWidth"
          :elevation="elevation"
          rounded="lg">
    <div v-if="title" class="title"><span>{{ title }}</span></div>

    <div class="contents">
      <slot></slot>
    </div>
  </VSheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class DashboardPanel extends Vue {
  @Prop({ default: "auto", required: false }) minWidth!: string | number;
  @Prop({ default: 6, required: false }) elevation!: number;
  @Prop({ default: null }) title!: string | null;
}
</script>

<style lang="scss" scoped>
.panel {
  overflow: hidden;

  .title {
    display: flex;
    position: relative;
    font-size: 2em;
    font-weight: 800;
    padding-left: 0.66em;
    padding-right: 1em;
    text-transform: uppercase;

    & > span {
      padding-top: 0.25em;
    }

    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      width: 0.25em;
      height: 100%;
      left: 0;
      background-color: #333;
    }
  }

  .contents {
    padding: 1em;
  }
}
</style>
