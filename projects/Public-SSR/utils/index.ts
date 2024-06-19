export function getUploadFileUrl(filePath: string | null | undefined) {
  if(!filePath) return null;

  return new URL(`${useRuntimeConfig().public.apiServerUrl}/${useRuntimeConfig().public.apiServerUploadsPath}/${filePath}`).toString();
}
