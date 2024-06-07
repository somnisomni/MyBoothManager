/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE__APP_VERSION: string;
  VITE__GIT_HASH?: string;
  VITE_MBM_API_SERVER_URL?: string;
  VITE_MBM_API_SERVER_UPLOADS_PATH?: string;
  VITE_PUBLIC_BASE_PATH?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
