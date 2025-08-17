import React, { useState } from 'react';

// Vedana Landing — React + Tailwind
// Updates:
// - Demo block: show 3 clickable queries first; responses + "Why this" appear only after click (no collapse on second click)
// - Keep existing tests; append config tests for Demo
// - Previous removals kept: no Testimonials, Pricing, Integrations, Features, Logos
// - Methodology block after Demo with photo
// - Problem section rewritten into a comparison table per spec

// === Brand ===
function BrandLogo() {
  return (
    <div className="flex items-center gap-2 font-bold text-xl">
      <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600" />
      <span>Vedana</span>
    </div>
  );
}

// === Nav ===
function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#home" aria-label="Go to home" className="shrink-0">
          <span className="inline-flex items-center" role="img" aria-label="Vedana brand">
            <BrandLogo />
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a href="#problem" className="hover:text-blue-600">Problem</a>
          <a href="#demo" className="hover:text-blue-600">Demo</a>
          <a href="#methodology" className="hover:text-blue-600">Methodology</a>
          <a href="#faq" className="hover:text-blue-600">FAQ</a>
          <a href="#signup" className="inline-flex items-center rounded-full px-4 py-2 bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition">Get started</a>
        </nav>
        <button className="md:hidden inline-flex items-center rounded-full px-3 py-2 border border-slate-300" aria-label="Open menu">Menu</button>
      </div>
    </header>
  );
}

// === Hero (Variant A) ===
function ProcessDiagram() {
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <svg
        className="w-full h-auto text-slate-800"
        viewBox="0 0 300 600"
        role="img"
        aria-label="Reasoning process: Question ↓ Data model ↓ Semantic search ↓ Reasoning ↓ Answer"
      >
        <defs>
          <marker id="arrowV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
          </marker>
        </defs>

        <line x1="150" y1="80" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowV)" />
        <line x1="150" y1="180" x2="150" y2="220" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowV)" />
        <line x1="150" y1="280" x2="150" y2="320" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowV)" />
        <line x1="150" y1="380" x2="150" y2="420" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowV)" />

        <rect x="70" y="20" width="160" height="60" rx="14" className="fill-slate-50 stroke-slate-300" strokeWidth="2" />
        <text x="150" y="55" textAnchor="middle" className="fill-current" fontSize="14" fontWeight="600">Question</text>

        <rect x="70" y="120" width="160" height="60" rx="16" className="fill-blue-50 stroke-blue-200" strokeWidth="2" />
        <text x="150" y="150" textAnchor="middle" className="fill-current" fontSize="14" fontWeight="600">Data model</text>
        <text x="150" y="165" textAnchor="middle" className="fill-slate-600" fontSize="12">Entities • Links • Rules</text>

        <rect x="70" y="220" width="160" height="60" rx="16" className="fill-indigo-50 stroke-indigo-200" strokeWidth="2" />
        <text x="150" y="250" textAnchor="middle" className="fill-current" fontSize="14" fontWeight="600">Semantic search</text>
        <text x="150" y="265" textAnchor="middle" className="fill-slate-600" fontSize="12">Vectors + filters</text>

        <rect x="70" y="320" width="160" height="60" rx="16" className="fill-violet-50 stroke-violet-200" strokeWidth="2" />
        <text x="150" y="350" textAnchor="middle" className="fill-current" fontSize="14" fontWeight="600">Reasoning</text>
        <text x="150" y="365" textAnchor="middle" className="fill-slate-600" fontSize="12">Steps + citations</text>

        <rect x="70" y="420" width="160" height="60" rx="16" className="fill-blue-600" />
        <text x="150" y="445" textAnchor="middle" className="fill-white" fontSize="14" fontWeight="700">Answer</text>
        <text x="150" y="460" textAnchor="middle" className="fill-blue-100" fontSize="12">Grounded</text>

        <text x="150" y="520" textAnchor="middle" className="fill-slate-500" fontSize="12">LLM uses your structure ↓ searches semantically ↓ explains the result</text>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Vedana: AI assistants that reason
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Stop guessing. Start understanding.
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Most AI tools make up facts or skip key details. Vedana uses Semantic RAG — a clear data model of your domain (entities, links, rules) — so answers are grounded and explained.
          </p>
          <ul className="mt-6 space-y-2 text-slate-700">
            <li className="flex items-center gap-2 text-sm"><span className="h-4 w-4 rounded-full bg-green-500" /> Fewer made-up answers</li>
            <li className="flex items-center gap-2 text-sm"><span className="h-4 w-4 rounded-full bg-green-500" /> Cites sources and logic</li>
            <li className="flex items-center gap-2 text-sm"><span className="h-4 w-4 rounded-full bg-green-500" /> Works with your stack</li>
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a href="#demo" className="inline-flex justify-center rounded-xl px-5 py-3 bg-blue-600 text-white font-medium shadow hover:bg-blue-700">Try the Demo</a>
            <a href="#contact" className="inline-flex justify-center rounded-xl px-5 py-3 bg-slate-900 text-white font-medium hover:bg-slate-800">Talk to Us</a>
          </div>
          <p className="mt-2 text-sm text-slate-500">Live dataset · No email needed</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl rounded-3xl" />
          <ProcessDiagram />
        </div>
      </div>
    </section>
  );
}

// === Problem (rewritten as comparison table) ===
function Problem() {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">Problem</div>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">Why classic RAG isn’t enough</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">Comparison of Classic RAG and Semantic RAG (Vedana)</caption>
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="text-left px-4 py-3 font-semibold text-slate-700 w-[28%]">Aspect</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-slate-700 w-[36%]">Classic RAG</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-slate-700 w-[36%]">Semantic RAG (Vedana)</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-t border-slate-200">
                <th scope="row" className="text-left px-4 py-3 font-semibold text-slate-900">Full lists &amp; filters</th>
                <td className="px-4 py-3 text-slate-700">Returns only a handful of “similar” items</td>
                <td className="px-4 py-3 text-slate-900">Always returns the <strong>complete set</strong> that matches filters</td>
              </tr>
              <tr className="border-t border-slate-200">
                <th scope="row" className="text-left px-4 py-3 font-semibold text-slate-900">Exact codes / SKUs</th>
                <td className="px-4 py-3 text-slate-700">Can confuse similar codes or product IDs</td>
                <td className="px-4 py-3 text-slate-900"><strong>Precise match</strong> by code → correct results every time</td>
              </tr>
              <tr className="border-t border-slate-200">
                <th scope="row" className="text-left px-4 py-3 font-semibold text-slate-900">Logic &amp; relations</th>
                <td className="px-4 py-3 text-slate-700">Can’t handle real constraints (e.g., accessory compatibility)</td>
                <td className="px-4 py-3 text-slate-900"><strong>Understands links</strong> like Product → Accessory → Compatibility</td>
              </tr>
              <tr className="border-t border-slate-200">
                <th scope="row" className="text-left px-4 py-3 font-semibold text-slate-900">Explainability</th>
                <td className="px-4 py-3 text-slate-700">“Because it was similar”</td>
                <td className="px-4 py-3 text-slate-900"><strong>Traceable reasoning</strong>: which rules and data led to the answer</td>
              </tr>
              <tr className="border-t border-slate-200">
                <th scope="row" className="text-left px-4 py-3 font-semibold text-slate-900">Consistency</th>
                <td className="px-4 py-3 text-slate-700">Same query may give different answers</td>
                <td className="px-4 py-3 text-slate-900"><strong>Deterministic</strong>: same model → same result</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm">
          <a href="#demo" className="text-blue-600 hover:underline">See how Vedana fixes this →</a>
        </div>
      </div>
    </section>
  );
}

// === Chat Avatar ===
function ChatAvatar() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
    </span>
  );
}

// === Photo Circle with fallback ===
function PhotoCircle({
  srcs = [
    'sandbox:/mnt/data/photo_2022-01-07_14-.jpg',
    '/mnt/data/photo_2022-01-07_14-.jpg'
  ],
  alt = 'Alexey Makhotkin'
}) {
  const list = Array.isArray(srcs) ? srcs : [srcs];
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const tryNext = () => {
    if (idx + 1 < list.length) setIdx(idx + 1); else setFailed(true);
  };
  return (
    <div className="relative h-20 w-20 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-slate-200">
      {!failed ? (
        <img src={list[idx]} alt={alt} className="h-full w-full object-cover" onError={tryNext} />
      ) : (
        <div className="h-full w-full grid place-items-center bg-gradient-to-br from-amber-200 to-rose-200 text-slate-800 font-semibold">AM</div>
      )}
    </div>
  );
}

// === In-view trigger (once) ===
function useInViewOnce(options) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      });
    }, options || { rootMargin: '-80px 0px' });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, options]);
  return [ref, inView];
}

// === Typewriter ===
function Typewriter({ lines, speed = 50, startKey = 0, showCursor = true, className = '', paintMarks = true, onDone }) {
  const prefersReduced = React.useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const flat = React.useMemo(() => lines.map((ln) => {
    if (typeof ln === 'string') return { kind: 'text', text: ln };
    if (ln && Array.isArray(ln.chunks)) return { kind: 'chunks', chunks: ln.chunks };
    if (ln && typeof ln.text === 'string') return { kind: 'text', text: ln.text };
    return { kind: 'text', text: String(ln ?? '') };
  }), [lines]);

  const totals = React.useMemo(() => flat.map((ln) => {
    if (ln.kind === 'text') return ln.text.length;
    const sum = ln.chunks.reduce((acc, c) => acc + (c.text?.length || 0), 0);
    return sum;
  }), [flat]);

  const [progress, setProgress] = React.useState(flat.map(() => 0));
  const doneCallbackFired = React.useRef(false);
  const [activeLine, setActiveLine] = React.useState(0);

  React.useEffect(() => {
    setProgress(flat.map(() => prefersReduced ? Infinity : 0));
    setActiveLine(0);
    doneCallbackFired.current = false;
  }, [startKey, flat, prefersReduced]);

  React.useEffect(() => {
    if (prefersReduced) return;
    if (activeLine >= flat.length) return;
    const totalChars = totals[activeLine] ?? 0;
    const id = setInterval(() => {
      setProgress((prev) => {
        const next = [...prev];
        const curr = next[activeLine];
        if (curr < totalChars) {
          next[activeLine] = curr + 1;
          return next;
        }
        if (activeLine + 1 < flat.length) {
          setActiveLine(activeLine + 1);
        } else {
          setActiveLine(flat.length);
        }
        clearInterval(id);
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [activeLine, totals, speed, prefersReduced, flat.length]);

  React.useEffect(() => {
    const isDone = prefersReduced || activeLine >= flat.length;
    if (!doneCallbackFired.current && isDone) {
      doneCallbackFired.current = true;
      if (typeof onDone === 'function') onDone();
    }
  }, [activeLine, prefersReduced, flat.length, onDone]);

  function renderLine(ln, idx) {
    const done = prefersReduced || progress[idx] === Infinity || progress[idx] >= totals[idx];
    const count = prefersReduced ? totals[idx] : progress[idx];
    if (ln.kind === 'text') {
      const content = ln.text.slice(0, count);
      return (
        <p key={idx} className="whitespace-pre-wrap">
          {content}
          {showCursor && !done && idx === activeLine && <span className="inline-block w-0.5 h-4 align-middle bg-slate-700 animate-pulse ml-0.5" />}
        </p>
      );
    }
    let left = count;
    return (
      <p key={idx} className="whitespace-pre-wrap">
        {ln.chunks.map((c, i) => {
          const take = Math.max(0, Math.min(left, c.text.length));
          const visible = c.text.slice(0, take);
          left -= take;
          const node = (c.mark && paintMarks) ? <strong className="font-semibold">{visible}</strong> : <>{visible}</>;
          return <React.Fragment key={i}>{node}</React.Fragment>;
        })}
        {showCursor && !done && idx === activeLine && <span className="inline-block w-0.5 h-4 align-middle bg-slate-700 animate-pulse ml-0.5" />}
      </p>
    );
  }

  return (
    <div className={className} aria-live="polite">
      {flat.map((ln, i) => renderLine(ln, i))}
    </div>
  );
}

// === Static renderer for measurement ===
function StaticLines({ lines, className = '' }) {
  return (
    <div className={className}>
      {lines.map((ln, idx) => {
        if (typeof ln === 'string' || (ln && typeof ln.text === 'string' && !ln.chunks)) {
          const text = typeof ln === 'string' ? ln : ln.text;
          return <p key={idx} className="whitespace-pre-wrap">{text}</p>;
        }
        if (ln && Array.isArray(ln.chunks)) {
          return (
            <p key={idx} className="whitespace-pre-wrap">
              {ln.chunks.map((c, i) => (
                <React.Fragment key={i}>{c.mark ? <strong className="font-semibold">{c.text}</strong> : c.text}</React.Fragment>
              ))}
            </p>
          );
        }
        return <p key={idx} className="whitespace-pre-wrap">{String(ln ?? '')}</p>;
      })}
    </div>
  );
}

/* =======================
   Demo data & configuration
   ======================= */

const PRESETS = {
  p1: {
    label: 'Show all Philips lamps',
    left: {
      lines: [
        { text: 'Here are some Philips lamps I found:' },
        { text: '' },
        { text: '• Philips Hue Go' },
        { text: '• Philips LED 9W E27' },
        { text: '• Philips Tube 18W' },
        { text: '• Philips LED GU10 5W' },
        { text: '• Philips SceneSwitch A60' },
        { text: '' },
        { chunks: [{ text: 'This may not be a full list.', mark: 'red' }] },
      ],
      why: [
        'Matched text for “Philips” and “lamp”; did not use brand ID or category graph.',
        'Can miss items, include duplicates, and lacks stock or socket filters.'
      ],
    },
    right: {
      lines: [
        { chunks: [ { text: 'There are ' }, { text: '128 Philips lamps', mark: 'green' }, { text: ' in the catalog.' } ] },
        { text: '' },
        { chunks: [ { text: 'By type: ', mark: 'green' }, { text: 'bulbs (76), tubes (22), fixtures (30).' } ] },
        { text: '' },
        { chunks: [ { text: 'By socket: ', mark: 'green' }, { text: 'E27 (54), GU10 (18), E14 (12), other (44).' } ] },
        { text: '' },
        { chunks: [ { text: 'Here are top 3 bestsellers:', mark: 'green' } ] },
        { text: '1) Philips Hue Go' },
        { text: '2) Philips LED 9W E27' },
        { text: '3) Master LEDspot GU10 4.2W' },
        { text: '' },
        { text: 'You can clarify lamp and socket type to adjust your search.' },
      ],
      why: [
        'Used brand=Philips AND category∈{bulb, tube, fixture} with exact brand ID.',
        'Joined with inventory and attributes (socket) to build counts and filters.',
        'Sources: Products, Inventory, Vendors.'
      ],
    },
  },
  p3: {
    label: 'Which accessories are compatible with iPhone 14 Pro?',
    left: {
      lines: [
        { text: 'Possible accessories:' },
        { text: '' },
        { text: '• Cases for iPhone 13/14' },
        { text: '• Standard 18W USB chargers' },
        { text: '• Many MagSafe mounts' },
        { text: '' },
        { text: 'You can try chargers and cases labeled for iPhone 14 as they often fit the Pro model.' },
        { chunks: [{ text: 'This list is generic and may not match iPhone 14 Pro.', mark: 'red' }] },
      ],
      why: [
        'Assumed fit based on similar wording in product texts; no check against device model IDs or fit tests.',
        'No reason or proof of compatibility.'
      ]
    },
    right: {
      lines: [
        { chunks: [{ text: 'Cases: ', mark: 'green' }, { text: 'Only models mapped to A2890/A2892 form factor (e.g., Case_XP-14P-Mag, Case_Slim-14P).' }] },
        { text: '' },
        { chunks: [{ text: 'Power: ', mark: 'green' }, { text: 'USB-C PD ≥20W with Lightning/USB-C cable; MagSafe OK (tested Magsafe_Charger_MF1).' }] },
        { text: '' },
        { chunks: [{ text: 'Mounts/optics: ', mark: 'green' }, { text: 'MagSafe-compatible only; clip-only mounts are excluded.' }] },
        { text: '' },
        { chunks: [{ text: 'Not compatible: ', mark: 'green' }, { text: 'Cases for iPhone 13 Pro (camera housing differs).' }] }
      ],
      why: [
        'Used link table sku_compat (device↔accessory) plus specs and QA fit tests.',
        'Sources: Compat, Specs, QA_tests (FT-14P-021, FT-14P-033).'
      ]
    }
  },
  p4: {
    label: 'Payment terms for vendor ACME',
    left: {
      lines: [
        { text: 'Standard terms are often Net 30. Some vendors may offer early-payment discounts.' },
        { text: 'Please check the current contract for details.' },
        { chunks: [{ text: 'This is generic text and may not match ACME.', mark: 'red' }] },
      ],
      why: [
        'Returned generic policy text; mixed vendor names and ignored amendments.',
        'No effective dates or links to the actual documents.'
      ]
    },
    right: {
      lines: [
        { chunks: [{ text: 'Vendor: ', mark: 'green' }, { text: 'ACME Ltd. (VID 48321).' }] },
        { chunks: [{ text: 'Contract: ', mark: 'green' }, { text: 'MSA-2024-017, effective 2024-05-01; latest amendment A2 dated 2025-02-10.' }] },
        { text: '' },
        { chunks: [{ text: 'Terms: ', mark: 'green' }, { text: 'Net 30 EOM; 2/10 net 30; currency EUR; late fee 0.5%/month.' }] },
        { text: '' },
        { chunks: [{ text: 'Invoicing: ', mark: 'green' }, { text: 'Invoices via Coupa; PO required; VAT EU123456; IBAN DE….' }] },
        { text: '' },
        { chunks: [{ text: 'Approvals: ', mark: 'green' }, { text: 'Invoices > €50k require CFO approval.' }] }
      ],
      why: [
        'Followed vendor → contract → amendment → terms with date filters to pick active clauses.',
        'Sources: Contracts, Amendments, Vendor_registry, Procurement_policy.'
      ]
    }
  }
};

// public list of visible queries
const DEMO_VISIBLE_QUERIES = [
  { key: 'p1', text: 'Show all Philips lamps' },
  { key: 'p3', text: 'Which accessories are compatible with iPhone 14 Pro?' },
  { key: 'p4', text: 'Payment terms for vendor ACME' },
];

function getMiniDemoConfig() {
  return { presets: PRESETS, visible: DEMO_VISIBLE_QUERIES };
}

// === Mini Demo (clickable examples → reveal compare) ===
function MiniDemo() {
  const presets = React.useMemo(() => PRESETS, []);
  const [key, setKey] = useState(null);
  const [opened, setOpened] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const data = presets[key || 'p1'];

  const [ref, inView] = useInViewOnce({ rootMargin: '-120px 0px' });
  const shouldStart = inView ? runKey : -1;

  React.useEffect(() => {
    if (!opened) return;
    setRunKey((k) => k + 1);
  }, [key, opened]);

  const leftContentRef = React.useRef(null);
  const rightContentRef = React.useRef(null);
  const rightMeasureRef = React.useRef(null);
  const [contentH, setContentH] = React.useState(null);

  React.useLayoutEffect(() => {
    if (!opened) return;
    const measure = () => {
      if (!rightMeasureRef.current) return;
      const h = rightMeasureRef.current.offsetHeight;
      setContentH(h || null);
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      if (rightMeasureRef.current) ro.observe(rightMeasureRef.current);
      window.addEventListener('resize', measure);
      return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
    } else {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
  }, [opened, data.right.lines]);

  const lockStyle = opened && contentH ? { height: contentH + 'px' } : undefined;

  function onPick(k) {
    setKey(k);
    if (!opened) setOpened(true);
  }

  return (
    <section id="demo" className="py-20 bg-slate-50" ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">Which response do you prefer?</h2>
        <p className="mt-2 text-slate-600 text-center">Pick a query and compare outputs.</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {DEMO_VISIBLE_QUERIES.map(({ key: k, text }) => {
            const active = opened && key === k;
            return (
              <button
                key={k}
                onClick={() => onPick(k)}
                className={
                  "rounded-full px-4 py-2 text-sm border transition " +
                  (active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50")
                }
                aria-pressed={active}
              >
                {text}
              </button>
            );
          })}
        </div>

        {opened && (
          <>
            <div className="mt-8 grid md:grid-cols-2 gap-6 items-start">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="absolute -top-3 left-4 text-xs text-slate-500 bg-white px-2">Response 1</div>
                <div className="flex items-center gap-2">
                  <ChatAvatar />
                  <h3 className="font-semibold">RAG output</h3>
                  <span className="ml-auto text-xs text-slate-500">Text similarity</span>
                </div>
                <div ref={leftContentRef} className="mt-3 overflow-hidden" style={lockStyle}>
                  <Typewriter
                    lines={data.left.lines}
                    startKey={shouldStart}
                    speed={16}
                    showCursor={true}
                    paintMarks={true}
                    className="space-y-2 text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="absolute -top-3 left-4 text-xs text-slate-500 bg-white px-2">Response 2</div>
                <div className="flex items-center gap-2">
                  <ChatAvatar />
                  <h3 className="font-semibold">With Semantic RAG</h3>
                  <span className="ml-auto text-xs text-slate-500">Data model + rules</span>
                </div>
                <div ref={rightContentRef} className="mt-3 overflow-hidden" style={lockStyle}>
                  <Typewriter
                    lines={data.right.lines}
                    startKey={shouldStart}
                    speed={16}
                    showCursor={true}
                    paintMarks={true}
                    className="space-y-2 text-sm text-slate-800"
                  />
                </div>
                <div ref={rightMeasureRef} className="invisible absolute left-5 right-5">
                  <StaticLines lines={data.right.lines} className="mt-3 space-y-2 text-sm text-slate-800" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-6 transition-opacity duration-300">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Why this</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-2">
                  {data.left.why.map((line, i) => (<li key={i}>{line}</li>))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Why this</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-2">
                  {data.right.why.map((line, i) => (<li key={i}>{line}</li>))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// === Methodology (bright insert) ===
function Methodology() {
  return (
    <section id="methodology" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-8">
          <div className="grid md:grid-cols-[auto,1fr] items-center gap-6">
            <div className="shrink-0">
              <PhotoCircle />
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-wide uppercase text-amber-700">Proven methodology inside</p>
              <h3 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900">At the core of Vedana lies Minimal Modeling</h3>
              <p className="mt-3 text-slate-800">
                <a href="https://minimalmodeling.com/" target="_blank" rel="noreferrer" className="underline decoration-amber-500 underline-offset-2">Minimal Modeling</a>
                {' '}— a methodology developed by Alexey Makhotkin, author of the
                {' '}<a href="https://databasedesignbook.com/" target="_blank" rel="noreferrer" className="underline decoration-amber-500 underline-offset-2">Database Design Book</a>.
              </p>
              <p className="mt-2 text-slate-700">This foundation ensures that our Semantic RAG system combines:</p>
              <ul className="mt-2 space-y-1 text-slate-800">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-amber-600" /><span><strong>AI flexibility</strong> — LLMs that can reason, not just guess.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-amber-600" /><span><strong>Enterprise-grade data discipline</strong> — structured, auditable, and transparent.</span></li>
              </ul>
              <p className="mt-3 text-slate-700">
                With Vedana, you’re not experimenting on a hunch. You’re building on a clear,
                proven modeling approach that was designed to handle real-world business complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === FAQ ===
function FAQ() {
  const qa = [
    { q: "Do I need code skills?", a: "No. You can build flows with blocks and rules." },
    { q: "Which channels are supported?", a: "Instagram DM, WhatsApp, Facebook Messenger, SMS, email, and more." },
    { q: "Can I connect my shop?", a: "Yes. Shopify and others. You can sync products and orders." },
    { q: "Is there a free plan?", a: "Yes. Start free and upgrade any time." },
  ];
  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold text-center">FAQ</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {qa.map((item) => (
            <details key={item.q} className="group p-5 open:bg-slate-50">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="font-medium">{item.q}</span>
                <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 group-open:rotate-45 transition leading-none">
                  <span className="text-sm font-medium">+</span>
                </span>
              </summary>
              <p className="mt-3 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// === CTA ===
function CTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to try?</h3>
              <p className="mt-1 text-white/90">Create your first flow in minutes.</p>
            </div>
            <div className="flex gap-3">
              <a href="#signup" className="inline-flex rounded-xl bg-white text-slate-900 px-5 py-3 font-medium">Start free</a>
              <a href="#demo" className="inline-flex rounded-xl bg-white/10 px-5 py-3 font-medium hover:bg-white/20">Book demo</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Footer ===
function Footer() {
  const cols = [
    { title: "Product", items: ["Docs","Changelog","Status"] },
    { title: "Use cases", items: ["E-commerce","SaaS","Creators","Support"] },
    { title: "Resources", items: ["Blog","Templates","Community"] },
    { title: "Company", items: ["About","Careers","Contact","Legal"] },
  ];
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-5 gap-10">
        <div>
          <BrandLogo />
          <p className="mt-3 text-sm text-slate-600 max-w-xs">Omni-channel chat for growth and support. Replace this text with your brand line.</p>
          <div className="mt-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className="h-9 w-9 rounded-full bg-slate-200" />
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-semibold">{c.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {c.items.map((i) => <li key={i}><a href="#" className="hover:text-blue-600">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} Epoch8 LLC</div>
    </footer>
  );
}

// === Tiny Test Panel (smoke tests) ===
function TestPanel() {
  const extraChecks = (() => {
    try {
      const el = ProcessDiagram({});
      return !!(el && typeof el === "object" && el.type && el.props);
    } catch (e) {
      return false;
    }
  })();

  const problemChecks = (() => {
    try {
      const el = Problem ? Problem({}) : null;
      return !!(el && typeof el === "object" && el.type && el.props);
    } catch (e) {
      return false;
    }
  })();

  const miniDemoChecks = (() => {
    try {
      const el = MiniDemo ? MiniDemo({}) : null;
      return !!(el && typeof el === "object" && el.type && el.props);
    } catch (e) {
      return false;
    }
  })();

  const typewriterChecks = (() => {
    try {
      const el = Typewriter ? Typewriter({ lines: ['hello'], startKey: 1 }) : null;
      return !!(el && typeof el === "object");
    } catch (e) {
      return false;
    }
  })();

  const jsxMapCheck = (() => {
    try {
      const tmp = (<ul>{['a','b'].map((line, i) => <li key={i}>{line}</li>)}</ul>);
      return !!tmp;
    } catch (e) {
      return false;
    }
  })();

  const methodologyChecks = (() => {
    try {
      const el = Methodology ? Methodology({}) : null;
      return !!(el && typeof el === 'object' && el.type && el.props);
    } catch (e) {
      return false;
    }
  })();

  const demoConfig = (() => {
    try {
      const conf = getMiniDemoConfig();
      const texts = conf.visible.map(v => v.text).join('|');
      const keysOk = conf.visible.every(v => !!conf.presets[v.key]);
      return {
        okLen: conf.visible.length === 3,
        okTexts: texts === 'Show all Philips lamps|Which accessories are compatible with iPhone 14 Pro?|Payment terms for vendor ACME',
        okKeys: keysOk,
      };
    } catch {
      return { okLen: false, okTexts: false, okKeys: false };
    }
  })();

  const tests = [
    { name: "React in scope", pass: typeof React !== 'undefined' && typeof React.createElement === 'function' },
    { name: "useState available", pass: typeof useState === 'function' },
    { name: "BrandLogo is function", pass: typeof BrandLogo === "function" },
    { name: "Nav is function", pass: typeof Nav === "function" },
    { name: "Hero is function", pass: typeof Hero === "function" },
    { name: "ProcessDiagram is function", pass: typeof ProcessDiagram === "function" },
    { name: "ProcessDiagram returns element", pass: extraChecks },
    { name: "Problem is function", pass: typeof Problem === "function" },
    { name: "Problem returns element", pass: problemChecks },
    { name: "MiniDemo is function", pass: typeof MiniDemo === "function" },
    { name: "MiniDemo returns element", pass: miniDemoChecks },
    { name: "Typewriter exists", pass: typeof Typewriter === 'function' && typewriterChecks },
    { name: "ChatAvatar exists", pass: typeof ChatAvatar === 'function' },
    { name: "JSX map valid", pass: jsxMapCheck },
    { name: "Methodology exists", pass: typeof Methodology === 'function' },
    { name: "Methodology returns element", pass: methodologyChecks },
    { name: "FAQ exists", pass: typeof FAQ === 'function' },
    { name: "CTA exists", pass: typeof CTA === 'function' },
    { name: "Footer exists", pass: typeof Footer === 'function' },
    { name: "PhotoCircle exists", pass: typeof PhotoCircle === 'function' },
    { name: "Demo: 3 visible queries", pass: demoConfig.okLen },
    { name: "Demo: query texts exact", pass: demoConfig.okTexts },
    { name: "Demo: keys map to presets", pass: demoConfig.okKeys },
  ];

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium">Runtime tests</p>
          <ul className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
            {tests.map((t) => (
              <li key={t.name} className={"px-3 py-2 rounded-lg " + (t.pass ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>{t.name}: {String(t.pass)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// === Page ===
export default function VedanaLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />
      <Hero />
      <Problem />
      <MiniDemo />
      <Methodology />
      <FAQ />
      <CTA />
      <Footer />
      {/* <TestPanel /> */}
    </div>
  );
}
