// Hand-written types for the build-time blog builder — vite.config.ts imports
// it to regenerate the blog data on dev-server file changes.
export interface GeneratedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  authorTitle?: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  canonical?: string;
  draft: boolean;
  readingMinutes: number;
  html: string;
}

export function buildBlog(options?: { includeDrafts?: boolean }): GeneratedPost[];
