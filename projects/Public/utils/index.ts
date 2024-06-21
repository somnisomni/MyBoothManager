export function getUploadFileUrl(filePath: string | null | undefined) {
  if(!filePath) return null;

  return new URL(`${useRuntimeConfig().public.apiServerUrl}/${useRuntimeConfig().public.apiServerUploadsPath}/${filePath}`).toString();
}

export class IntervalRunner {
  private disposed: boolean = false;
  private requestId: number | null = null;
  private lastExecutedTimestamp: number = 0;

  constructor(
    private readonly callback: () => void,
    private readonly interval: number = 1000,
    private readonly immediate: boolean = true,
  ) {
    if(!this.immediate) {
      this.lastExecutedTimestamp = Date.now();
    }

    this.run();
  }

  public run() {
    if(this.disposed) return;

    this.requestId = window.requestAnimationFrame(() => {
      const now = Date.now();

      if(this.lastExecutedTimestamp + this.interval <= now) {
        this.lastExecutedTimestamp = now;
        this.callback();
      }

      this.run();
    });
  }

  public runImmediately() {
    this.lastExecutedTimestamp = 0;
  }

  public dispose() {
    if(this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.disposed = true;
    }
  }
}
