<template>
  <VSheet class="panel"
          :max-width="maxWidth"
          :elevation="elevation"
          rounded="lg">
    <div class="title"><span>{{ title }}</span></div>

    <div class="contents">
      <slot></slot>
    </div>
  </VSheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class DashboardPanel extends Vue {
  @Prop({ default: 400, required: false }) maxWidth!: number;
  @Prop({ default: 6, required: false }) elevation!: number;
  @Prop({ default: "Panel", required: true }) title!: string;
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
