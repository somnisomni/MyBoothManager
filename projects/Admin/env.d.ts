/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE__APP_VERSION: string;
  VITE__GIT_HASH: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
