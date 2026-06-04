// src/components/products/vedana/demo-form/DemoForm.tsx
import { useEffect, useState } from "react";
import { Form, Input, Select, Radio, Button, ConfigProvider } from "antd";
import { submit } from "./submit";
import styles from "./DemoForm.module.css";

const theme = {
  token: {
    colorPrimary: "#2563eb",
    borderRadius: 8,
    fontFamily: "inherit",
  },
};

// Direct-booking fallback. Single source of truth – also used in the FAQ on /demo.
// NOTE: if the 30-min Calendly event isn't live yet, switch this to /60min.
// See the demo design doc, open question 1.
export const CALENDLY_URL = "https://calendly.com/olga_t/30min";

// IMPORTANT: `value` must match the radio option values in the MailerLite UI form
// (id 189167088710976655) EXACTLY – `purpose` is stored as a text string, so the two
// forms must write identical values into the same field. These are copied verbatim
// from the live MailerLite embed; do not "tidy" them.
const PURPOSE_OPTIONS = [
  { value: "Demo (see Vedana on my data)", label: "Demo – see Vedana on my data" },
  { value: "Managed (run it for me)", label: "Managed – run it for me" },
  { value: "OEM or other", label: "OEM / on-prem / other" },
];

const ROLE_OPTIONS = ["Engineer", "PM", "CTO", "Founder", "Other"];
const TEAM_SIZE_OPTIONS = ["Solo", "2-10", "11-50", "51-500", "500+"];
const URGENCY_OPTIONS = [
  "Exploring",
  "Evaluating in 1-3 months",
  "Production in 1-3 months",
  "Need it now",
];

type Status = "idle" | "submitting" | "success" | "error";

// Read the `from` query param (e.g. /demo?from=industries-horeca) for attribution.
function getSubscribedFrom(): string {
  if (typeof window === "undefined") return "demo-page";
  const from = new URLSearchParams(window.location.search).get("from");
  return from && /^[a-z0-9-]+$/i.test(from) ? from : "demo-page";
}

export default function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // On success the form is replaced by a shorter confirmation; scroll back up so
  // the user isn't left staring at the footer where they hit submit.
  useEffect(() => {
    if (status === "success" && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [status]);

  async function onFinish(values: Record<string, string>) {
    setStatus("submitting");
    const result = await submit({
      email: values.email,
      name: values.name,
      company: values.company,
      role: values.role,
      team_size: values.team_size,
      purpose: values.purpose,
      use_case: values.use_case,
      urgency: values.urgency,
      subscribed_from: getSubscribedFrom(),
    });
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong. Try again?");
    }
  }

  if (status === "success") {
    return (
      <ConfigProvider theme={theme}>
        <div className={styles.success}>
          <h3 className={styles.successTitle}>
            Got it. We'll reply within 1 business day.
          </h3>
          <p>
            Want to skip ahead and book a slot now?
          </p>
          <a href={CALENDLY_URL} className={styles.successCta}>
            Book a 30-min call
          </a>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={theme}>
      <Form
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
        requiredMark
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "A valid email, please." }]}
        >
          <Input placeholder="you@company.com" size="large" />
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="company" label="Company" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <div className={styles.row}>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              size="large"
              placeholder="Select…"
              options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
            />
          </Form.Item>

          <Form.Item name="team_size" label="Team size">
            <Select
              size="large"
              placeholder="Select…"
              options={TEAM_SIZE_OPTIONS.map((t) => ({ value: t, label: t }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="purpose"
          label="What do you want?"
          rules={[{ required: true, message: "Pick one." }]}
        >
          <Radio.Group className={styles.purposeGroup}>
            {PURPOSE_OPTIONS.map((opt) => (
              <Radio.Button key={opt.value} value={opt.value}>
                {opt.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="use_case"
          label="What are you building / what problem are you solving?"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} placeholder="1-3 sentences is enough." />
        </Form.Item>

        <Form.Item name="urgency" label="Timeline">
          <Select
            size="large"
            placeholder="Select…"
            options={URGENCY_OPTIONS.map((u) => ({ value: u, label: u }))}
          />
        </Form.Item>

        {status === "error" && <p className={styles.error}>{errorMsg}</p>}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={status === "submitting"}
            block
          >
            Talk to us
          </Button>
        </Form.Item>

        <p className={styles.legal}>
          We respond within 1 business day. By submitting you agree to be
          contacted about your request.
        </p>
      </Form>
    </ConfigProvider>
  );
}
