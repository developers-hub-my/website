import { defineConfig, loadEnv, type Plugin } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { buildBlog } from './scripts/build-blog.mjs';

// Dev-only: keeps src/data/blog.generated.json in step with content/blog while
// the dev server runs, so editing a post hot-reloads the page. Production
// builds get the same data from the prebuild script instead (see package.json)
// — which is also where a broken post must fail the build; here a bad post is
// logged and the previous good index stays loaded, so the server survives a
// half-typed front matter block.
function blogContent(): Plugin {
  const contentDir = path.resolve('content/blog');

  return {
    name: 'devhub-blog-content',
    apply: 'serve',
    configureServer(server) {
      const rebuild = (reason?: string) => {
        try {
          // Drafts are visible in dev only — the site, feed and sitemap never
          // see them.
          const posts = buildBlog({ includeDrafts: true });
          if (reason) server.config.logger.info(`blog: rebuilt ${posts.length} post(s) (${reason})`);
        } catch (error) {
          server.config.logger.error(`blog: ${(error as Error).message}`);
        }
      };

      rebuild();
      server.watcher.add(contentDir);
      server.watcher.on('all', (_event, file) => {
        if (file.startsWith(contentDir) && file.endsWith('.md')) {
          rebuild(path.basename(file));
        }
      });
    },
  };
}

// Dev-only: /admin is a second build entry (admin/index.html), and Vite's SPA
// fallback answers the bare directory URL with the React app before the entry
// is reached. Rewriting the URL keeps /admin working the same in dev as it does
// on Netlify, where dist/admin/index.html is a real file.
function cmsAdmin(): Plugin {
  return {
    name: 'devhub-cms-admin',
    apply: 'serve',
    configureServer(server) {
      // Registered here (not in a post hook) so it runs before the fallback.
      server.middlewares.use((req, res, next) => {
        // Redirect rather than rewrite, so the document URL keeps its trailing
        // slash — the same thing Netlify does for a directory. Serving /admin
        // directly would resolve the page's relative URLs against the root.
        if (req.url === '/admin') {
          res.writeHead(301, { Location: '/admin/' });
          res.end();
          return;
        }

        if (req.url === '/admin/') {
          req.url = '/admin/index.html';
        }

        next();
      });
    },
  };
}

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
  plugins: [react(), tailwindcss(), metaPixelNoscript(mode), blogContent(), cmsAdmin()],
  // Expose CRM_INTAKE_CHANNEL_API (exact name, owner wants it VITE_-free) to
  // client code alongside the standard VITE_ prefix. Never widen this to ''
  // — that would leak every build-environment variable into the bundle.
  envPrefix: ['VITE_', 'CRM_INTAKE_CHANNEL_API'],
  build: {
    rollupOptions: {
      // Two pages: the marketing SPA and the CMS. Keeping /admin in the build
      // (rather than as a static file in public/) is what lets Tailwind
      // process admin/admin.css — public/ is copied verbatim, never compiled.
      input: {
        main: path.resolve('index.html'),
        admin: path.resolve('admin/index.html'),
      },
    },
  },
  // The prerender pass builds src/entry-server.tsx on its own, via
  // vite.ssr.config.ts — Vite 8 builds both environments from one config, so
  // the HTML inputs above would otherwise be handed to the SSR environment,
  // which rejects them.
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
