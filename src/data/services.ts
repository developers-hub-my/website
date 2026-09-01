// The four services DevHub actually sells.
//
// Phase 01 rule 01 (business reality first): nothing lands here that the
// company has not sold or delivered. The list matches the service names in the
// SOP's own llms.txt template, which the business owner signed off.
//
// This file replaces the hardcoded copy that used to live inside
// Services.tsx. Requirement R7 is explicit that output must be generated from
// stored data rather than written per template — a service description changed
// here must move the page, the JSON-LD, the sitemap and the internal links
// together, with no other edit.

import type { TechnologySlug } from './technologies';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  /** Canonical service name. One name everywhere — Phase 14 duplicate control. */
  name: string;
  /** One sentence, used as the meta description and the JSON-LD description. */
  description: string;
  /** Phase 16: a definition block that stands on its own, placed first on the page. */
  definition: string;
  /** Who the service is for. */
  audience: string;
  /** The problems it solves, in the client's words. */
  problems: string[];
  /** How the work runs, start to finish. */
  process: { title: string; detail: string }[];
  /**
   * Technologies genuinely used to deliver this service — Phase 02 `relatedTo`.
   * Drives both the JSON-LD and the visible related links, so the two layers
   * cannot disagree (the Phase 08 defect).
   */
  technologies: TechnologySlug[];
  /** Phase 15: real questions, answered directly. Rendered visibly AND in schema. */
  faqs: ServiceFaq[];
  /** Date the copy above last changed, for sitemap lastmod. Not the file mtime. */
  contentUpdated: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'software-development',
    name: 'Software Development',
    description:
      'Custom web and mobile application development for Malaysian businesses, built and maintained by DevHub in Johor Bahru.',
    definition:
      'Software development at DevHub means designing, building and maintaining custom web and mobile applications for a client, rather than configuring off-the-shelf software. Engagements cover the whole life of the system: architecture, implementation, deployment and the changes that follow launch.',
    audience:
      'Business owners and IT managers who need a system that existing products do not cover, and who want the team that builds it to still be reachable a year later.',
    problems: [
      'Off-the-shelf software almost fits, and the gap is where the actual work happens.',
      'An existing system works but nobody remaining at the company understands it.',
      'A prototype proved the idea and now has to survive real users and real load.',
      'Development stalled because the original vendor moved on.',
    ],
    process: [
      {
        title: 'Understand the work first',
        detail:
          'We map the process the software is meant to support before proposing a design. Most failed builds are correct implementations of a misunderstood workflow.',
      },
      {
        title: 'Agree the architecture in writing',
        detail:
          'Data model, integration points and deployment target are settled and documented before implementation starts, so the expensive decisions are made deliberately.',
      },
      {
        title: 'Build in reviewable increments',
        detail:
          'Work ships in pieces you can open and use, not as one delivery at the end. Direction is corrected while correcting it is still cheap.',
      },
      {
        title: 'Hand over so you are not dependent on us',
        detail:
          'Documentation, deployment steps and a walkthrough with your team. The measure of a good handover is that your developers can make the next change without calling us.',
      },
    ],
    technologies: ['laravel', 'php'],
    faqs: [
      {
        question: 'Do you work with existing codebases, or only new projects?',
        answer:
          'Both. Taking over an existing system starts with a review of the code, the data model and the deployment setup, so the scope of any change is understood before it is quoted.',
      },
      {
        question: 'Who owns the code you write?',
        answer:
          'The client does. Source code, deployment configuration and documentation are handed over as part of delivery.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'Continuing support is arranged per engagement. There is no lock-in that prevents another team taking over — the handover exists precisely so that stays possible.',
      },
    ],
    contentUpdated: '2026-09-01',
  },
  {
    slug: 'it-consultation',
    name: 'IT Consultation',
    description:
      'Independent architecture review, technology selection and technical due diligence for teams making decisions they will live with for years.',
    definition:
      'IT consultation at DevHub is advisory work: reviewing an existing system, choosing between technical options, or assessing a build someone else delivered. The output is a written recommendation with the reasoning attached, not an implementation contract.',
    audience:
      'Teams about to commit to a platform, a rewrite or a vendor, and business owners who need someone independent to read a technical proposal.',
    problems: [
      'Two vendors propose different architectures and both sound convincing.',
      'A system is slow or fragile and the team disagrees on why.',
      'A rewrite is being considered without a clear account of what is actually wrong.',
      'A technical proposal needs reading by someone with no stake in it being accepted.',
    ],
    process: [
      {
        title: 'Read the system as it is',
        detail:
          'Code, schema, infrastructure and the incident history. Opinions about a system are less useful than what the system is doing.',
      },
      {
        title: 'Name the trade-offs explicitly',
        detail:
          'Every option costs something. A recommendation without the trade-off stated is an opinion, not advice.',
      },
      {
        title: 'Deliver it in writing',
        detail:
          'A document your team can argue with after we leave, including the criteria used, so the decision can be revisited when the context changes.',
      },
    ],
    technologies: ['laravel', 'php'],
    faqs: [
      {
        question: 'Will you recommend your own development services?',
        answer:
          'A consultation can conclude that the existing team should do the work, or that no work is needed. Advice that always ends in a proposal is not advice.',
      },
      {
        question: 'How long does a review take?',
        answer:
          'It depends on the size of the system and how much of it is documented. Scope and duration are agreed before the review begins.',
      },
    ],
    contentUpdated: '2026-09-01',
  },
  {
    slug: 'technology-education',
    name: 'Technology Education',
    description:
      'Hands-on developer training in Linux, Git, Docker, modern PHP, Laravel, APIs, architecture and AI-augmented development, delivered by practitioners.',
    definition:
      'Technology education at DevHub is structured, hands-on training for working developers. Courses run across four stages — Foundation, Practitioner, Professional and Architect — and are taught by people who build the same systems in client work.',
    audience:
      'Development teams whose skills have drifted from what their projects now require, and individual developers moving from writing code to designing systems.',
    problems: [
      'The team ships, but nobody is confident about the parts they inherited.',
      'Onboarding a developer takes months because knowledge lives in a few heads.',
      'A tool was adopted company-wide and only one person understands it properly.',
      'Training budget was spent on video courses nobody finished.',
    ],
    process: [
      {
        title: 'Start from what the team actually builds',
        detail:
          'Course content is adjusted to the stack and the problems in front of the team, so the examples are recognisable rather than generic.',
      },
      {
        title: 'Teach by building',
        detail:
          'Every session has work in it. Watching someone else type has a poor record of changing what a team does on Monday.',
      },
      {
        title: 'Leave the material behind',
        detail:
          'Exercises and notes stay with the team, so the training is a starting point rather than an event.',
      },
    ],
    technologies: ['laravel', 'php', 'claude-code'],
    faqs: [
      {
        question: 'Are courses run in person or online?',
        answer:
          'Both formats are available. Which one a given run uses is decided per engagement, along with the schedule.',
      },
      {
        question: 'Can a course be adapted for our team?',
        answer:
          'Yes. The published outlines are the starting point; the examples and depth are adjusted to the stack the team works in.',
      },
      {
        question: 'Where do I see the full catalogue?',
        answer:
          'All thirteen courses across the four stages are listed on the trainings page, each with its outcomes and the audience it is written for.',
      },
    ],
    contentUpdated: '2026-09-01',
  },
  {
    slug: 'business-solutions',
    name: 'Business Solutions',
    description:
      'Workflow automation, systems integration and reporting that remove manual steps from how a business already runs.',
    definition:
      'Business solutions at DevHub means automating and connecting the systems a company already uses, rather than replacing them. The work targets the manual steps between tools — the re-typing, the copy-paste and the spreadsheet that three departments depend on.',
    audience:
      'Operations and finance teams whose process works but costs hours a week in manual handling, and businesses running several tools that do not talk to each other.',
    problems: [
      'The same data is entered by hand into two or three different systems.',
      'A critical spreadsheet is maintained by one person and understood by nobody else.',
      'Reports are assembled manually every month and are out of date by the time they circulate.',
      'Two systems the business depends on have no integration between them.',
    ],
    process: [
      {
        title: 'Follow the process as it runs today',
        detail:
          'Including the workarounds. The undocumented steps are usually the ones keeping the process alive.',
      },
      {
        title: 'Automate the repetitive part, not the judgement',
        detail:
          'Steps that need a human decision stay with the human. Automating judgement is how automation projects lose the trust of the people using them.',
      },
      {
        title: 'Measure against the manual baseline',
        detail:
          'Time taken before and after, recorded. Without a baseline the improvement is a claim rather than a result.',
      },
    ],
    technologies: ['laravel', 'php'],
    faqs: [
      {
        question: 'Do we have to replace our current systems?',
        answer:
          'Usually not. Most of the value is in connecting what is already in place; replacement is proposed only when the existing tool genuinely cannot do the job.',
      },
      {
        question: 'What if our process changes after the automation is built?',
        answer:
          'Processes change, so the automation is built to be edited. Which parts are expected to move is agreed during the first step.',
      },
    ],
    contentUpdated: '2026-09-01',
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((service) => service.slug === slug);
