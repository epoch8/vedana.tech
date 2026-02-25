# Marketing Static Website Template

A marketing landing page built with Astro React, and (maybe) Ant Design.
Ant Design usage will be reconsidered in future.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Intended File Structure

```
src/
├── pages/
│   └── index.astro                # Page composition (assembles sections)
│
├── components/
│   ├── primitives/                # Atomic UI building blocks
│   │   ├── Button.astro
│   │   ├── Container.astro
│   │   ├── Section.astro
│   │   ├── Heading.astro
│   │   └── Icon.astro
│   │
│   ├── common/                    # Reusable structured blocks
│   │   ├── FAQ/
│   │   │   ├── FAQ.astro
│   │   │   └── FAQ.module.css
│   │   ├── CTA/
│   │   │   ├── CTA.astro
│   │   │   └── CTA.module.css
│   │   ├── FeatureGrid/
│   │   ├── ProblemTable/
│   │   │   ├── ProblemTable.jsx   # React island (if needed)
│   │   │   └── ProblemTable.module.css
│   │   └── MiniDemo/
│   │       ├── MiniDemo.jsx       # React island
│   │       └── MiniDemo.module.css
│   │
│   ├── sections/                  # Marketing compositions
│   │   ├── Hero/
│   │   │   └── Hero.astro
│   │   ├── Problem/
│   │   │   └── Problem.astro
│   │   ├── Methodology/
│   │   │   └── Methodology.astro
│   │   ├── Industries/
│   │   └── Pilot/
│   │
│   └── layout/                    # Global layout infrastructure
│       ├── Header/
│       │   ├── Nav.jsx            # React island (sticky nav)
│       │   └── Nav.module.css
│       ├── Footer/
│       │   └── Footer.astro
│       └── PageLayout.astro
│
├── content/                       # Product-specific content
│   ├── vedana/
│   │   ├── faq.ts
│   │   ├── hero.ts
│   │   └── industries.ts
│   └── epoch/
│
├── styles/
│   ├── tokens.css                 # Design tokens (CSS variables)
│   ├── base.css                   # Global reset + utilities
│   └── themes/
│       ├── vedana.css
│       ├── epoch.css
│       └── neutral.css
```

### Mental Model

* primitives → Lego bricks
* common → reusable blocks
* sections → marketing compositions, built with reusable blocks and primitives
* layout → skeleton
* content → personality
* styles → skin

If something feels misplaced, it probably is.

## Architecture

The page uses Astro's islands architecture:

- **Static sections** (`Hero`, `Problem`, `Methodology`, `CTA`, `Footer`) are rendered to plain HTML at build time — no JavaScript shipped to the browser.
- **React islands** (`Nav`, `MiniDemo`, `FAQ`, `ProblemTable`, `CTAButtons`, `PhotoCircle`) are hydrated client-side using `client:load` or `client:visible`.

Styling uses Ant Design's CSS reset plus scoped `<style>` blocks in Astro components and CSS Modules in React islands. No Tailwind.

## Deployment

Deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. Runs automatically on push to `master`.
