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
  ) {
    this.run();
  }

  public async run() {
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

  public dispose() {
    if(this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.disposed = true;
    }
  }
}
