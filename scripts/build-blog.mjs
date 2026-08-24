// Bakes `content/blog/*.md` into `src/data/blog.generated.json` (+ the RSS
// feed at `public/rss.xml`). Runs as part of prebuild, before
// generate-sitemap.mjs, which reads the same JSON.
//
// Markdown → HTML happens HERE, at build time, never in the browser: the app
// ships rendered HTML, no markdown parser reaches the bundle, and a malformed
// post fails the build instead of the page. Post HTML is rendered with
// dangerouslySetInnerHTML on purpose — the only source is markdown committed
// to this repo by the team, so it is first-party content, not user input.
//
// In dev the same builder runs from a Vite plugin (see vite.config.ts) and
// watches the content folder, with drafts included so authors can preview
// them. Drafts never reach a production build, the feed or the sitemap.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { PostFrontMatterSchema } from './blog-contract.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(root, 'content/blog');
const OUTPUT_FILE = path.join(root, 'src/data/blog.generated.json');
const FEED_FILE = path.join(root, 'public/rss.xml');

const SITE_URL = 'https://devhub.my';
const SITE_TITLE = 'Developers Hub Blog';
const SITE_DESCRIPTION =
  'Notes on software engineering, developer training and technology practice from the team at Developers Hub Sdn Bhd, Johor Bahru.';
const WORDS_PER_MINUTE = 200;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

class BlogContentError extends Error {}

const fail = (message) => {
  throw new BlogContentError(message);
};

// Highlighting is resolved at build time, so the bundle carries only the
// `hljs-*` class names that index.css styles — not highlight.js itself.
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
  { gfm: true, breaks: false },
);

const slugify = (text) =>
  text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Post-processing the rendered HTML (rather than overriding marked's renderer)
// keeps this independent of marked's renderer signatures, which move between
// major versions.
function decorateHtml(html) {
  return (
    html
      // Deep-linkable section headings — the post page renders no TOC, but
      // shared "#some-heading" links have to land somewhere.
      .replace(
        /<(h[23])>([\s\S]*?)<\/\1>/g,
        (match, tag, inner) => `<${tag} id="${slugify(inner)}">${inner}</${tag}>`,
      )
      // Outbound links open in a new tab; internal ones stay in the SPA.
      .replace(/<a href="(https?:\/\/[^"]+)"/g, (match, href) =>
        href.startsWith(SITE_URL)
          ? match
          : `<a href="${href}" target="_blank" rel="noopener noreferrer"`,
      )
      .replace(/<img /g, '<img loading="lazy" decoding="async" ')
  );
}

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function readPost(fileName) {
  const slug = fileName.replace(/\.md$/, '');

  if (!SLUG_PATTERN.test(slug)) {
    fail(
      `content/blog/${fileName}: file name is the post URL — use lowercase words separated ` +
        'by single hyphens, e.g. "shipping-faster-with-claude-code.md".',
    );
  }

  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);
  const parsed = PostFrontMatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    fail(`content/blog/${fileName}: front matter violates the contract\n${issues}`);
  }

  const body = content.trim();

  if (!body) {
    fail(`content/blog/${fileName}: post has front matter but no body.`);
  }

  const words = body.split(/\s+/).length;

  return {
    slug,
    ...parsed.data,
    draft: parsed.data.draft ?? false,
    tags: [...parsed.data.tags].sort((a, b) => a.localeCompare(b)),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    html: decorateHtml(marked.parse(body)),
  };
}

function renderFeed(posts) {
  const items = posts
    .slice(0, 20)
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
      <description>${escapeXml(post.description)}</description>
    </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-my</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

/**
 * Regenerates the blog data files. Returns the posts it wrote.
 * @param {{ includeDrafts?: boolean }} [options]
 */
export function buildBlog({ includeDrafts = false } = {}) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const all = files.map(readPost);
  const posts = all
    .filter((post) => includeDrafts || !post.draft)
    // Newest first; same-day posts fall back to a stable alphabetical order.
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(posts, null, 2)}\n`);
  fs.writeFileSync(FEED_FILE, renderFeed(posts.filter((post) => !post.draft)));

  return posts;
}

// Direct invocation (prebuild). Imported by vite.config.ts for dev rebuilds,
// where a content error must not take the whole dev server down.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const posts = buildBlog();
    const drafts = fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith('.md')).length - posts.length;
    console.log(
      `build-blog: wrote ${posts.length} post(s) to src/data/blog.generated.json` +
        `${drafts > 0 ? ` (${drafts} draft(s) skipped)` : ''} and public/rss.xml.`,
    );
  } catch (error) {
    console.error(
      error instanceof BlogContentError ? `build-blog: ${error.message}` : error,
    );
    process.exit(1);
  }
}
