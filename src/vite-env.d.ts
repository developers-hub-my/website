/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMPANY_PROFILE_URL: string;
  readonly VITE_GATHERHUB_ORG_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
