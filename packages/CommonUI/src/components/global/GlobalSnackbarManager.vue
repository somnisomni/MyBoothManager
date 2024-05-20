<template>
  <VSnackbar v-for="context in queue"
             v-model="internalModel[context.id]"
             v-bind="getNormalizedProps(context)"
             ref="activeSnackbars"
             :key="context.id"
             transition="slide-x-reverse-transition"
             contentClass="global-snackbar-content">
    <VLayout class="d-flex flex-row align-center">
      <VIcon v-if="getPrependIcon(context)"
             :icon="getPrependIcon(context)"
             class="mr-2" />

      <div>{{ context.text }}</div>
    </VLayout>
  </VSnackbar>
</template>

<script lang="ts">
import type { ISnackbarContext } from "@/entities";
import type { VSnackbar } from "vuetify/components";
import { Component, Model, Ref, Vue, Watch } from "vue-facing-decorator";

@Component({})
export default class GlobalSnackbarManager extends Vue {
  readonly STACK_MARGIN = 8;

  @Model({ type: Array, required: true }) declare queue: Array<ISnackbarContext>;
  readonly internalModel: Record<string, boolean> = { };

  @Ref("activeSnackbars") readonly activeSnackbars!: Array<VSnackbar>;

  @Watch("queue", { deep: true, immediate: true, flush: "post" })
  async onQueueChange() {
    for(const context of this.queue) {
      if(this.internalModel[context.id] === undefined) {
        this.internalModel[context.id] = true;
      }
    }
  }

  @Watch("internalModel", { deep: true, immediate: true, flush: "post" })
  async onInternalModelChange() {
    for(const key in this.internalModel) {
      if(this.internalModel[key] === false) {
        setTimeout(() => {
          const index = this.queue.findIndex((context) => context.id === key);

          if(index !== -1) {
            this.queue.splice(index, 1);
            delete this.internalModel[key];
          }
        }, 1000);
      }
    }

    await this.$nextTick();
    this.rearrangeSnackbarStack();
  }

  async mounted() { await this.onQueueChange(); }

  rearrangeSnackbarStack() {
    if(!this.activeSnackbars) return;

    let nextTopOffset = 0;
    for(let i = 0; i < this.activeSnackbars.length; i++) {
      const target = this.activeSnackbars[i];

      if(target) {
        if(!(target.location.includes("top") && target.location.includes("right"))) {
          continue;
        }

        if(target.modelValue === true && target.contentEl) {
          target.contentEl.style.marginTop = `${nextTopOffset}px`;
          nextTopOffset += target.contentEl.getBoundingClientRect().height + this.STACK_MARGIN;
        }
      }
    }
  }

  getNormalizedProps(context: ISnackbarContext) {
    let props: ISnackbarContext | Record<string, any> = {
      /* Defaults */
      location: "top right",
      timeout: 5000,
      closeOnContentClick: true,

      /* Overrides */
      ...context,
      text: undefined,
    };

    switch(context.type) {
      case "success":
        props = {
          ...props,
          color: "success",
        };
        break;
      case "error":
        props = {
          ...props,
          color: "error",
        };
        break;
      case "warning":
        props = {
          ...props,
          color: "warning",
        };
        break;
      case "info":
        props = {
          ...props,
          color: "info",
        };
        break;
    }

    if(props.persistent) {
      props = {
        ...props,
        timeout: -1,
        closeOnBack: false,
        closeOnContentClick: false,
      };
    }

    return props;
  }

  getPrependIcon(context: ISnackbarContext) {
    if(context.prependIcon)
      return context.prependIcon;

    switch(context.type) {
      case "success":
        return "mdi-check-circle";
      case "error":
        return "mdi-alert-circle";
      case "warning":
        return "mdi-alert";
      case "info":
        return "mdi-information";
    }

    return undefined;
  }
}
</script>

<style lang="scss">
.global-snackbar-content {
  transition-property: opacity, transform, margin-top;
  transition-duration: 0.33s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1);
}
</style>
