import { Navigate, useParams } from 'react-router';
import { blogPath, postBySlug } from '../data/blog';

// Redirects an in-app navigation to an old /blog/:slug link.
//
// Netlify 301s these before a request reaches the app, so this only covers the
// case where something inside the site still links to the old path — a post
// body, a bookmark restored by the router, a stale share. The slug is
// unchanged by the move, so the post is found and the reader lands on it
// rather than on a 404.
//
// A slug that never existed falls through to /resources/ rather than
// pretending to be a post that is merely at a different address.
const LegacyBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postBySlug(slug) : undefined;

  return <Navigate to={post ? blogPath(post) : '/resources/'} replace />;
};

export default LegacyBlogPost;
