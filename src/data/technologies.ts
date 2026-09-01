// Technologies DevHub can defend with evidence that exists today.
//
// Phase 01 names this as the single most common way an entity graph inflates:
// copying a competitor's technology list produces a graph that looks large and
// cannot be defended. Every entry here has to answer one question — does DevHub
// have a project, service, training, documentation or real expertise for this?
//
// The homepage used to advertise ten technologies (React, Node.js, Python, AWS,
// Flutter, TypeScript, PostgreSQL, Docker, Tailwind CSS and Laravel) with no
// page, course or article behind most of them. That list is exactly the
// inflation the rule describes, and it is not reproduced here.
//
// Three qualify on evidence held in this repo:
//   laravel      two courses, and the stack the development service is built on
//   php          one course, and the language underneath the Laravel work
//   claude-code  three courses and a published article — the strongest of them
//
// The SOP leaves the third slot to the business owner (see issue #37). Claude
// Code is the evidence-backed recommendation, not a settled decision: Docker
// also has a dedicated course and would qualify on the same test.

export type TechnologySlug = 'laravel' | 'php' | 'claude-code';

export interface Technology {
  slug: TechnologySlug;
  /** Canonical name. Laravel, "Laravel Framework" and "Laravel PHP Framework" are one entity. */
  name: string;
  /** Schema.org type — the registry allows SoftwareApplication or the closest fit. */
  schemaType: 'SoftwareApplication' | 'ComputerLanguage';
  description: string;
  /**
   * Phase 16 definition block: one or two sentences, accurate, standing alone,
   * placed at the top of the page. States what the technology is — not what
   * DevHub thinks of it.
   */
  definition: string;
  /** First-party experience, kept separate from the industry fact above (Phase 16 step 05). */
  howDevhubUsesIt: string;
  /** The official upstream reference, for `sameAs`. */
  officialUrl: string;
  /** Services genuinely delivered with it — bidirectional with SERVICES.technologies. */
  services: string[];
  /** Training course slugs that teach it. Evidence, and the visible related links. */
  trainingSlugs: string[];
  /** Author slugs with demonstrable expertise — Phase 11 `knowsAbout` evidence. */
  experts: string[];
  contentUpdated: string;
}

export const TECHNOLOGIES: Technology[] = [
  {
    slug: 'laravel',
    name: 'Laravel',
    schemaType: 'SoftwareApplication',
    description:
      'How DevHub uses Laravel to build and maintain web applications, and the training we run on it.',
    definition:
      'Laravel is an open-source PHP framework for building web applications and APIs. It provides routing, an ORM, queued background jobs, testing tools and a scheduler as part of the framework rather than as separate choices.',
    howDevhubUsesIt:
      'Laravel is the default stack for DevHub client applications. In our implementations, queued jobs handle work that should not hold up a user request, and the framework\'s testing tools carry the regression suite that runs before a release.',
    officialUrl: 'https://laravel.com',
    services: ['software-development', 'it-consultation', 'technology-education', 'business-solutions'],
    trainingSlugs: ['laravel-livewire', 'claude-code-mcp-laravel'],
    experts: ['nasrul-hazim'],
    contentUpdated: '2026-09-01',
  },
  {
    slug: 'php',
    name: 'PHP',
    schemaType: 'ComputerLanguage',
    description:
      'PHP engineering practice at DevHub — the language under our Laravel work, and the course we teach on writing it well.',
    definition:
      'PHP is a server-side programming language used to build web applications. Since version 8.0 it has included typed properties, enums, readonly classes and match expressions, which changed how modern PHP code is written.',
    howDevhubUsesIt:
      'PHP is the language beneath every Laravel system DevHub delivers. Our practice targets PHP 8.2 and above, and the Modern PHP course exists because most of the legacy code we are asked to take over predates the language features that would have made it simpler.',
    officialUrl: 'https://www.php.net',
    services: ['software-development', 'it-consultation', 'technology-education', 'business-solutions'],
    trainingSlugs: ['modern-php'],
    experts: ['nasrul-hazim'],
    contentUpdated: '2026-09-01',
  },
  {
    slug: 'claude-code',
    name: 'Claude Code',
    schemaType: 'SoftwareApplication',
    description:
      'How DevHub uses Claude Code in day-to-day engineering, and the three courses we teach on AI-augmented development.',
    definition:
      'Claude Code is a command-line coding agent from Anthropic. It reads and edits files in a repository, runs commands, and works against the project it is pointed at rather than against pasted snippets.',
    howDevhubUsesIt:
      'DevHub uses Claude Code in client engineering work and teaches it across three courses. Our published position is that the durable skill is the operating discipline around the agent — scope, review and verification — rather than the prompts themselves.',
    officialUrl: 'https://claude.com/claude-code',
    services: ['technology-education'],
    trainingSlugs: ['augmented-developer', 'claude-code-mcp-laravel', 'ai-augmented-architecture'],
    experts: ['nasrul-hazim'],
    contentUpdated: '2026-09-01',
  },
];

export const technologyBySlug = (slug: string): Technology | undefined =>
  TECHNOLOGIES.find((technology) => technology.slug === slug);

/** Technologies related to a service — the other direction of SERVICES.technologies. */
export const technologiesForService = (serviceSlug: string): Technology[] =>
  TECHNOLOGIES.filter((technology) => technology.services.includes(serviceSlug));
