#!/usr/bin/env python3
"""Regenerate /trainings artwork from the DevHub Academy social-kit generator.

Web variants differ from the social pack on purpose:
  - kicker reduced to "DEVHUB ACADEMY" — no duration / delivery / HRD Corp text
    (delivery format and duration are decided per run; HRD Corp is on hold)
  - chips filtered the same way (drops "2 DAYS", "PHYSICAL", "HRD CORP", ...)
  - footer shows the brand only — no "reply/DM <keyword>" CTA (webpage, not a post)
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


def brand_footer(_cfg):
    # Web variant: brand row + gradient bar, no reply/DM CTA.
    return (
        '<div class="foot">'
        '<div class="brand">DEV<span>HUB</span><em>ACADEMY</em></div>'
        "</div>"
        '<div class="bar"></div>'
    )


g.footer = brand_footer


def sanitize(cfg):
    out = dict(cfg)
    out["kicker"] = "DEVHUB ACADEMY"
    out["chips"] = [c for c in cfg["chips"] if not DROP_CHIP.search(c)]
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
        cfg = sanitize(json.loads((SRC / course / "01-marketing/social/social-kit.json").read_text()))
        outdir = REPO / "public/images/trainings" / dest
        outdir.mkdir(parents=True, exist_ok=True)
        for name, (card_id, w, h, scale) in ASSETS.items():
            for theme in g.THEMES:
                f = build / f"{dest.replace('/', '-')}-{name}-{theme}.html"
                f.write_text(page_html(cfg, card_id, theme, w, h, scale), encoding="utf-8")
                jobs.append((f, build / f"{f.stem}.png", w, h, outdir / f"{name}-{theme}.webp"))

    ok = 0
    for htmlfile, png, w, h, webp in jobs:
        g.shoot((htmlfile, png, w, h))
        subprocess.run(["cwebp", "-quiet", "-q", "82", str(png), "-o", str(webp)], check=True)
        ok += 1
        print(f"OK {webp.relative_to(REPO)}")
    print(f"{ok}/{len(jobs)} images")


if __name__ == "__main__":
    main()
