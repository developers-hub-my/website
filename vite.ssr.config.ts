import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Separate config for the prerender bundle.
//
// The main config declares two HTML inputs (the site and the CMS). Vite 8
// builds every environment from one config, and the SSR environment refuses an
// HTML entry — so the server build gets its own file rather than a pile of
// conditionals in the shared one.
//
// Output goes to dist-ssr/, which scripts/prerender.mjs imports and nothing
// deploys. `emptyOutDir` is safe here precisely because it is not dist/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'CRM_INTAKE_CHANNEL_API'],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-ssr',
    emptyOutDir: true,
  },
});
