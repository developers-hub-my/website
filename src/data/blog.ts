// Typed view over the build-time blog index.
//
// `blog.generated.json` is written by scripts/build-blog.mjs from the markdown
// in content/blog — never edit it by hand. Everything the pages need is
// already computed there (HTML, reading time, ordering), so this module is
// only types plus a few lookups.

import generated from './blog.generated.json';

export interface Post {
  /** URL segment, taken from the markdown file name. */
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  updated?: string;
  author: string;
  authorTitle?: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  canonical?: string;
  /** Only ever true in dev — drafts are stripped from production builds. */
  draft: boolean;
  readingMinutes: number;
  /** Rendered at build time from trusted, in-repo markdown. */
  html: string;
}

/** Newest first, exactly as the builder ordered them. */
export const posts = generated as Post[];

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
  a.localeCompare(b),
);

// Posts live under /resources/articles/, the path the SOP's URL map assigns to
// Article entities. The markdown still lives in content/blog/ — the file name is
// still the slug, and renaming a file still breaks its URL. Only the prefix
// moved, and /blog/* 301s to the new location.
//
// Trailing slash included, because this value is used directly as a link
// target: rule C4 allows no redirect hops, and a link to
// /resources/articles/x would be 301'd to /resources/articles/x/ on every
// click and every crawl.
export const blogPath = (post: Post): string => `/resources/articles/${post.slug}/`;

export const postBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.slug === slug);

export const countByTag = (tag: string): number =>
  posts.filter((post) => post.tags.includes(tag)).length;

/** Posts sharing the most tags with `post`, newest first. */
export const relatedPosts = (post: Post, limit = 3): Post[] =>
  posts
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      other,
      shared: other.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);

// Dates are authored as plain calendar days, so they are formatted as such —
// parsing them through the local timezone would shift them a day for readers
// west of UTC.
export const formatPostDate = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};
