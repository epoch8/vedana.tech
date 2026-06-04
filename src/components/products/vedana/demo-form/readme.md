# DemoForm – Talk to the Vedana team (Form 2)

The qualifying form that lives on [`/demo`](../../../../pages/demo.astro). It captures
sales leads (demo / managed / OEM) and writes them straight into MailerLite.

Design doc: `2026-06-02 Demo page on vedana.tech – design.md`.

## Files

| File | Role |
|------|------|
| `DemoForm.tsx` | antd form, 8 fields + inline success state. Hydrated with `client:load`. |
| `DemoForm.module.css` | Form + success-state styling, responsive. |
| `submit.ts` | Variant A – POSTs to the anonymous MailerLite embedded endpoint. |

## MailerLite wiring

- **Form id:** `189167088710976655` (Vedana sales leads / Form 2).
- **Account id:** `1909692`.
- **Group:** Vedana sales leads (`189167066791543949`).
- **Submission path:** Variant A – anonymous embedded `jsonp` endpoint. No API key
  in the browser. If this endpoint proves unreliable, fall back to Variant B
  (PUBLIC token) or Variant C (Astro API route) per the newsletter design doc.

### Custom fields written

`email`, `name`, `company`, `role`, `team_size`, `purpose`, `use_case`,
`urgency`, `subscribed_from`.

> ⚠️ **`purpose` values are full strings, not slugs, and must match the MailerLite
> form's radio values verbatim.** Copied from the live embed:
> `"Demo (see Vedana on my data)"`, `"Managed (run it for me)"`, `"OEM or other"`.
> `PURPOSE_OPTIONS` in `DemoForm.tsx` mirrors these so the React form and the
> MailerLite fallback form write identical values. Don't "tidy" them.

> ⚠️ **The form is hydrated with `client:only="react"`, not `client:load`.** antd v5
> uses CSS-in-JS; when an island is server-rendered, the component markup ships
> without antd's injected styles and the layout breaks (unstyled selects/radios).
> `client:only` skips SSR so antd injects its styles on a clean client mount.

### Attribution

`subscribed_from` defaults to `demo-page`. A `?from=<slug>` query param overrides
it (e.g. `/demo?from=industries-horeca`), which is what `DemoCTA.astro` links use.

## ⚠️ Smoke-test before trusting submit.ts

The embedded `jsonp` endpoint is **not** part of MailerLite's documented public
API; the request shape in `submit.ts` matches the official embed snippet but was
not verified end-to-end at build time. Before launch:

1. `npm run dev` → open `localhost:4321/demo`.
2. Fill every field, `purpose: Managed` → submit → expect the success state.
3. In MailerLite, confirm the subscriber landed in **Vedana sales leads** with all
   custom fields populated correctly.
4. Repeat with `purpose: Demo` and `purpose: OEM`.
5. If the endpoint returns an opaque/blocked response (CORS), switch to Variant B/C.

## Calendly

`CALENDLY_URL` (exported from `DemoForm.tsx`) is the single source of truth for the
direct-booking link, used in the success state and the `/demo` FAQ. It currently
points to `/30min` – switch to `/60min` if the 30-min event isn't live yet
(design doc, open question 1).
