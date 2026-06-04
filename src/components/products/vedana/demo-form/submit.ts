// src/components/products/vedana/demo-form/submit.ts
//
// Variant A – anonymous MailerLite embedded form endpoint.
// We POST straight to the public "jsonp" subscribe endpoint that MailerLite
// generates for every embedded form. No API key lives in the browser.
//
// NOTE: this endpoint is not part of the documented public API. The shape below
// (form-urlencoded `fields[...]` + `ml-submit` + `anticsrf`) matches what the
// official MailerLite embed snippet sends. See readme.md for the smoke-test
// checklist before trusting it in production.

// Vedana sales leads form (Form 2 – Talk to team)
const FORM_ID = "189167088710976655";
// MailerLite account id (from the embed snippet URL)
const ACCOUNT_ID = "1909692";

const ENDPOINT = `https://assets.mailerlite.com/jsonp/${ACCOUNT_ID}/forms/${FORM_ID}/subscribe`;

export type DemoFormValues = {
  email: string;
  name: string;
  company: string;
  role?: string;
  team_size?: string;
  purpose: string;
  use_case: string;
  urgency?: string;
  subscribed_from?: string;
};

export type SubmitResult = {
  ok: boolean;
  error?: string;
};

export async function submit(values: DemoFormValues): Promise<SubmitResult> {
  const body = new URLSearchParams();

  // MailerLite embedded forms expect each custom/standard field under fields[key].
  for (const [key, value] of Object.entries(values)) {
    if (value == null || value === "") continue;
    body.append(`fields[${key}]`, String(value));
  }

  // Flags the official embed snippet sends.
  body.append("ml-submit", "1");
  body.append("anticsrf", "true");

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      return { ok: false, error: "We couldn't reach the server. Please try again." };
    }

    // The endpoint returns JSON like { success: true } / { success: false, errors: {...} }.
    // It can also return an empty body on success – treat a parse failure as success
    // as long as the HTTP status was ok.
    let data: { success?: boolean; errors?: unknown } | null = null;
    try {
      data = await res.json();
    } catch {
      return { ok: true };
    }

    if (data && data.success === false) {
      return { ok: false, error: "Please check your details and try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
