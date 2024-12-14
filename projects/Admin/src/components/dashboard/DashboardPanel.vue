<template>
  <VSheet class="panel"
          :minWidth="minWidth"
          :elevation="realElevation"
          rounded="lg"
          @pointerenter="hover = true"
          @pointerleave="hover = false">
    <div v-if="title"
         class="title">
      <span>{{ title }}</span>
    </div>

    <div class="contents">
      <slot />
    </div>
  </VSheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class DashboardPanel extends Vue {
  @Prop({ default: "auto", required: false }) declare readonly minWidth: string | number;
  @Prop({ default: 4, required: false }) declare readonly elevation: number;
  @Prop({ default: null }) declare readonly title: string | null;

  hover: boolean = false;

  get realElevation(): number {
    if(this.hover) {
      return this.elevation + 4;
    } else {
      return this.elevation;
    }
  }
}
</script>

<style lang="scss" scoped>
.panel {
  overflow: hidden;
  transition: box-shadow 0.33s;

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
