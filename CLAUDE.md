# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The GitHub Pages **user site** for `sebastiancordoba` (served at `https://sebastiancordoba.github.io/`). It is a hand-written static page — no build step, no package manager, no tests, no linter. Pushing to `main` deploys it.

Preview locally with any static server, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Structure

- `index.html` — the whole page: nav, hero, project list, footer, and an inline `<script>` (smooth anchor scrolling + a typing effect that fills `#hero-text` and `#prompt-text`).
- `index.css` — neutral base layout and color tokens (`:root` vars, Outfit font, containers, project cards).
- `terminal.css` — the "terminal" look: IBM Plex Mono, text glow/flicker, grain (`::before`) and scanline (`::after`) overlays, the background bird silhouettes (`image.png`), and the blinking cursor. Every rule is scoped under `.terminal-theme`, which is set on `<body>`.

Keep that split: git history shows terminal effects were deliberately moved out of `index.css` and scoped to `.terminal-theme` so they don't bleed into the project sub-sites. New visual effects go in `terminal.css` under `.terminal-theme`; `index.css` stays plain.

## Project list

The page is a portfolio index of the owner's other GitHub Pages project sites, each served at `https://sebastiancordoba.github.io/<repo>/`. Each is an `<a class="project-card">` in `main#work .project-section` with an `<h3>` in the form `NN_REPO-NAME` (sequential two-digit prefix) and a one-line `<p>` description (typically taken from the repo description; Spanish or English is fine).

To find Pages-enabled repos that aren't listed yet:

```sh
gh api --paginate '/user/repos?affiliation=owner&per_page=100' --jq '.[] | select(.has_pages) | .name'
```

and compare against the `href`s in `index.html`. Some are intentionally omitted (e.g. `PhotoDashboard` was removed on purpose), so confirm with the owner before adding.
