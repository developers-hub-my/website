import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose SUBSCRIBE_URL (exact name, owner wants it VITE_-free) to client
  // code alongside the standard VITE_ prefix. Never widen this to '' — that
  // would leak every build-environment variable into the bundle.
  envPrefix: ['VITE_', 'SUBSCRIBE_URL'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
