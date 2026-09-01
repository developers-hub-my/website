---
title: Welcome to the Developers Hub blog
description: >-
  We are moving our writing back onto devhub.my. Here is what we plan to
  publish, who writes it, and how the whole thing is put together.
date: 2026-08-24
author: Nasrul Hazim
authorTitle: Founder, Developers Hub Sdn Bhd
tags:
  - Announcements
  - Engineering
---

For a while our writing lived on a separate subdomain, away from everything
else we do. That never quite worked. The trainings are here, the services are
here, the company is here — the writing should be here too.

So this is the new home: **devhub.my/resources**.

## What we will publish

We are a small team that ships production software and teaches other people to
do the same. The blog follows the same two tracks:

- **Field notes from real projects.** What broke, what we changed, and what we
  would do differently. Laravel, PHP, Docker, identity, observability, APIs —
  the stack we actually run.
- **Training notes.** The reasoning behind our course material: why a topic is
  in the syllabus, where teams usually get stuck, and the exercises that seem
  to make it click.

Not everything will be long. A short post that saves someone an afternoon is
worth more than an essay nobody finishes.

## How it works

The blog is part of this website rather than a separate platform. Every post is
a markdown file in the site's repository, rendered to HTML at build time and
served as static files — no database, no runtime queries, nothing to keep
patched.

Writing happens in a small CMS at `/admin`. It reads and writes the same
markdown files straight to GitHub, so publishing is a commit and the site
rebuilds itself. Editors get a form; the repository stays the single source of
truth.

```bash
content/blog/welcome-to-the-developers-hub-blog.md   # what you are reading
```

If you would rather read in a feed reader, the RSS feed is at
[devhub.my/rss.xml](https://devhub.my/rss.xml).

## Say hello

If a post is useful — or wrong — we would like to know. Reach us at
[hello@devhub.my](mailto:hello@devhub.my). If you are looking for training for
your team, the full catalogue is at [Trainings](https://devhub.my/trainings/).
