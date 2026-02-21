# Vedana.tech Landing Page

A marketing landing page built with Astro, React, and Ant Design.

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

## File Structure

```
src/
├── pages/
│   └── index.astro           # Page shell and section assembly
├── styles/
│   └── global.css            # Global reset (antd) and shared utilities
└── components/
    ├── BrandLogo.astro        # Logo mark + wordmark
    ├── Hero.astro             # Hero section with headline and CTA buttons
    ├── ProcessDiagram.astro   # SVG process flow diagram
    ├── Problem.astro          # Problem section wrapper
    ├── ProblemTable.jsx       # Comparison table (antd Table) — React island
    ├── Nav.jsx                # Sticky navigation header — React island
    ├── Nav.module.css
    ├── MiniDemo.jsx           # Interactive demo with typewriter animation — React island
    ├── MiniDemo.module.css
    ├── PhotoCircle.jsx        # Author photo with fallback — React island
    ├── PhotoCircle.module.css
    ├── Methodology.astro      # Methodology/credibility section
    ├── FAQ.jsx                # FAQ with antd Collapse — React island
    ├── CTA.astro              # Call-to-action section wrapper
    ├── CTAButtons.jsx         # CTA buttons (antd Button) — React island
    └── Footer.astro           # Footer with link columns
```

## Architecture

The page uses Astro's islands architecture:

- **Static sections** (`Hero`, `Problem`, `Methodology`, `CTA`, `Footer`) are rendered to plain HTML at build time — no JavaScript shipped to the browser.
- **React islands** (`Nav`, `MiniDemo`, `FAQ`, `ProblemTable`, `CTAButtons`, `PhotoCircle`) are hydrated client-side using `client:load` or `client:visible`.

Styling uses Ant Design's CSS reset plus scoped `<style>` blocks in Astro components and CSS Modules in React islands. No Tailwind.

## Deployment

Deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. Runs automatically on push to `master`.
