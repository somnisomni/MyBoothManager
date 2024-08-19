<template>
  <span v-if="!stop">
    <span v-if="throttleRemainingSeconds > 0">({{ throttleRemainingSeconds }})</span>
    <span v-else-if="intervalRemainingSeconds > 0">{{ intervalRemainingSeconds }}</span>
  </span>
</template>

<script lang="ts">
import { Model, Prop, Vue } from "vue-facing-decorator";
import { IntervalRunner } from "#imports";

@NuxtComponent({})
export default class IntervalAndThrottle extends Vue {
  @Model({ type: Boolean }) declare throttling: boolean;

  @Prop({ type: Boolean, default: false }) declare readonly stop: boolean;
  @Prop({ type: Number, default: 5 }) declare readonly interval: number;  // in seconds
  @Prop({ type: Number, default: 5 }) declare readonly throttle: number;  // in seconds
  @Prop({ type: Function, required: true }) declare readonly callback: (() => void) | (() => Promise<void>);

  throttleIntervalId: number | null = null;
  throttleRemainingSeconds = -1;

  intervalRunner: IntervalRunner | null = null;
  intervalRemainingSeconds = -1;

  mounted() {
    if(!this.stop && this.interval > 0) {
      this.intervalRunner = new IntervalRunner({
        callback: this.doCallback,
        onSecondTick: this.onIntervalSecondTick,
        interval: this.interval,
      }, false);
    }
  }

  unmounted() {
    this.intervalRunner?.dispose();
    this.intervalRunner = null;
  }

  startThrottle() {
    if(this.throttle <= 0 || this.throttleRemainingSeconds > 0) return;

    this.throttleRemainingSeconds = this.throttle;
    this.throttling = true;

    this.throttleIntervalId = setInterval(() => {
      this.throttleRemainingSeconds--;

      if(this.throttleRemainingSeconds <= 0) {
        clearInterval(this.throttleIntervalId ?? undefined);
        this.throttleIntervalId = null;
        this.throttling = false;
      }
    }, 1000, { });
  }

  async doCallback() {
    if(this.throttling) return;

    try {
      await this.callback();

      // Update last executed timestamp of IntervalRunner for calling from outside
      this.intervalRunner?.updateLastExecutedTimestampToCurrent();
    } finally {
      this.startThrottle();
    }
  }

  onIntervalSecondTick(remainingSeconds: number) {
    this.intervalRemainingSeconds = remainingSeconds;

    if(this.throttleRemainingSeconds <= 0) {
      this.throttling = false;
    }
  }
}
</script>
