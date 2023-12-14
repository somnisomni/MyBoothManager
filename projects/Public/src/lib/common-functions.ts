export function getUploadFilePath(filePath: string) {
  return new URL(`${import.meta.env.VITE_MBM_API_SERVER_URL!}/${import.meta.env.VITE_MBM_API_SERVER_UPLOADS_PATH ?? "uploads"}/${filePath}`).toString();
}
