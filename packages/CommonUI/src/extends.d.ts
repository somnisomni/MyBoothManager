export { };

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $imageUrlResolver: (rawPath?: string | null) => string | null;
  }
}
