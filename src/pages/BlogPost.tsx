import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import {
  blogPath,
  formatPostDate,
  postBySlug,
  relatedPosts,
  type Post,
} from '../data/blog';
import { useSeo } from '../hooks/useSeo';
import Breadcrumbs from '../components/Breadcrumbs';
import { canonicalUrl, pageTitle, ID } from '../data/site';
import { personByName } from '../data/people';
import { TECHNOLOGIES } from '../data/technologies';
import {
  articleNode,
  breadcrumbNode,
  logoNode,
  organizationNode,
  personNode,
  technologyNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The article body is HTML rendered from markdown at build time by
// scripts/build-blog.mjs. It is first-party content committed to this repo (by
// hand or through /admin, which writes to the same repo), never anything a
// visitor can submit — so dangerouslySetInnerHTML is the right tool here and
// no runtime markdown parser ships to the browser. The `.blog-prose` styles
// live in src/index.css.

const gradientStrip = 'bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-400';

// Nodes for one post. Every entity the article references — the author, the
// technologies it is about — is emitted as a full node in the same graph, so
// no reference dangles (R6). `about` is limited to technologies the post's
// tags genuinely match: Phase 10 warns against attaching ten topics to one
// article to look semantically rich.
const postNodes = (post: Post) => {
  const canonical = canonicalUrl(blogPath(post));
  const author = personByName(post.author);
  const about = TECHNOLOGIES.filter((technology) =>
    post.tags.some((tag) => tag.toLowerCase() === technology.name.toLowerCase()),
  );

  return {
    canonical,
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: post.title }],
    author,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        name: pageTitle(post.title),
        description: post.description,
        mainEntityId: ID.article(canonical),
      }),
      breadcrumbNode(canonical, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog/' },
        { name: post.title },
      ]),
      author && personNode(author),
      ...about.map(technologyNode),
      author &&
        articleNode({
          canonical,
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          authorId: ID.person(author.slug),
          aboutIds: about.map((technology) => ID.technology(technology.slug)),
          image: post.cover ?? '/og-image.png',
        }),
    ],
  };
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postBySlug(slug) : undefined;

  const schema = post ? postNodes(post) : null;

  useSeo(
    post && schema
      ? {
          title: pageTitle(post.title),
          description: post.description,
          path: blogPath(post),
          image: post.cover,
          crumbs: schema.crumbs,
          nodes: schema.nodes,
        }
      : {
          title: 'Post not found — Developers Hub',
          description: 'That post does not exist or may have been moved.',
          path: `/blog/${slug ?? ''}`,
          noindex: true,
        },
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  if (!post || !schema) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
          <Link to="/blog/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Browse all posts
          </Link>
        </div>
      </main>
    );
  }

  const related = relatedPosts(post);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The breadcrumb carries the link back to /blog, so the old "All
            posts" link would have been a second link to the same place from
            one page — and only the breadcrumb is the visible counterpart of
            the BreadcrumbList in the graph (R8). */}
        <Breadcrumbs crumbs={schema.crumbs} />

        <header>
          <div className={`h-1 w-16 rounded-full ${gradientStrip} mb-6`} />
          {post.draft && (
            <p className="mb-4 inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300">
              Draft — not published on the live site
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {post.author}
              {post.authorTitle && (
                <span className="font-normal text-gray-500 dark:text-gray-400">
                  {' '}
                  · {post.authorTitle}
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {post.readingMinutes} min read
            </span>
          </div>

          {post.updated && post.updated !== post.date && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
            </p>
          )}

          {post.cover && (
            <img
              src={post.cover}
              alt={post.coverAlt ?? ''}
              className="mt-8 w-full rounded-xl shadow-md object-cover"
            />
          )}
        </header>

        <div
          className="blog-prose mt-10"
          // Build-time HTML from in-repo markdown — see the note at the top.
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Training for your team?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We teach the same stack we ship — one learning path, four stages, taught by
              practitioners.
            </p>
            <Link
              to="/trainings/"
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse trainings
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Read next</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((other) => (
                  <Link
                    key={other.slug}
                    to={blogPath(other)}
                    className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <time dateTime={other.date}>{formatPostDate(other.date)}</time> ·{' '}
                      {other.readingMinutes} min read
                    </p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {other.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {other.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </footer>
      </article>
    </main>
  );
};

export default BlogPost;
