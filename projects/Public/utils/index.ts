export function getUploadFileUrl(filePath: string | null | undefined) {
  if(!filePath) return null;

  return new URL(`${useRuntimeConfig().public.apiServerUrl}/${useRuntimeConfig().public.apiServerUploadsPath}/${filePath}`).toString();
}

export class IntervalRunner {
  private disposed: boolean = false;
  private requestId: number | null = null;
  private lastExecutedTimestamp: number = 0;
  private lastSecondTickTimestamp: number = 0;

  constructor(
    private readonly options: {
      callback: () => void | Promise<void>,
      onSecondTick?: (remainingSeconds: number) => void,
      interval?: number,  // in seconds
    },
    immediate: boolean = true,
  ) {
    if(!immediate) {
      this.lastExecutedTimestamp = this.lastSecondTickTimestamp = Date.now();
    }

    this.run();
  }

  private get normalizedOptions() {
    return {
      onSecondTick: () => {},
      interval: 1,
      ...this.options,
    } as Required<typeof this.options>;
  }

  public run() {
    if(this.disposed) return;

    this.requestId = window.requestAnimationFrame(async () => {
      const now = Date.now();
      const intervalMs = this.normalizedOptions.interval * 1000;

      if(this.lastSecondTickTimestamp + 1000 <= now) {
        const remainingSeconds = Math.ceil((this.lastExecutedTimestamp + intervalMs - now) / 1000);

        this.normalizedOptions.onSecondTick(remainingSeconds);
        this.lastSecondTickTimestamp = now;
      }

      if(this.lastExecutedTimestamp + intervalMs <= now) {
        await this.normalizedOptions.callback();
        this.lastExecutedTimestamp = now;
      }

      this.run();
    });
  }

  public runImmediately() {
    this.lastExecutedTimestamp = this.lastSecondTickTimestamp = 0;
  }

  public updateLastExecutedTimestampToCurrent() {
    this.lastExecutedTimestamp = this.lastSecondTickTimestamp = Date.now();
  }

  public dispose() {
    if(this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.disposed = true;
    }
  }
}
