// Real people who publish under their own name on this site.
//
// Phase 11 rule 06: never invent an author. No "Editorial Team" byline stands
// in for a person, and nobody is listed here who has not agreed to appear —
// the name, photo and professional profile become public, so that is the
// person's own decision rather than a marketing one.
//
// Phase 11 step 02 also requires ONE canonical public name and title per
// person. The blog front matter currently carries two different titles for the
// same author ("Founder, Developers Hub Sdn Bhd" on two posts, "Managing
// Director" on a third). The canonical value lives here; the posts should be
// reconciled against it rather than the other way round.
//
// `sameAs` stays empty until Phase 07 verifies ownership of each profile:
// admin access, publicly visible, and genuinely the same person. Unverified
// profile links are a risk, not an identity signal.

export interface Person {
  slug: string;
  /** Canonical public name. Never varies between articles. */
  name: string;
  /** Canonical job title. One value, used everywhere. */
  jobTitle: string;
  /** Professional bio — what this person does, not a personality sketch. */
  bio: string;
  /**
   * Areas of expertise. Phase 11 step 05: every entry needs at least one piece
   * of evidence — an article written, a project worked on, training delivered,
   * or actual job responsibility. Technology slugs resolve to Technology
   * entities so `knowsAbout` can reference them by @id rather than as strings.
   */
  knowsAbout: { technologySlug: string; evidence: string }[];
  contentUpdated: string;
}

export const PEOPLE: Person[] = [
  {
    slug: 'nasrul-hazim',
    name: 'Nasrul Hazim',
    jobTitle: 'Founder and Managing Director',
    bio:
      'Nasrul Hazim founded Developers Hub Sdn Bhd in 2020 and leads its engineering and training work. He builds Laravel systems for Malaysian businesses, maintains open-source PHP packages, and teaches the courses DevHub runs on modern PHP, Laravel and AI-augmented development.',
    knowsAbout: [
      {
        technologySlug: 'laravel',
        evidence: 'Teaches the Laravel & Livewire and Claude Code + MCP with Laravel courses; Laravel is the stack behind DevHub client work.',
      },
      {
        technologySlug: 'php',
        evidence: 'Teaches the Modern PHP course on OOP, SOLID and design patterns; maintains open-source PHP packages.',
      },
      {
        technologySlug: 'docker',
        evidence: 'Teaches the Docker & Container Fundamentals course; containerises DevHub client deployments.',
      },
      {
        technologySlug: 'claude-code',
        evidence: 'Author of "The Universal AI Coding Agent Formula"; teaches three courses covering AI-augmented development.',
      },
    ],
    contentUpdated: '2026-09-01',
  },
];

export const personBySlug = (slug: string): Person | undefined =>
  PEOPLE.find((person) => person.slug === slug);

/** Matches a blog post's free-text `author` field to a Person entity. */
export const personByName = (name: string): Person | undefined =>
  PEOPLE.find((person) => person.name === name);
