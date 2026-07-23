#!/usr/bin/env python3
"""Regenerate /trainings artwork from the DevHub Academy social-kit generator.

Web variants differ from the social pack on purpose:
  - kicker reduced to "DEVHUB ACADEMY" — no duration / delivery / HRD Corp text
    (delivery format and duration are decided per run; HRD Corp is on hold)
  - chips filtered the same way (drops "2 DAYS", "PHYSICAL", "HRD CORP", ...)
  - subtitle/description overridden where the social copy leads with mandays
    ("Two days, hands-on: ..." → "Hands-on: ...") — see WEB_COPY
  - cover renders with no internal footer at all, so the hero banner ends clean
    instead of showing a mid-page brand strip; quote/diagram keep the brand row
    but drop the "reply/DM <keyword>" CTA (webpage, not a post)
  - quote card rendered square with a larger type scale so it stays readable at
    sidebar width; diagram gets a mild bump too

Dev-only tool (not part of the build): needs the trainings repo checked out and
headless Chrome. Output overwrites public/images/trainings/<stage>/<slug>/*.webp.

Usage:
    python3 scripts/generate-training-images.py [path-to-trainings-repo]
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Trainings/2026/claude-code"

sys.path.insert(0, str(SRC / "_tools/social-kit"))
import generate as g  # noqa: E402  (the courseware repo's generator)

# course dir (in trainings repo) -> site path (stage/slug)
COURSES = {
    "01-foundation/01-linux-for-developers": "foundation/linux-for-developers",
    "01-foundation/02-mastering-git": "foundation/mastering-git",
    "01-foundation/03-docker-fundamentals": "foundation/docker-fundamentals",
    "01-foundation/04-modern-php": "foundation/modern-php",
    "02-practitioner/01-laravel-livewire": "practitioner/laravel-livewire",
    "02-practitioner/02-flutter-dart": "practitioner/flutter-dart",
    "02-practitioner/03-api-design-security-operations": "practitioner/api-design-security-operations",
    "02-practitioner/04-the-augmented-developer": "practitioner/augmented-developer",
    "03-professional/01-keycloak-sso": "professional/keycloak-sso",
    "03-professional/02-observability": "professional/observability",
    "03-professional/03-ai-augmented-development": "professional/claude-code-mcp-laravel",
    "04-architect/01-software-architecture": "architect/software-architecture",
    "04-architect/02-ai-augmented-architecture": "architect/ai-augmented-architecture",
}

# asset name -> (card id, width, height, type-scale)
ASSETS = {
    "cover": ("cover", 1920, 1080, 1.28),   # generator's own wide-canvas scale
    "diagram": ("diagram", 1920, 1080, 1.5),
    "quote": ("quote-1", 1080, 1080, 1.6),
}

DROP_CHIP = re.compile(r"\b(DAYS?|HOURS?|PHYSICAL|IN-PERSON|ONLINE|HRD)\b", re.I)

# Per-course cover copy without manday/venue lead-ins. The social pack keeps its
# own copy; only the web renders use these. Keyed by site path (stage/slug).
WEB_COPY = {
    "foundation/linux-for-developers": {
        "description": "Hands-on: build one Linux server from empty to a firewalled, self-healing, deployed web app — then break it three ways and fix it yourself. All on a disposable VM on your own laptop.",
    },
    "foundation/mastering-git": {
        "description": "Hands-on: every scary git scenario — lost commits, botched rebases, real conflicts — provoked on purpose, then repaired by you. You leave able to fix any history, with a one-page team git playbook for Monday.",
    },
    "foundation/docker-fundamentals": {
        "subtitle": "Containerise anything. Explain every line.",
    },
    "foundation/modern-php": {
        "description": "Hands-on: from procedural PHP to modern PHP 8.2+ OOP, SOLID, and the design patterns that show up in real codebases. You leave with a project you built and refactored yourself — and the judgement to know which pattern a problem actually needs.",
    },
    "practitioner/laravel-livewire": {
        "subtitle": "From tutorial-done to production-ready.",
        "description": "Hands-on: build one real app the production way — conventions, Form Requests, policies, a reactive Livewire UI, a green Pest suite and a deploy checklist. You leave with the codebase, not notes.",
    },
    "practitioner/flutter-dart": {
        "subtitle": "From empty project to signed release.",
        "description": "Hands on keyboards: build one real Flutter app from an empty project to a signed release that talks to a live backend. You leave able to ship mobile — not just follow a tutorial.",
    },
    "practitioner/api-design-security-operations": {
        "description": "Hands-on: take a demo API from inconsistent-and-insecure to designed, contract-tested, secured and operable. You leave with the working API and a one-page API standard your team can adopt on Monday.",
    },
    "practitioner/augmented-developer": {
        "description": "Live on real repositories — the full loop behind how one architect ships production work with Claude. Watch-friendly. You leave with the method map + a starter CLAUDE.md template.",
    },
    "professional/keycloak-sso": {
        "description": "Hands-on: stand up Keycloak in Docker, wire real OIDC login, a token-protected API, and SSO across two apps — tracing every login from browser redirect to signed token to role check. Any stack.",
    },
    "professional/observability": {
        "description": "Hands-on: build a full observability stack from scratch — logs, metrics, and traces through Prometheus, Grafana, OpenTelemetry, and Jaeger — and use it to catch and debug incidents before users report them.",
    },
    "professional/claude-code-mcp-laravel": {
        "description": "Hands-on: become fluent with Claude Code, then build, secure, and connect your own Laravel MCP server — and consume it back through the agent. You leave with working infrastructure, not notes.",
    },
    "architect/software-architecture": {
        "description": "Hands-on, for senior engineers and tech leads who make architecture calls without ever having been taught how. You leave with a defensible method — trade-off vocabulary, an ADR practice, and two systems you designed and defended in the room.",
    },
    "architect/ai-augmented-architecture": {
        "description": "For senior engineers, tech leads and architects who use AI for code but won't touch it for design. Ground an AI in a real codebase and a real brief, produce the artefacts architects own — then defend the full pack before a peer review panel.",
    },
}


def brand_footer(_cfg):
    # Web variant: brand row + gradient bar, no reply/DM CTA.
    return (
        '<div class="foot">'
        '<div class="brand">DEV<span>HUB</span><em>ACADEMY</em></div>'
        "</div>"
        '<div class="bar"></div>'
    )


def no_footer(_cfg):
    # Cover web variant: the site's hero card frames it — no internal footer.
    return ""


def sanitize(cfg, dest):
    out = dict(cfg)
    out["kicker"] = "DEVHUB ACADEMY"
    out["chips"] = [c for c in cfg["chips"] if not DROP_CHIP.search(c)]
    out.update(WEB_COPY.get(dest, {}))
    return out


def page_html(cfg, card_id, theme, w, h, scale):
    t = dict(g.THEMES[theme])
    t["root"] = f"{min(w, h) / 54 * scale:.2f}"
    t["w"], t["h"] = w, h
    size_class = "wide" if w > h * 1.3 else ("story" if h > w * 1.5 else "tall")
    return (
        f'<!DOCTYPE html><html class="{size_class}"><head><meta charset="utf-8">'
        f"<style>{g.CSS % t}</style></head><body>{g.card_html(cfg, card_id)}</body></html>"
    )


def main():
    build = Path(tempfile.mkdtemp(prefix="training-images-"))
    jobs = []
    for course, dest in COURSES.items():
        cfg = sanitize(
            json.loads((SRC / course / "01-marketing/social/social-kit.json").read_text()), dest
        )
        outdir = REPO / "public/images/trainings" / dest
        outdir.mkdir(parents=True, exist_ok=True)
        for name, (card_id, w, h, scale) in ASSETS.items():
            g.footer = no_footer if name == "cover" else brand_footer
            for theme in g.THEMES:
                f = build / f"{dest.replace('/', '-')}-{name}-{theme}.html"
                f.write_text(page_html(cfg, card_id, theme, w, h, scale), encoding="utf-8")
                jobs.append((f, build / f"{f.stem}.png", w, h, outdir / f"{name}-{theme}.webp"))
    g.footer = brand_footer

    def render(job):
        htmlfile, png, w, h, webp = job
        g.shoot((htmlfile, png, w, h))
        subprocess.run(["cwebp", "-quiet", "-q", "82", str(png), "-o", str(webp)], check=True)
        return webp

    from concurrent.futures import ThreadPoolExecutor

    ok = 0
    with ThreadPoolExecutor(max_workers=4) as ex:
        for webp in ex.map(render, jobs):
            ok += 1
            print(f"OK {webp.relative_to(REPO)}", flush=True)
    print(f"{ok}/{len(jobs)} images")


if __name__ == "__main__":
    main()
