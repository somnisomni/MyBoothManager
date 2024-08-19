<template>
  <div class="bg-transparent position-fixed d-flex flex-column right-0 bottom-0 ma-4"
       style="z-index: 1000">
    <VBtn class="rounded-pill px-2"
          size="large"
          variant="elevated"
          prepend-icon="mdi-refresh"
          stacked
          :color="isUpdateThrottling ? 'grey' : 'primary'"
          :disabled="isUpdateThrottling || updateInProgress"
          :loading="updateInProgress"
          @click="onUpdateButtonClick">
      <small>
        <IntervalAndThrottle v-model="isUpdateThrottling"
                             ref="intervalAndThrottle"
                             class="d-inline-block"
                             style="width: 2em"
                             :interval="interval"
                             :throttle="5"
                             :stop="!autoRefreshEnabled"
                             :callback="wrapCallback" />
      </small>

      <VTooltip activator="parent"
                location="top">
        <span>정보 자동 업데이트</span>
      </VTooltip>
    </VBtn>
  </div>
</template>

<script lang="ts">
import type IntervalAndThrottle from "../common/IntervalAndThrottle.vue";
import { Prop, Ref, Vue, Watch } from "vue-facing-decorator";

@NuxtComponent({})
export default class DataUpdateFloatingButton extends Vue {
  @Prop({ type: Number, default: 60 }) declare readonly interval: number;  // in seconds
  @Prop({ type: Function, required: true, default: () => {} }) declare readonly fetchCallback: (() => void) | (() => Promise<void>);

  isUpdateThrottling = false;
  updateInProgress = true;

  @Ref("intervalAndThrottle")
  declare readonly intervalAndThrottle: InstanceType<typeof IntervalAndThrottle>;

  get autoRefreshEnabled(): boolean { return useLocalStore().boothPageSettings.enableAutoRefresh; }
  set autoRefreshEnabled(value: boolean) { useLocalStore().boothPageSettings.enableAutoRefresh = value; }

  mounted() {
    this.updateInProgress = false;

    /* *** Force call auto refresh changed handler *** */
    this.onAutoRefreshEnabledChanged(this.autoRefreshEnabled);
  }

  @Watch("autoRefreshEnabled")
  onAutoRefreshEnabledChanged(value: boolean) {
    if(value) {
      console.info("Start polling booth data every", this.interval, "seconds");
    } else {
      console.info("Stop polling booth data");
    }
  }

  async wrapCallback() {
    this.updateInProgress = true;

    try {
      await this.fetchCallback();
    } finally {
      this.updateInProgress = false;
    }
  }

  onUpdateButtonClick() {
    if(this.intervalAndThrottle) {
      this.intervalAndThrottle.doCallback();
    }
  }
}
</script>
