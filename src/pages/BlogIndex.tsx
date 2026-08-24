import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CalendarDays, Clock, Rss } from 'lucide-react';
import {
  allTags,
  blogPath,
  countByTag,
  formatPostDate,
  posts,
  type Post,
} from '../data/blog';
import { SITE_URL, useSeo } from '../hooks/useSeo';

// Listing layout deliberately mirrors /trainings — same header, same facet
// rail, same card grammar — so the two catalogues on the site read as one
// system. Tags are the only facet: a blog does not need a taxonomy the size
// of the training path.

const gradientStrip = 'bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-400';

const listingJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Developers Hub Blog',
    url: `${SITE_URL}/blog`,
    description:
      'Field notes on software engineering, developer training and technology practice from Developers Hub Sdn Bhd.',
    publisher: { '@type': 'Organization', name: 'Developers Hub Sdn Bhd', url: SITE_URL },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author },
      url: `${SITE_URL}${blogPath(post)}`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
  },
];

const PostMeta = ({ post, className = '' }: { post: Post; className?: string }) => (
  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${className}`}>
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
    </span>
    <span className="inline-flex items-center gap-1.5">
      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
      {post.readingMinutes} min read
    </span>
    <span>{post.author}</span>
  </div>
);

const DraftBadge = () => (
  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300">
    Draft
  </span>
);

const BlogIndex = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useSeo({
    title: 'Blog | Developers Hub Malaysia',
    description:
      'Field notes on software engineering, developer training and technology practice — Laravel, PHP, containers, identity, observability and AI-augmented development — from the team at Developers Hub, Johor Bahru.',
    path: '/blog',
    jsonLd: listingJsonLd,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(
    () =>
      posts.filter(
        (post) => selectedTags.length === 0 || post.tags.some((tag) => selectedTags.includes(tag)),
      ),
    [selectedTags],
  );

  // The newest post gets the banner treatment, but only in the unfiltered
  // view — under a filter every match should be weighted the same.
  const featured = selectedTags.length === 0 ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;

  const checkboxClass =
    'h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer';
  const filterLabelClass =
    'flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors';
  const tagClass =
    'text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300';

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Field notes from the work — what we build, what we teach, and what we would do
            differently next time. Written by the practitioners doing it.
          </p>
          <a
            href="/rss.xml"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            Subscribe via RSS
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nothing published yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              The first posts are being written. In the meantime, the{' '}
              <Link to="/trainings" className="text-blue-600 dark:text-blue-400 hover:underline">
                training catalogue
              </Link>{' '}
              is where most of our thinking already lives.
            </p>
          </div>
        ) : (
          <>
            {/* Featured — newest post */}
            {featured && (
              <Link
                to={blogPath(featured)}
                className="relative block rounded-2xl overflow-hidden bg-slate-900 shadow-lg mb-12 group"
              >
                {featured.cover && (
                  <>
                    <img
                      src={featured.cover}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-y-0 right-0 w-2/3 h-full object-cover object-right opacity-90 hidden sm:block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/20" />
                  </>
                )}
                <div className="relative p-8 sm:p-12 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
                      Latest
                    </span>
                    {featured.draft && <DraftBadge />}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-slate-300 mb-6">{featured.description}</p>
                  <PostMeta post={featured} className="text-slate-400 mb-6" />
                  <span className="inline-flex items-center text-sm font-semibold text-white">
                    Read post
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <div className={`absolute bottom-0 inset-x-0 h-1 ${gradientStrip}`} />
              </Link>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter rail */}
              <aside className="lg:w-64 shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 lg:sticky lg:top-28">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h2>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Topics
                  </h3>
                  <div className="space-y-2">
                    {allTags.map((tag) => (
                      <label key={tag} className={filterLabelClass}>
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className={checkboxClass}
                            checked={selectedTags.includes(tag)}
                            onChange={() =>
                              setSelectedTags((current) =>
                                current.includes(tag)
                                  ? current.filter((value) => value !== tag)
                                  : [...current, tag],
                              )
                            }
                          />
                          {tag}
                        </span>
                        <span className="text-xs text-gray-400">{countByTag(tag)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Card grid */}
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
                </p>

                {filtered.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-10 text-center text-gray-600 dark:text-gray-300">
                    No posts match those topics.
                  </div>
                ) : rest.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-10 text-center text-gray-600 dark:text-gray-300">
                    That is everything so far — more on the way.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rest.map((post) => (
                      <Link
                        key={post.slug}
                        to={blogPath(post)}
                        className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col overflow-hidden"
                      >
                        {post.cover && (
                          <img
                            src={post.cover}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="h-40 w-full object-cover"
                          />
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <PostMeta post={post} className="text-gray-500 dark:text-gray-400 mb-3" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
                            {post.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {post.draft && <DraftBadge />}
                            {post.tags.map((tag) => (
                              <span key={tag} className={tagClass}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                            Read post
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default BlogIndex;
