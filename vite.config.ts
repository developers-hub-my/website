import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Injects the Meta Pixel's no-JS <noscript> fallback into index.html, and only
// when VITE_META_PIXEL_ID is set — no env var, no pixel markup at all. Keeping
// it out of index.html means the ID lives in exactly one place (the build env)
// instead of being hardcoded alongside src/lib/meta-pixel.ts.
function metaPixelNoscript(mode: string): Plugin {
  // loadEnv covers both .env files and the real build environment (Netlify).
  const pixelId = loadEnv(mode, '.', 'VITE_').VITE_META_PIXEL_ID;

  return {
    name: 'devhub-meta-pixel-noscript',
    transformIndexHtml() {
      if (!pixelId) return [];
      return [
        {
          tag: 'noscript',
          injectTo: 'body-prepend',
          children: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`,
        },
      ];
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), metaPixelNoscript(mode)],
  // Expose CRM_INTAKE_CHANNEL_API (exact name, owner wants it VITE_-free) to
  // client code alongside the standard VITE_ prefix. Never widen this to ''
  // — that would leak every build-environment variable into the bundle.
  envPrefix: ['VITE_', 'CRM_INTAKE_CHANNEL_API'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
