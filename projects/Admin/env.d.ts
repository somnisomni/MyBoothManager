/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE__APP_VERSION: string;
  VITE__GIT_HASH: string | null;

  VITE_MBM_API_SERVER_URL: string;
  VITE_MBM_PUBLIC_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
