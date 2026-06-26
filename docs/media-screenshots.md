# Media screenshots

Native pages that render product screenshots in the site's hero style (logo,
floating doc cloud, headline + caption, browser frame) for Product Hunt,
landing, social, OG. Rendered by the real site, so fonts, logo and styling
stay in sync with vedana.tech instead of being faked in an image editor.

- Pages live at `/media/screenshots/<id>` plus an index at `/media/screenshots/`.
- A vertical **Instagram Stories** variant lives at `/media/stories/<id>` (1080×1920),
  same content, different layout. See "Instagram Stories" below.
- They are `noindex` and out of the sitemap / nav. Internal tooling.
- Design docs (vault): `🌅 Vedana/design-docs/2026-06-10 Media screenshots pages — design.md`
  and `… 2026-06-10 Media screenshots Instagram Stories — design.md`.

## How it works

Screenshots are an **Astro content collection** (`screenshots`). One entry +
its co-located PNG = one page. Nothing else to wire up.

```
src/content/screenshots/
  01-chat.md        01-chat.png
  02-etl.md         02-etl.png
  03-queries.md     03-queries.png
  ...
```

- Collection schema: `src/content/config.ts` (`title`, `caption`, `url`, `order`, `shot: image()`).
- Route: `src/pages/media/screenshots/[id].astro` (reads the collection via `getCollection`).
- Index: `src/pages/media/screenshots/index.astro`.
- Frame component: `src/components/products/vedana/media/Frame.astro`.
- Bare layout (no header/footer): `src/layouts/MediaLayout.astro`.
- Capture target: a `.stage` node sized exactly **1270×760** (PH gallery).

## Add a screenshot

1. Drop the PNG into `src/content/screenshots/` (e.g. `06-foo.png`).
2. Add `06-foo.md` next to it:

   ```markdown
   ---
   order: 6
   title: "Headline goes here."
   caption: "One or two short sentences."
   url: "app.vedana.tech/foo"
   shot: ./06-foo.png
   ---
   ```

3. That's it — the page `/media/screenshots/06-foo` and an index card appear on
   the next dev reload / build. `order` controls position.

### Two-line title or caption

Use a YAML literal block (`|-`) and put each line on its own row. `.stage-title`
and `.stage-caption` have `white-space: pre-line`, so the breaks render.

```markdown
title: |-
  Describe your domain.
  Vedana puts it into a knowledge graph.
caption: |-
  First line of the caption.
  Second line of the caption.
```

Single line — just keep it quoted: `title: "All on one line."`

## Instagram Stories

The same five entries also render as vertical **1080×1920** story frames at
`/media/stories/<id>` (index at `/media/stories/`). Same content collection, no
extra files — adding a screenshot gives you both the horizontal page and the
story automatically.

- Route: `src/pages/media/stories/[id].astro`, index `…/stories/index.astro`.
- Layout: logo + larger headline + caption at the top, then the screenshot in a
  tilted, enlarged browser frame; floating doc cloud fills the background.
- Content is kept inside Instagram's safe zones (top ~250px, bottom ~310px).
- Tilt and scale are CSS variables on `.stage--story` in the route file
  (`--story-tilt`, `--story-scale`) plus the `transform-origin` on
  `.story-shot .media-frame` — tweak there if a screen reads badly under the
  angle.

## Capture the images (script)

No "A, not B" contrast constructions and no em/en dashes. Use plain sentences,
colons or commas.

## Capture the images (script)

`scripts/shoot-screenshots.mjs` opens each page on the running dev server,
freezes the doc animation for a deterministic frame, and captures the `.stage`
node.

One-time setup:

```bash
npm i -D playwright
npx playwright install chromium
```

Run (with `npm run dev` going in another terminal):

```bash
npm run shots                  # horizontal screenshots → media-shots/screenshots/
npm run shots TARGET=stories   # Instagram Stories      → media-shots/stories/
npm run shots TARGET=both      # both
```

Options are passed as `KEY=VALUE` args (shown above) or env vars; args win.

| var      | default                 | meaning                                                    |
|----------|-------------------------|------------------------------------------------------------|
| `TARGET` | `screenshots`           | `screenshots` \| `stories` \| `both`                       |
| `DPR`    | per target              | screenshots → `2` (2540×1520); stories → `1` (1080×1920)   |
| `ANIM`   | `0`                     | `1` keeps the doc animation live                           |
| `OUT`    | `./media-shots`         | output folder (a `screenshots/` or `stories/` subdir is added) |
| `BASE`   | `http://localhost:4321` | dev server origin (if not the default port)                |

The screenshots default is dpr 2 → **2540×1520** (2× the PH gallery size).
Stories default to dpr 1 → exact **1080×1920** (dpr 2 would be an oversized
2160×3840). The script reads ids straight from `src/content/screenshots/*.md`,
so a newly added screen is picked up automatically for both targets.

## Gotcha: renaming entries

Astro caches the content collection (incl. image imports) under `.astro/`. If
you rename a `.md`/`.png` entry and the dev server complains it can't find the
old image, stop the server, `rm -rf .astro`, and `npm run dev` again.
