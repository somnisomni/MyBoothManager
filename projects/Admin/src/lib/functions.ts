export function getUploadFileUrl(uploadPath: string | null | undefined): string | null {
  if(!uploadPath) {
    return null;
  }

  return new URL(`${import.meta.env.VITE_MBM_API_SERVER_URL}/${import.meta.env.VITE_MBM_API_SERVER_UPLOADS_PATH ?? "uploads"}/${uploadPath}`).toString();
}
