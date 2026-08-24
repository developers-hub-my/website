---
title: Universal AI Coding Agent Formula
description: Most CLAUDE.md guides read like project documentation — ten sections, several hundred lines, everything included "for full context." The problem is that the file loads every session and eats your context budget, and longer files reduce adherence rather than improving it. This breaks down what actually belongs in the file, what should become a Skill or a path-scoped rule, and gives you a 35-line template to start from.
date: 2026-08-24
updated: 2026-08-24
author: Nasrul Hazim
authorTitle: Managing Director
tags:
  - AI
cover: ''
coverAlt: ''
canonical: ''
draft: false
---

## Read this first

CLAUDE.md is **not project documentation**. It's a **context budget**.

Every session, this file gets loaded into the context window — consuming tokens alongside your actual conversation. The official guidance is to **target under 200 lines**. Longer files consume more context *and* reduce adherence.

Which means: the longer your CLAUDE.md, the **less** the AI follows it.

A typical 10-section formula, written out in full, lands somewhere between 600 and 1,000 lines. That isn't tuning. That's sabotage.

---

## The one rule for writing it

> If the AI can read it from the codebase, **don't put it in CLAUDE.md**.

This isn't an opinion. Claude Code ships a checkup (`/doctor`) that proposes trims for your CLAUDE.md — it cuts content derivable from the codebase (directory layouts, dependency lists, architecture overviews) and **keeps** pitfalls, rationale, and conventions that differ from tool defaults.

Use that as your knife. Every line has to pass this test:

| Question | If YES |
|---|---|
| Could the AI figure this out by reading 2-3 files? | Cut it |
| Is this general knowledge (OWASP, SOLID, N+1)? | Cut it |
| Is this relevant to *every* task? | Keep it |
| Is this verifiable (pass/fail)? | Keep it |
| Is this a multi-step procedure? | Move to a Skill |
| Does this only apply to one folder? | Move to a path-scoped rule |
| Must this run every single time? | Move to a Hook |

---

## Part 1 — What goes IN

Seven sections. Short ones.

### 1. Commands

The highest-value item in the entire file. Most formulas don't mention it at all.

```
- Test: `php artisan test`  | single: `php artisan test --filter=OrderTest`
- Lint: `./vendor/bin/pint --dirty`
- Fresh DB: `php artisan migrate:fresh --seed`
- Dev: `composer dev`
```

### 2. Environment quirks

The things that will trip the AI up but aren't visible in the code.

```
- PHP 8.3, Laravel 12. We use Herd, not Sail.
- Queue must be run manually in dev: `php artisan queue:work`
- Tests run on Postgres, not SQLite — array/JSON column behaviour differs.
```

### 3. Conventions (the ones that DIFFER from defaults)

The key word is **differ**. Don't teach the AI Laravel. And point at an example file — one reference file beats three paragraphs of description.

```
- Public IDs are UUIDs, internal IDs auto-increment. Never expose internal IDs.
- Business logic → invokable Action class.
  Reference: `app/Actions/Order/PlaceOrder.php`
- Side effects → Observers, never in controllers.
- Enums must implement `label()` and `color()`.
  Reference: `app/Enums/OrderStatus.php`
- Swappable backends → driver pattern (contract + manager).
```

### 4. Boundaries — what's off-limits

Almost always missing. This is the section that saves you a long night.

```
- Never edit migrations already merged to `main` — add a new one.
- Never modify `database/schema/*.dump` or lock files.
- Ask before adding a new composer dependency.
- Never delete tests to make the suite pass.
```

### 5. Domain vocabulary

Words that mean something specific in your business. The AI can't guess these.

```
- "Tenant" = the client organisation, not a user.
- "Agent" = internal support staff. "Member" = client-side user.
- Source of truth for billing is Stripe, not the `subscriptions` table.
```

### 6. Definition of done

```
Pint clean, `php artisan test` green, new behaviour has a Pest test.
```

### 7. Do / Don't (keep it short)

This format works. Just keep it to five or six lines, not twenty. And watch for contradictions — if two rules conflict, the AI may pick one arbitrarily.

---

## Part 2 — What goes OUT (and where it goes instead)

The sections below aren't wrong. They're in the wrong place.

| Section | Where it belongs | Why |
|---|---|---|
| Workflow (Understand → Explore → Plan → …) | **Skill** or slash command | A per-task procedure, not a per-session fact. Multi-step procedures belong in skills |
| Change management checklist | **Skill** / `/plan` command | Only needed for large changes. No reason for it to sit in context 24/7 |
| Documentation rules | **`.claude/rules/docs.md`** with `paths: ["docs/**"]` | Loads only when docs are being touched |
| Security rules (the OWASP list) | **Cut 90%** | The model already knows SQL injection, XSS, CSRF. Listing categories burns tokens and changes nothing. Keep only what's project-specific |
| Performance rules | **Cut 80%** | "Don't optimise blindly" is unfalsifiable. Rewrite as: "Every list endpoint paginates. No Eloquent calls inside loops" |
| Known gotchas | **`.claude/rules/gotchas.md`** | The best section in any formula — but it grows without bound. Split it out and prune quarterly |
| "Lint before commit" | **Hook** | CLAUDE.md is context, not enforcement. If something MUST run at a specific point, write a hook |
| Self-learning rule | **Largely automated now** | Auto memory already records your preferences, the corrections you give, and the approaches you confirm. You don't need to maintain this by hand |

---

## Part 3 — The scope hierarchy most guides miss

It isn't one file. There are four layers, loaded from broadest to most specific:

| Scope | Location | Purpose |
|---|---|---|
| Managed policy | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Company-wide standards, deployed via MDM |
| User | `~/.claude/CLAUDE.md` | Personal preferences across all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared, committed to git |
| Local | `./CLAUDE.local.md` | Personal to this project. Add to `.gitignore` |

And for larger projects: `.claude/rules/` — one file per topic, scopable to specific paths via YAML frontmatter:

```markdown
---
paths:
  - "app/Http/Api/**/*.php"
---
# API Rules
- Every endpoint validates through a Form Request.
- Responses go through API Resources, never return models directly.
```

A rule like this **only** enters context when the AI touches a matching file. This is the actual answer to "my rules file is too long."

⚠️ One thing a lot of articles get wrong: splitting with `@path` imports does **not** reduce context — imported files still load at launch. It helps organisation, nothing more. Path-scoped rules are what actually save context.

---

## Part 4 — A template you can use today

This is the entire CLAUDE.md. Around 35 lines. It will outperform an 800-line version.

```markdown
# Belian — procurement system for Malaysian SMEs. Users: purchasing officers + approvers.

## Commands
- Test: `php artisan test` | single: `php artisan test --filter=X`
- Lint: `./vendor/bin/pint --dirty`
- Fresh DB: `php artisan migrate:fresh --seed`

## Environment
- PHP 8.3 / Laravel 12 / Herd. Postgres, not SQLite.
- Queue must be run manually in dev.

## Conventions (differ from Laravel defaults)
- Public IDs are UUIDs, internal IDs auto-increment. Never expose internal IDs.
- Business logic → invokable Action. Reference `app/Actions/PO/ApprovePO.php`
- Side effects → Observers, not controllers.
- Enums implement `label()` + `color()`. Reference `app/Enums/POStatus.php`
- Swappable backends → contract + driver manager.

## Boundaries
- Never edit migrations already merged to `main`.
- Never delete tests to force the suite green.
- Ask before adding a dependency.

## Vocabulary
- "Requisition" = pre-approval request. "PO" = post-approval.
- Source of truth for suppliers is the SSM API, not the local table.

## Done means
Pint clean, tests green, new behaviour has a Pest test.

## Gotchas
@.claude/rules/gotchas.md
```

---

## Part 5 — The maintenance loop

| When | Do this |
|---|---|
| Starting a project | `/init` — the AI reads the codebase and drafts a starting file |
| After editing | `/context` — confirm the file actually loaded |
| When the file bloats | `/doctor` — it proposes what to trim |
| To see what the AI remembers | `/memory` |
| AI makes the same mistake twice | *Now* add a line |

The rule for adding content: **don't write it upfront**. Wait until the AI makes the same mistake a second time, or a code review catches something it should have known. If you're typing the same correction you typed last session, that's the signal it belongs in CLAUDE.md.

---

## Common mistakes, summarised

| Mistake | Fix |
|---|---|
| Writing everything "for full context" | Write only what can't be derived from code |
| Listing categories (`Error handling`, `Logging`) | Write instructions you can verify |
| Teaching general knowledge (OWASP, SOLID) | The model knows. Cut it |
| Explaining a pattern in three paragraphs | Point at one reference file |
| Putting workflow procedures in CLAUDE.md | Make it a Skill |
| Treating CLAUDE.md as enforcement | It's context, not enforcement. Use a Hook |
| One giant file for a monorepo | `.claude/rules/` + path scoping |

---

## One closing line

Most formulas answer the question **"what does the AI need to know?"**

The real question is **"what can't the AI figure out on its own?"**

The second answer is 10% the size of the first — and ten times more effective.

---

*Reference: [Claude Code memory documentation](https://code.claude.com/docs/en/memory)*
