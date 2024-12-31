<template>
  <div>
    <div v-ripple
         class="d-flex align-center pa-2"
         style="cursor: pointer"
         @click="_expanded = !_expanded">
      <h4 class="flex-grow-1 text-h4 text-left font-weight-medium">{{ heading }}</h4>

      <VIcon :icon="_expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
             size="large"
             class="pa-2" />
    </div>

    <VDivider class="pb-2" />

    <VExpandTransition>
      <div v-show="_expanded"
           class="w-100">
        <slot />
      </div>
    </VExpandTransition>
  </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from "vue-facing-decorator";

@NuxtComponent({})
export default class ExpandableContent extends Vue {
  @Model({ type: Boolean, default: false })
  get expanded(): boolean { return this._expanded; }
  set expanded(value: boolean) { this._expanded = value; }

  @Prop({ type: String, required: true }) declare readonly heading: string;

  _expanded: boolean = true;
}
</script>
