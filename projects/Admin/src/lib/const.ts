export class Const {
  public static get APP_VERSION(): string {
    const version = import.meta.env.VITE__APP_VERSION;

    return version ? `v${version}` : "version unspecified";
  }

  public static get APP_GIT_HASH(): string {
    const hash = import.meta.env.VITE__GIT_HASH;

    return hash ?? "unknown";
  }
}
