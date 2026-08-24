// Blog post front-matter contract — Zod schema.
//
// SINGLE SOURCE OF TRUTH for what an author may put at the top of a
// `content/blog/*.md` file. `.strict()` is deliberate, exactly like
// gatherhub-contract.mjs: a typo'd or invented key must FAIL the build with a
// readable error naming the field, never render `undefined` into a page.
//
// The CMS form in `public/admin/config.yml` mirrors this schema field for
// field. Change one, change the other — otherwise the CMS will happily write
// a post that the next build refuses.
import { z } from 'zod';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// YAML turns an unquoted `2026-08-24` into a Date object, and that is exactly
// how both hand-written posts and the CMS write dates — normalise back to the
// plain YYYY-MM-DD string the rest of the pipeline expects.
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(ISO_DATE, 'expected a YYYY-MM-DD date'),
);

// An optional field the CMS left blank comes back as `''`, not as a missing
// key — treat that as "not set" rather than failing validation on an empty
// string that no author ever typed.
const optional = (schema) =>
  z.preprocess((value) => (value === '' || value === null ? undefined : value), schema.optional());

export const PostFrontMatterSchema = z
  .object({
    /** H1 of the post and the <title> stem. */
    title: z.string().min(1),
    /** Meta description, card excerpt and RSS summary — one sentence or two. */
    description: z.string().min(1),
    /** Publication date, YYYY-MM-DD. Drives ordering and the RSS pubDate. */
    date: isoDate,
    /** Set when a published post is materially revised. */
    updated: optional(isoDate),
    author: z.string().min(1),
    /** Shown under the author's name on the post page, e.g. 'Founder'. */
    authorTitle: optional(z.string().min(1)),
    /** At least one — tags are the only facet on /blog. */
    tags: z.array(z.string().min(1)).min(1),
    /** Site-relative image path, e.g. /images/blog/my-post/cover.webp */
    cover: optional(z.string().startsWith('/', 'cover must be a site-relative path')),
    coverAlt: optional(z.string().min(1)),
    /** Cross-posted elsewhere first? Point search engines at the original. */
    canonical: optional(z.string().url()),
    /** Committed but not published — kept out of the site, RSS and sitemap. */
    draft: optional(z.boolean()),
  })
  .strict();
