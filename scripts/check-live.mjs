// The HTTP half of the Phase 06 gate — rules C1–C6 and the crawlability checks
// that only a real origin can answer.
//
// scripts/check-seo.mjs verifies the documents we generate. This one verifies
// how they are served: redirect chains, status codes, and whether a tracking
// parameter can create a second canonical. Those are Netlify's behaviour, not
// the bundle's, so they cannot be checked at build time.
//
//   node scripts/check-live.mjs                       # against production
//   node scripts/check-live.mjs https://deploy-preview-12--devhub.netlify.app
//
// Run it against a deploy preview before merging, and against production after
// the deploy. Every check maps to a line in the Phase 06 verification table.

const origin = (process.argv[2] ?? 'https://devhub.my').replace(/\/$/, '');
const isProduction = origin === 'https://devhub.my';

const failures = [];
const fail = (rule, target, message) => failures.push(`${rule}  ${target}  ${message}`);

const get = async (url, redirect = 'follow') => {
  try {
    return await fetch(url, { redirect, headers: { 'user-agent': 'devhub-seo-check' } });
  } catch (error) {
    fail('net', url, `request failed: ${error.message}`);
    return null;
  }
};

/** Follows redirects one at a time so the chain length can be counted (C4). */
async function chain(url, limit = 5) {
  const hops = [];
  let current = url;

  for (let i = 0; i < limit; i += 1) {
    const response = await get(current, 'manual');
    if (!response) return hops;

    hops.push({ url: current, status: response.status });
    const location = response.headers.get('location');
    if (!location) return hops;

    current = new URL(location, current).href;
  }

  hops.push({ url: current, status: 'too many hops' });
  return hops;
}

// --- The pages we check in depth -------------------------------------------
const samples = ['/', '/about/', '/contact/', '/services/software-development/', '/technologies/laravel/'];

for (const path of samples) {
  const url = `${origin}${path}`;
  const response = await get(url);
  if (!response) continue;

  if (response.status !== 200) {
    fail('status', path, `returned ${response.status}`);
    continue;
  }

  const html = await response.text();

  // The JSON-LD must be in the raw response, with no JavaScript executed (R9).
  const blocks = (html.match(/<script type="application\/ld\+json">/g) ?? []).length;
  if (blocks !== 1) fail('R1/R9', path, `${blocks} JSON-LD blocks in the server response, expected 1`);

  // Internal links must be discoverable without rendering (Phase 06 layer 10).
  const links = [...html.matchAll(/href="(\/[^"#][^"]*)"/g)]
    .map((match) => match[1])
    .filter((href) => !href.startsWith('/assets/') && !/\.(png|svg|ico|xml|webmanifest)$/.test(href));
  if (links.length < 3) fail('R9', path, `only ${links.length} crawlable internal links`);

  // C6 — self-canonical, on the production host.
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const expected = `https://devhub.my${path}`;
  if (canonical !== expected) fail('C6', path, `canonical is ${canonical}, expected ${expected}`);
}

// --- C5: a tracking parameter must not create a second canonical -----------
const tracked = await get(`${origin}/services/software-development/?utm_source=test`);
if (tracked) {
  const canonical = (await tracked.text()).match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (canonical !== 'https://devhub.my/services/software-development/') {
    fail('C5', '?utm_source=test', `canonical picked up the query string: ${canonical}`);
  }
}

// --- A missing page must return a real 404, not 200 ------------------------
const missing = await get(`${origin}/tidak-wujud/`);
if (missing && missing.status !== 404) {
  fail('404', '/tidak-wujud/', `returned ${missing.status}, expected 404 — the SPA fallback is back`);
}

// --- llms.txt is Markdown, not the app shell -------------------------------
const llms = await get(`${origin}/llms.txt`);
if (llms) {
  const body = await llms.text();
  if (body.trimStart().startsWith('<!doctype') || body.includes('<html')) {
    fail('P16', '/llms.txt', 'served HTML — the file does not exist and the fallback answered');
  } else if (!body.startsWith('# ')) {
    fail('P16', '/llms.txt', 'does not begin with a single H1');
  }
}

// --- sitemap and robots ----------------------------------------------------
const sitemap = await get(`${origin}/sitemap.xml`);
if (sitemap) {
  if (sitemap.status !== 200) fail('S1', '/sitemap.xml', `returned ${sitemap.status}`);
  else {
    const xml = await sitemap.text();
    if (!xml.startsWith('<?xml')) fail('S1', '/sitemap.xml', 'is not XML');

    // S1/S2 over every URL in the sitemap, not a sample — the gate is explicit
    // that sampling is not enough here.
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    for (const loc of urls) {
      const target = isProduction ? loc : loc.replace('https://devhub.my', origin);
      const hops = await chain(target);
      const last = hops[hops.length - 1];

      if (hops.length > 1) fail('S1', loc, `redirects (${hops.length} hops) instead of returning 200`);
      if (last?.status !== 200) fail('S1', loc, `returned ${last?.status}`);
    }
  }
}

const robots = await get(`${origin}/robots.txt`);
if (robots) {
  const body = await robots.text();
  if (!/^Sitemap:\s*https:\/\/devhub\.my\/sitemap\.xml$/m.test(body)) {
    fail('P12', '/robots.txt', 'does not reference the sitemap');
  }
}

// --- C1–C4: every URL variant reaches the canonical in exactly one hop ------
//
// Only meaningful against the real domain: a deploy preview has no www record
// and no apex redirect to test.
if (isProduction) {
  const variants = [
    'http://devhub.my/services/software-development/',
    'http://www.devhub.my/services/software-development/',
    'https://www.devhub.my/services/software-development/',
    'https://devhub.my/services/software-development',
  ];

  for (const variant of variants) {
    const hops = await chain(variant);
    const redirects = hops.filter((hop) => typeof hop.status === 'number' && hop.status >= 300 && hop.status < 400);
    const last = hops[hops.length - 1];

    if (redirects.length > 1) {
      fail('C4', variant, `${redirects.length} redirect hops: ${hops.map((h) => h.status).join(' → ')}`);
    }
    if (last?.status !== 200) {
      fail('C1-C3', variant, `ended at ${last?.status}, expected 200`);
    }
    if (last && last.url !== 'https://devhub.my/services/software-development/') {
      fail('C1-C3', variant, `ended at ${last.url}`);
    }
  }
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error(`check-live (${origin}): ${failures.length} failure(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}

console.log(`check-live (${origin}): all checks pass`);
