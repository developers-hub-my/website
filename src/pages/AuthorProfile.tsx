import { Link, useParams } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageShell, { Section } from '../components/PageShell';
import NotFound from './NotFound';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl, pageTitle, ID } from '../data/site';
import { personBySlug } from '../data/people';
import { technologyBySlug } from '../data/technologies';
import { blogPath, posts } from '../data/blog';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  personNode,
  technologyNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// An author profile — Phase 11.
//
// Every `knowsAbout` entry is rendered with the evidence behind it. The SOP
// requires each one to be backed by an article written, a project worked on,
// training delivered or a real job responsibility; showing the evidence on the
// page is what stops the list quietly growing past what can be defended.

const AuthorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const person = slug ? personBySlug(slug) : undefined;

  const written = person ? posts.filter((post) => post.author === person.name) : [];
  const technologies = (person?.knowsAbout ?? [])
    .map((entry) => technologyBySlug(entry.technologySlug))
    .filter((technology): technology is NonNullable<typeof technology> => Boolean(technology));

  const canonical = person ? canonicalUrl(`/authors/${person.slug}`) : '';
  const crumbs = person
    ? [{ name: 'Home', path: '/' }, { name: 'Authors', path: '/authors/' }, { name: person.name }]
    : [];

  useSeo(
    person
      ? {
          title: pageTitle(person.name),
          description: person.bio,
          path: `/authors/${person.slug}`,
          crumbs,
          nodes: [
            organizationNode(),
            logoNode(),
            webSiteNode(),
            webPageNode({
              canonical,
              type: 'ProfilePage',
              name: pageTitle(person.name),
              description: person.bio,
              mainEntityId: ID.person(person.slug),
            }),
            personNode(person),
            ...technologies.map(technologyNode),
            breadcrumbNode(canonical, crumbs),
          ],
        }
      : {
          title: 'Author not found — Developers Hub',
          description: 'That author profile does not exist or may have been moved.',
          path: `/authors/${slug ?? ''}`,
          noindex: true,
        },
  );

  if (!person) return <NotFound />;

  return (
    <PageShell crumbs={crumbs} title={person.name} lede={person.bio}>
      <p className="-mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">{person.jobTitle}</p>

      <Section title="Expertise, and the evidence for it">
        <ul className="space-y-4">
          {person.knowsAbout.map((entry) => {
            const technology = technologyBySlug(entry.technologySlug);
            if (!technology) return null;

            return (
              <li key={entry.technologySlug} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <Link
                  to={`/technologies/${technology.slug}/`}
                  className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {technology.name}
                </Link>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{entry.evidence}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {written.length > 0 && (
        <Section title="Published work">
          <ul className="space-y-3">
            {written.map((post) => (
              <li key={post.slug}>
                <Link
                  to={blogPath(post)}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <ArrowRight
                    className="w-4 h-4 mt-1 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-white block">{post.title}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{post.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </PageShell>
  );
};

export default AuthorProfile;
