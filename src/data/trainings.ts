import {
  Activity,
  Bot,
  Boxes,
  Code2,
  Compass,
  Container,
  GitBranch,
  KeyRound,
  Landmark,
  LucideIcon,
  Plug,
  Smartphone,
  Terminal,
} from 'lucide-react';

// Static training catalogue baked into the site. Copy is authored from each
// course's marketing kit in the DevHub Academy repo (01-marketing/
// marketing-positioning.md) and follows the AIDCA structure:
//   headline/audience → Attention · pains → Interest · outcomes → Desire ·
//   proof → Conviction · CTA (rendered by TrainingDetail) → Action.
// Scheduling, pricing and registration live on GatherHub — never here.

export type Stage = 'foundation' | 'practitioner' | 'professional' | 'architect';

// HRD Corp claim status is on hold — flip to true to show the badges and the
// Funding filter again. Data keeps the per-course `hrdCorp` flag either way.
export const SHOW_HRD_CORP = false;

export interface StageInfo {
  label: string;
  order: number;
  blurb: string;
}

export const STAGES: Record<Stage, StageInfo> = {
  foundation: {
    label: 'Foundation',
    order: 1,
    blurb: 'The ground every developer stands on — servers, git, containers, modern PHP.',
  },
  practitioner: {
    label: 'Practitioner',
    order: 2,
    blurb: 'Ship real products the production-quality way — web, mobile, APIs, and AI-augmented work.',
  },
  professional: {
    label: 'Professional',
    order: 3,
    blurb: 'Run serious systems — central identity, observability, and agent infrastructure.',
  },
  architect: {
    label: 'Architect',
    order: 4,
    blurb: 'Make design decisions you can defend — with and without AI at your side.',
  },
};

export interface Training {
  slug: string;
  stage: Stage;
  icon: LucideIcon;
  title: string;
  /** Attention — pain-hook headline for the landing hero */
  headline: string;
  /** One-liner for listing cards */
  tagline: string;
  /** Attention — who this is for, and the promise in one paragraph */
  audience: string;
  duration: string;
  delivery: 'Physical' | 'Online';
  hrdCorp: boolean;
  /** Optional pricing/format note, e.g. the free taster */
  priceNote?: string;
  /** Brand SVG logos (slugs into /images/logos/<slug>.svg, simple-icons) */
  logos?: string[];
  /** Topic tags — shown as chips and used by the listing's Tags filter */
  tags: string[];
  /** Conviction — headline numbers rendered as stat tiles (honest, from the kit) */
  stats?: { value: string; label: string }[];
  /** Interest — the pains this audience lives with */
  pains: string[];
  /** Desire — what you walk away with */
  outcomes: string[];
  /** Conviction — honest, checkable proof */
  proof: string[];
}

export const trainings: Training[] = [
  // ── Stage 1 · Foundation ──────────────────────────────────────────────
  {
    slug: 'linux-for-developers',
    stage: 'foundation',
    icon: Terminal,
    title: 'Linux for Developers',
    headline: 'Operate the servers your apps run on',
    tagline: 'Stop deploying by copy-paste — build, run, break, and fix a production-shaped Linux server yourself.',
    audience:
      'For web and app developers who deploy to Linux but have only ever pasted the commands. Over two days you take one server from empty to production-shaped — and leave knowing exactly what to type, and why.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['linux'],
    tags: ['Linux', 'DevOps'],
    stats: [{ value: '10', label: 'modules' }, { value: '10', label: 'hands-on labs' }, { value: '3', label: 'break/fix drills you solve' }],
    pains: [
      'You deploy to Linux by pasting commands from a runbook you don’t fully understand — and it’s fine until it isn’t.',
      'Something breaks in production, you SSH in, and you don’t know which command tells you why.',
      'One person on the team “owns the server” and everything routes through them.',
      'You can build the app, but the box it runs on is a black box.',
    ],
    outcomes: [
      'A Linux VM you built yourself, hardened to SSH-key-only login (passwords off)',
      'Your own app running as a systemd service that restarts on crash and survives reboot',
      'The app deployed behind nginx on port 80, behind a firewall allowing only SSH + HTTP',
      'A health-report shell script you wrote, run against your own server over SSH',
      'Proven ability to diagnose and fix three staged server failures — with systemctl, journalctl, ss, and curl, no guessing',
    ],
    proof: [
      '10 modules, 10 labs — every single module is hands-on, no lecture-only blocks',
      'One continuous build: the same VM goes empty → shell-fluent → hardened → deployed → firewalled, then break/fix drills',
      'Zero risk to real systems — labs run entirely on a disposable local VM you create in lab 1',
      'Taught by a practitioner who operates production Linux servers daily',
    ],
  },
  {
    slug: 'mastering-git',
    stage: 'foundation',
    icon: GitBranch,
    title: 'Mastering Git: Solo, Team & Workflows',
    headline: 'From add/commit/push to calm under any history',
    tagline: 'Every scary git moment provoked on purpose — then repaired by you, not watched on a slide.',
    audience:
      'For developers who use git every day but only add/commit/push — and freeze at a conflict or a history they think they’ve broken. Two days, any stack: git is the stack.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['git'],
    tags: ['Git', 'Team Workflow'],
    stats: [{ value: '10', label: 'modules' }, { value: '~14', label: 'contact hours' }, { value: '100%', label: 'lab-first, both days' }],
    pains: [
      'A conflict shows up and your stomach drops — you git merge --abort and hope, or copy the folder “just in case”.',
      'You think you deleted work with reset --hard and don’t know the reflog exists.',
      'Your team has no written branching strategy — everyone does it differently and main breaks weekly.',
      'PRs get rubber-stamped “LGTM” because nobody was taught how to review.',
    ],
    outcomes: [
      'A mental model of commit / ref / HEAD you can draw — git stops being magic',
      'Recovery reflexes: reflog rescue, stash, aborting cleanly — nothing committed is ever lost again',
      'History surgery on demand: interactive rebase, cherry-pick, amend, and bisect',
      'A merged PR you authored and a real review you gave, on a shared practice remote',
      'A one-page team git playbook (branching strategy + merge/rebase policy + PR rules) ready for Monday',
    ],
    proof: [
      'Every scary scenario is provoked on purpose — lost commits, botched rebases, real conflicts between two people — then repaired by you',
      '10 modules, ~14 contact hours, both days lab-first: Day 1 solo mastery, Day 2 team workflows on a shared remote',
      'Built and delivered by Developers Hub — a working Malaysian software team; the workflows taught are the ones DevHub runs across its own repositories',
    ],
  },
  {
    slug: 'docker-fundamentals',
    stage: 'foundation',
    icon: Container,
    title: 'Docker & Container Fundamentals',
    headline: 'Stop copy-pasting Docker commands you don’t understand',
    tagline: 'Build the container mental model from evidence on your own machine — then containerise a real app and push it to a registry.',
    audience:
      'For developers who already deploy apps but treat Docker as magic incantations — commands lifted from a wiki, a Dockerfile inherited from someone who left. Two hands-on days, ~85% keyboards-on.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['docker'],
    tags: ['Docker', 'DevOps'],
    stats: [{ value: '~85%', label: 'keyboards-on' }, { value: '3', label: 'services in your compose stack' }, { value: '1', label: 'image pushed to a registry' }],
    pains: [
      'You type docker compose up every day and pray — you couldn’t say what half the file does.',
      'Your Dockerfile was copy-pasted from a colleague who left; nobody dares touch it.',
      'A container “won’t connect” and you’re changing lines at random until it works.',
      'Your image is 1.2 GB and takes forever to push; you don’t know which line made it fat.',
    ],
    outcomes: [
      'Run, inspect, and clean containers deliberately; persist data with named volumes; wire containers on a network',
      'A Dockerfile written from scratch — then shrunk with layers, .dockerignore, and multi-stage builds',
      'A three-service stack (app + DB + cache) under one compose.yaml with healthchecks and env-based config',
      'Three broken containers debugged with a repeatable toolkit',
      'An unfamiliar app containerised by you and pushed to a registry — a link you can pull from any Docker host',
    ],
    proof: [
      'Every concept built from evidence, not slides — you run, inspect, and break each one on your own machine',
      'Ships a real, verifiable artifact: an image you containerised from scratch, pushed to a registry by close',
      'Any stack — labs use Node.js and Python demo apps precisely so the skill transfers, not a framework',
    ],
  },
  {
    slug: 'modern-php',
    stage: 'foundation',
    icon: Code2,
    title: 'Modern PHP: OOP, SOLID & Design Patterns',
    headline: 'From procedural PHP to objects you’d ship',
    tagline: 'One plain-PHP project built from scratch, then refactored through SOLID and the patterns that actually appear in real codebases.',
    audience:
      'For developers who write procedural PHP comfortably but freeze at class — bootcamp and self-taught devs, and anyone about to learn Laravel. Every pattern arrives with the pain it removes: problem before, shape after.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['php'],
    tags: ['PHP', 'OOP & Patterns'],
    stats: [{ value: '23', label: 'GoF patterns documented' }, { value: '6–8', label: 'patterns taught hands-on' }, { value: '5', label: 'SOLID principles applied' }],
    pains: [
      '“I can write PHP, but every job wants OOP experience and I’ve never really understood classes.”',
      '“I copied an interface from Stack Overflow, it worked, and I still couldn’t tell you why.”',
      '“Every tutorial teaches class Animal. My actual code is a 400-line controller and no animal in sight.”',
      '“Laravel feels like magic — and magic I can’t debug.”',
    ],
    outcomes: [
      'A running plain-PHP project you built from scratch: strict types, enums, interfaces, polymorphism, PSR-4 autoloading, dependency injection',
      'The same project refactored on Day 2: a god class taken through all five SOLID principles',
      'Working Strategy, Factory Method, Adapter, Decorator, Facade and Observer — in your own domain code, not a slide',
      'A symptom → pattern selection table you can use at work on Monday',
      'The judgement to know when not to apply a pattern',
    ],
    proof: [
      'Curriculum mined from three companion ebooks the trainer wrote — OOP in PHP, SOLID Principles in PHP, and Design Patterns in PHP (23 GoF patterns documented; 6–8 taught hands-on)',
      'One worked codebase across both days — no toy Shape/Rectangle examples; every refactor is one you’d actually make',
      'Taught by a working DevHub practitioner who ships production PHP daily',
    ],
  },

  // ── Stage 2 · Practitioner ────────────────────────────────────────────
  {
    slug: 'laravel-livewire',
    stage: 'practitioner',
    icon: Boxes,
    title: 'Web Development with Laravel & Livewire',
    headline: 'From tutorial-done to production-ready',
    tagline: 'Build one real CRUD app the production-quality way — conventions, reactive Livewire UI, green Pest suite, deploy checklist.',
    audience:
      'For PHP developers who finished the Laravel tutorials but haven’t shipped a production app — and for teams whose Laravel code has no house style. You leave with a coherent codebase and a repeatable shape, not notes.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['laravel', 'livewire'],
    tags: ['Laravel', 'Web'],
    stats: [{ value: '1', label: 'continuous app, tutorial to deploy-ready' }, { value: '4', label: 'field-guides behind the curriculum' }, { value: '0', label: 'disconnected snippets' }],
    pains: [
      'You finished the tutorials and built a side project — and have no idea what separates it from something a client would pay to depend on.',
      'Your Laravel codebase is different in every file: validation here in the controller, there in the model, authorization by copy-pasted if statements.',
      'You want a reactive UI without a separate SPA and an API to maintain — you keep hearing “Livewire” and haven’t sat down to learn it properly.',
      '“Just write tests” — but the tests you wrote were slow, brittle and no help, so you quietly stopped.',
    ],
    outcomes: [
      'A running booking app built the conventional way — readable migrations, a status enum, Form Request validation, and a policy that denies the wrong user',
      'A Livewire form + data table (search/filter/sort) + modal + private file upload',
      'A green Pest test suite covering what you built',
      'A filled deploy checklist you take home',
      'A house style your whole team can point at',
    ],
    proof: [
      'Built on current Laravel, Livewire, and Pest — the stack you’d actually start a project on today, not a legacy tutorial version',
      'One continuous app, laravel new to deploy-ready — a coherent codebase, not ten disconnected snippets',
      'Grounded in four production field-guides the trainer wrote, every convention taught with its cost stated',
      'Delivered with a fallback repo (per-module branches) so a broken laptop never stalls the room',
    ],
  },
  {
    slug: 'flutter-dart',
    stage: 'practitioner',
    icon: Smartphone,
    title: 'Flutter & Dart: Foundations to Production',
    headline: 'Ship one mobile app end-to-end',
    tagline: 'From an empty Flutter project to a signed release build that talks to a real REST backend.',
    audience:
      'For web and backend developers told to “also do the mobile app”. You already have 80% of this — two days add the mobile 20% and carry it all the way to a signed Android release build.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['flutter', 'dart'],
    tags: ['Flutter', 'Mobile'],
    stats: [{ value: '1', label: 'app carried to a signed release' }, { value: '1', label: 'state approach — Riverpod throughout' }, { value: '80%', label: 'you already know from backend work' }],
    pains: [
      'You know the backend cold, but “just build the mobile app too” turned into three abandoned tutorials and a folder of half-apps.',
      'Every Flutter course teaches widgets, then leaves you at “now connect it to your API” — the exact part that matters.',
      'You picked a state-management library, then a blog post said use a different one, and now you have three half-migrations.',
      'You can make it run in debug, but “sign it and ship it” is a wall of Gradle and Xcode errors.',
    ],
    outcomes: [
      'A themed Flutter app running on your own device — scrolling list, validated forms, navigation, light/dark theme — with real Dart fluency',
      'The app wired to a real REST backend: login with token auth, HTTP CRUD, secure persistence across restarts',
      'Proper loading/error/empty states with one state-management approach (Riverpod), start to finish',
      'A signed Android release build',
      'The complete app in your own git history as a reference architecture for the next one',
    ],
    proof: [
      'One continuous app carried to a signed release build — not disconnected demos; the git log is the syllabus',
      'One state-management choice (Riverpod) used throughout — no framework-hopping, the most common way beginner Flutter courses leave people stuck',
      'Taught by a DevHub practitioner shipping production software daily',
    ],
  },
  {
    slug: 'api-design-security-operations',
    stage: 'practitioner',
    icon: Plug,
    title: 'API Design, Security & Operations',
    headline: 'Ship APIs another team can trust',
    tagline: 'Take an API from ad-hoc endpoints to designed, contract-tested, secured, and operable — then adopt the standard as a team.',
    audience:
      'For backend developers shipping APIs that are inconsistent, undocumented, or insecure — and the tech leads trying to set a standard. Any stack, with a Laravel-flavoured default path throughout.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['openapiinitiative', 'owasp'],
    tags: ['API', 'Security'],
    stats: [{ value: '3.1', label: 'OpenAPI spec, contract-test enforced' }, { value: 'Top 10', label: 'OWASP attacks on your own API' }, { value: '1', label: 'standards one-pager for your team' }],
    pains: [
      'Every endpoint in your API is a slightly different shape — clients write three error parsers and still get surprised.',
      'Your “documentation” is a Postman collection from six months ago that no longer matches the code.',
      'You’re pretty sure the API is secure, but nobody has actually tried to break it.',
      'You shipped v2 by editing v1 in place, and a client you forgot about went down.',
    ],
    outcomes: [
      'A running demo API with consistent resources, status codes, pagination, RFC 9457 errors, and versioning',
      'An OpenAPI 3.1 spec that a passing contract-test suite enforces',
      'The same API secured — token + OAuth2 auth, your own OWASP Top 10 attacks and fixes, rate limiting',
      'Generated docs, request logging, and a written deprecation policy',
      'A completed API standards one-pager your team can adopt on Monday',
    ],
    proof: [
      'The curriculum maps to public standards you can verify: OpenAPI 3.1, RFC 9457, OAuth2, and the OWASP API Security Top 10 (2023)',
      'Every participant attacks their own lab API through the OWASP Top 10 and fixes each finding — hands-on, not a slideshow of CVEs',
      'Built by a practitioner who ships production Laravel APIs and open-source packages',
    ],
  },
  {
    slug: 'augmented-developer',
    stage: 'practitioner',
    icon: Bot,
    title: 'The Augmented Developer',
    headline: 'See exactly how production software ships with AI',
    tagline: 'The full working method — live, on real repositories. Watch-friendly, free, and the start of the AI track.',
    audience:
      'For developers on any stack who are AI-curious but tired of toy demos. Three hours, online, watch-friendly: the full Loop (Context → Plan → Build & Verify → Learn) demonstrated live on real production repos.',
    duration: '3 hours',
    delivery: 'Online',
    hrdCorp: false,
    logos: ['claude'],
    tags: ['AI', 'Claude Code'],
    stats: [{ value: '60+', label: 'repos on the method' }, { value: '47', label: 'MCP tools in production' }, { value: '43', label: 'documented gotchas' }, { value: '30+', label: 'published Claude skills' }],
    priceNote: 'Free taster — session one of the AI track',
    pains: [
      'AI answers about your codebase are confident and wrong — you’re re-explaining the project every prompt.',
      'Everyone says “use AI properly” — nobody shows you their actual working system, live, on real code.',
      'Tutorials show toys. You want to see how production work actually ships with an agent.',
      'No time or budget for a full course before knowing if this is real. (Three hours. Online. Free.)',
    ],
    outcomes: [
      'The full Loop demonstrated live on a real repo — Context → Plan → Build & Verify → Learn, not slides',
      'The 10 patterns behind how one architect ships production work with Claude across 60+ repos',
      'One Method, Any Domain — the same loop producing docs, quotations, logos, and training materials',
      'Take-home: the method map + a starter CLAUDE.md template',
      'Q&A and the roadmap: the 1-day online next, the 2-day deep dive after',
    ],
    proof: [
      '60+ repositories run on the same written method — CLAUDE.md contracts everywhere',
      '43 documented gotchas with commit references — every lesson paid for once',
      '47 MCP tools in production — agents reading real system state, writes behind a human gate',
      '30+ published Claude skills · 20+ open-source Laravel packages · every demo runs from the trainer’s real production repos',
    ],
  },

  // ── Stage 3 · Professional ────────────────────────────────────────────
  {
    slug: 'keycloak-sso',
    stage: 'professional',
    icon: KeyRound,
    title: 'Identity, Access Control & SSO with Keycloak',
    headline: 'Stop rebuilding login',
    tagline: 'Central identity, real OIDC login, token-protected APIs, and SSO across apps — traced end to end, not trusted blindly.',
    audience:
      'For developers and tech leads who keep rebuilding login, roles, and password resets in every app. You leave able to run central identity for any stack — and to trace a login from browser redirect to signed token to role check.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['keycloak', 'openid'],
    tags: ['Security', 'SSO'],
    stats: [{ value: '2', label: 'apps on SSO from one login' }, { value: 'OAuth 2.1', label: 'current flows — PKCE, no legacy' }, { value: '100%', label: 'hands-on, zero real user data' }],
    pains: [
      'You’ve built login from scratch four times. Every app has its own users table, its own reset flow, its own place to forget to disable a leaver’s account.',
      '“Just use Keycloak” — but the docs show you screens, not the flow, so you copy config you can’t debug.',
      'SSO looks like magic until it breaks, and then nobody on the team can explain the three sessions in play.',
      'Your API “checks the token” with a library you couldn’t defend in a security review.',
    ],
    outcomes: [
      'Keycloak running in Docker and a training realm you modelled yourself — clients, users, groups, roles',
      'A web app wired to Keycloak with Authorization Code + PKCE login',
      'An API that enforces bearer tokens with real 401/403 role checks',
      'SSO across two apps from a single login — and single logout done correctly',
      'A brokered login from a second identity provider, a realm backup you restored, and a hardening checklist applied to your realm',
    ],
    proof: [
      'Taught by a trainer running Keycloak-based SSO and central identity in production on a university-scale IAM platform',
      'Every lab ends with a request you can trace end to end: browser redirect → signed token → role check',
      'Built on current Keycloak and OAuth 2.1 — Authorization Code + PKCE, not deprecated flows',
      '100% hands-on on your laptop — nothing runs on real user data',
    ],
  },
  {
    slug: 'observability',
    stage: 'professional',
    icon: Activity,
    title: 'Observability for Modern Apps & Infrastructure',
    headline: 'Stop finding out from your users',
    tagline: 'Build a full observability stack from scratch, instrument the three signals, and debug staged incidents before anyone complains.',
    audience:
      'For developers and DevOps engineers who currently learn that production is broken from an angry user — and teams drowning in unstructured logs. You build the stack, break it, and run the on-call loop yourself.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['prometheus', 'grafana', 'opentelemetry', 'jaeger'],
    tags: ['DevOps', 'Observability'],
    stats: [{ value: '3', label: 'signals: logs · metrics · traces' }, { value: '2+', label: 'staged incidents you debug' }, { value: '5', label: 'open-source tools, all take-home' }],
    pains: [
      'You find out production is down from a user, a tweet, or a client call — never from your own tools.',
      'You have terabytes of logs and still can’t answer “which requests were slow, and why?”',
      'Your alerts either never fire or cry wolf so often everyone muted them — including the real one.',
      'Leadership asks “what’s our uptime target and are we hitting it?” and you don’t have a number.',
    ],
    outcomes: [
      'A working docker-compose observability stack on your laptop: app + Prometheus + Grafana + OpenTelemetry Collector + Jaeger',
      'Your app emitting structured logs with request IDs, RED metrics on a dashboard you built, and one request traced end-to-end across services',
      'A staged incident debugged by correlating all three signals',
      'An SLO with an error budget, and multi-window burn-rate alerts that fire on real problems and stay quiet on blips',
      'A runbook in your own words, and a capstone incident closed under a time-box',
    ],
    proof: [
      'Built on the industry-standard open-source stack every team can actually adopt — Prometheus, Grafana, OpenTelemetry, Jaeger',
      'Every participant builds the whole stack themselves and survives two-plus staged incidents — the labs are the spine',
      'Taught by the DevHub team behind Nadi, a production error-monitoring product — the same signals and on-call motion, operated for real',
    ],
  },
  {
    slug: 'claude-code-mcp-laravel',
    stage: 'professional',
    icon: Bot,
    title: 'Claude Code + MCP with Laravel',
    headline: 'Stop using AI tools. Start building for them.',
    tagline: 'Two days. One authenticated Laravel MCP server — connected to Claude Code, consumed through the human gate. Yours.',
    audience:
      'For Laravel developers and team leads who use AI daily but can’t point an agent at their actual system. Day 1 builds agent fluency on your own app; Day 2 builds and consumes an authenticated MCP server.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['claude', 'laravel'],
    tags: ['AI', 'Claude Code', 'Laravel', 'MCP'],
    stats: [{ value: '47', label: 'MCP tools in production' }, { value: '60+', label: 'repos on the method' }, { value: '16', label: 'pax, capped' }, { value: '14', label: 'contact hours' }],
    pains: [
      'Your team “uses AI” but nobody can point the agent at your actual system — it guesses, confidently and wrongly.',
      'MCP is everywhere in the changelogs and nowhere in your codebase — you know it matters, you haven’t built one.',
      'You can’t let an agent near production because there’s no gate — this course teaches the gate as a hard rule, from hour one.',
      'Tutorials show hello-world servers. You need auth, tests, and a rollout path.',
    ],
    outcomes: [
      'Agent fluency on your own app: a working CLAUDE.md, a custom command, an authored skill, a headless script',
      'An authenticated Laravel MCP server — Sanctum token and Passport OAuth paths',
      'The server connected to Claude Code and consumed through the human gate',
      'A skill that drives your MCP server',
      'The governance story — human-gate discipline — your management needs to approve agent adoption',
    ],
    proof: [
      'Built on the official laravel/mcp package — not a wrapper, not a fork',
      'A complete open-source reference implementation ships with the course: cleaniquecoders/laravel-mcp-kit — every lab builds toward it, and it stays yours',
      'The trainer runs 47 MCP tools in production — agents reading real system state, writes behind a human gate',
      'The same method runs 60+ repositories · 30+ published Claude skills · 20+ open-source Laravel packages',
    ],
  },

  // ── Stage 4 · Architect ───────────────────────────────────────────────
  {
    slug: 'software-architecture',
    stage: 'architect',
    icon: Landmark,
    title: 'System & Software Architecture',
    headline: 'Decisions you can defend',
    tagline: 'Two days of design workshops, not lectures — trade-offs named, costs written down, two full systems defended under review.',
    audience:
      'For senior engineers and tech leads expected to make architecture calls — monolith or microservices, strong or eventual consistency, where the queue goes — without ever having been taught how.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['mermaid'],
    tags: ['Architecture'],
    stats: [{ value: '2', label: 'systems designed end-to-end' }, { value: '1', label: 'design defended under review' }, { value: '0', label: 'patterns taught without their cost' }],
    pains: [
      'You got promoted into architecture decisions and nobody ever taught you how to make them — you’re guessing with confidence.',
      '“Should this be a microservice?” gets answered by fashion and blog posts, not by trade-offs.',
      'The moment someone asks “why did you do it this way?” in a review, you reach for “best practice” because you never learned to name the cost.',
      'Six months later nobody remembers why the architecture is the way it is — the reasoning evaporated into a Slack thread.',
    ],
    outcomes: [
      'A working trade-off vocabulary: load-bearing vs reversible decisions, and the cost attached to every pattern',
      'Day 1 artifacts: boundary diagram, monolith/modular/microservices trade-off matrix, data-ownership + consistency map, annotated cache/queue flow, one written ADR',
      'Day 2 artifacts: a capacity-estimation worksheet and two systems designed end-to-end as C4-style diagrams — one defended under structured review',
      'Take-home tools: an architecture review checklist and an ADR template, usable at work Monday',
    ],
    proof: [
      'Every pattern taught with its stated cost — the course’s spine is trade-offs, not fashion',
      'Two full systems designed and defended per attendee — a wall of your own diagrams and ADRs, not slides about architecture',
      'Built on real production architecture experience — the trainer runs 60+ repositories on written architecture conventions',
    ],
  },
  {
    slug: 'ai-augmented-architecture',
    stage: 'architect',
    icon: Compass,
    title: 'AI-Augmented Architecture & Solution Design',
    headline: 'Design with AI. Decide as the architect.',
    tagline: 'Use AI for real architecture work — as-is maps, trade-offs, ADRs, C4 diagrams, migration plans — while staying the decision-maker.',
    audience:
      'The senior-track course of DevHub’s AI-augmented family: for tech leads, solution architects, and senior engineers who already use AI for code but don’t trust it for design. This course makes that trust earned, not assumed.',
    duration: '2 days',
    delivery: 'Physical',
    hrdCorp: true,
    logos: ['claude', 'mermaid'],
    tags: ['AI', 'Architecture'],
    stats: [{ value: '60+', label: 'production repos behind the discipline' }, { value: '3', label: 'distinct solution options per brief' }, { value: '1', label: 'solution pack defended live' }],
    pains: [
      'You trust AI to write a function but not to design a system — and you’re right, but “don’t trust it” left a productivity gap you can feel.',
      'AI describes an architecture your codebase doesn’t have, fluently, and you have to catch every confident invention by hand.',
      'Ask it for three options and get one idea at three price points — real trade-off analysis still falls entirely on you.',
      'Everyone demos AI writing code. Nobody shows a senior person producing an ADR, a C4 diagram, or a migration plan they’d actually defend to a board.',
    ],
    outcomes: [
      'A verified as-is architecture map of a codebase you didn’t write — every element evidence-backed',
      'Three genuinely distinct solution options and a stress-tested trade-off matrix, with one decision you made and defended',
      'One ADR you own and signed; C4 L1 + L2 diagrams traceable to evidence; a phased migration plan with a scored risk register',
      'A complete solution-design pack for an RFP-style brief — defended live before a peer review panel',
      'A repeatable discipline: ground AI in real evidence, tag evidence vs assumption, keep the human as decision-maker',
    ],
    proof: [
      'Built and run by a practising architect across 60+ production repositories — the same grounding-and-verification discipline the course teaches',
      'The method is DevHub’s The Loop (Context → Plan → Build & Verify → Learn), already taught in the development-track courses — applied here at design altitude',
      'Labs run on a real open-source codebase and RFP-style briefs, never toy examples',
    ],
  },
];

// Social-kit artwork copied from the DevHub Academy repo (01-marketing/social)
// into public/images/trainings/<stage>/<slug>/ as webp — dark + light variants:
//   cover   (16:9)  x-twitter cover  — landing hero banner
//   diagram (16:9)  linkedin diagram — method/course visual
//   quote   (4:5)   linkedin quote-1 — tagline poster
// Brand logos vendored from simpleicons.org (brand colours baked into the
// SVG fill) — render on a light chip so dark-coloured marks stay visible in
// dark mode.
export function trainingLogo(slug: string): string {
  return `/images/logos/${slug}.svg`;
}

export function trainingImage(
  training: Training,
  name: 'cover' | 'diagram' | 'quote',
  theme: 'dark' | 'light',
): string {
  return `/images/trainings/${training.stage}/${training.slug}/${name}-${theme}.webp`;
}

export function trainingByPath(stage: string, slug: string): Training | undefined {
  return trainings.find((t) => t.stage === stage && t.slug === slug);
}

export interface TrainingFaq {
  q: string;
  a: string;
}

// Catalogue-level FAQs for the /trainings listing — the questions a visitor
// comparing courses actually has (path structure, ordering, private runs,
// registration). Rendered by TrainingsIndex and mirrored into FAQPage JSON-LD.
const stageSummary = (Object.keys(STAGES) as Stage[])
  .sort((a, b) => STAGES[a].order - STAGES[b].order)
  .map((stage) => `Stage ${STAGES[stage].order} · ${STAGES[stage].label} — ${STAGES[stage].blurb}`)
  .join(' ');

export const catalogueFaqs: TrainingFaq[] = [
  {
    q: 'How is the training path structured?',
    a: `${trainings.length} hands-on courses across four stages. ${stageSummary}`,
  },
  {
    q: 'Do I need to follow the stages in order?',
    a: 'No. The stages mark depth, not prerequisites — take the stage you need today and come back for the next as your craft matures.',
  },
  {
    q: 'Do you run private or in-house trainings for teams?',
    a: 'Yes — any course in the catalogue can be delivered as a private, in-house run for your team upon request. Reach out through the contact section on our homepage and we’ll shape the run around your team.',
  },
  {
    q: 'Where do I see upcoming dates, pricing and registration?',
    a: 'On our GatherHub page — dates, venues, pricing and registration all live there. If no run is scheduled yet, hit “Get Notified” and you’ll be first in line when registration opens.',
  },
];

// FAQ copy for the landing pages, composed from catalogue fields plus the
// shared operating rules (scheduling/pricing/registration live on GatherHub;
// delivery format and duration are decided per run). TrainingDetail renders
// these AND mirrors them into FAQPage JSON-LD — deriving both from this one
// helper keeps the visible copy and the schema in sync, which Google requires.
export function trainingFaqs(training: Training): TrainingFaq[] {
  return [
    {
      q: `Who is ${training.title} for?`,
      a: training.audience,
    },
    {
      q: 'What do I walk away with?',
      a: `Artifacts you built yourself, not notes — including: ${training.outcomes
        .slice(0, 3)
        .join('; ')}.`,
    },
    {
      q: 'Is this training hands-on or lecture-based?',
      a: 'Hands-on. Our trainings are taught by practitioners who ship production software daily — you spend the sessions building, breaking and fixing real things, not watching slides.',
    },
    {
      q: 'Is it delivered online or in person?',
      a: 'Delivery format and duration are decided per run — some runs are physical, some online. The details for each scheduled session are published on our GatherHub page.',
    },
    {
      q: 'How do I register, and how much does it cost?',
      a: 'Dates, venues, pricing and registration all live on our GatherHub page. If no run is scheduled yet, hit “Get Notified” and you’ll be first in line when registration opens.',
    },
  ];
}

export function trainingPath(training: Training): string {
  return `/trainings/${training.stage}/${training.slug}`;
}
