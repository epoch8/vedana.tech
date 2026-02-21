import React, { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import styles from './MiniDemo.module.css';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

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
        'Matched text for "Philips" and "lamp"; did not use brand ID or category graph.',
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

const DEMO_VISIBLE_QUERIES = [
  { key: 'p1', text: 'Show all Philips lamps' },
  { key: 'p3', text: 'Which accessories are compatible with iPhone 14 Pro?' },
  { key: 'p4', text: 'Payment terms for vendor ACME' },
];

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

// === Chat Avatar ===
function ChatAvatar() {
  return (
    <span className={styles['chat-avatar']}>
      <span className={styles['chat-avatar-dot']} />
    </span>
  );
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
    const cursor = showCursor && !done && idx === activeLine
      ? <span className={styles.cursor} />
      : null;

    if (ln.kind === 'text') {
      const content = ln.text.slice(0, count);
      return (
        <p key={idx}>
          {content}
          {cursor}
        </p>
      );
    }
    let left = count;
    return (
      <p key={idx}>
        {ln.chunks.map((c, i) => {
          const take = Math.max(0, Math.min(left, c.text.length));
          const visible = c.text.slice(0, take);
          left -= take;
          let node;
          if (c.mark === 'red' && paintMarks) {
            node = <span className={styles['mark-red']}>{visible}</span>;
          } else if (c.mark === 'green' && paintMarks) {
            node = <span className={styles['mark-green']}>{visible}</span>;
          } else if (c.mark && paintMarks) {
            node = <strong>{visible}</strong>;
          } else {
            node = <>{visible}</>;
          }
          return <React.Fragment key={i}>{node}</React.Fragment>;
        })}
        {cursor}
      </p>
    );
  }

  return (
    <div className={`${styles['typewriter-output']} ${className}`} aria-live="polite">
      {flat.map((ln, i) => renderLine(ln, i))}
    </div>
  );
}

// === Static renderer for measurement ===
function StaticLines({ lines, className = '' }) {
  return (
    <div className={`${styles['typewriter-output']} ${className}`}>
      {lines.map((ln, idx) => {
        if (typeof ln === 'string' || (ln && typeof ln.text === 'string' && !ln.chunks)) {
          const text = typeof ln === 'string' ? ln : ln.text;
          return <p key={idx}>{text}</p>;
        }
        if (ln && Array.isArray(ln.chunks)) {
          return (
            <p key={idx}>
              {ln.chunks.map((c, i) => (
                <React.Fragment key={i}>
                  {c.mark === 'red' ? <span className={styles['mark-red']}>{c.text}</span>
                    : c.mark === 'green' ? <span className={styles['mark-green']}>{c.text}</span>
                    : c.mark ? <strong>{c.text}</strong>
                    : c.text}
                </React.Fragment>
              ))}
            </p>
          );
        }
        return <p key={idx}>{String(ln ?? '')}</p>;
      })}
    </div>
  );
}

// === Mini Demo ===
export default function MiniDemo() {
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
    <ConfigProvider theme={theme}>
      <section id="demo" className={styles['demo-section']} ref={ref}>
        <div className={styles['demo-inner']}>
          <h2 className={styles['demo-title']}>Which response do you prefer?</h2>
          <p className={styles['demo-subtitle']}>Pick a query and compare outputs.</p>

          <div className={styles['query-buttons']}>
            {DEMO_VISIBLE_QUERIES.map(({ key: k, text }) => {
              const active = opened && key === k;
              return (
                <Button
                  key={k}
                  shape="round"
                  type={active ? 'primary' : 'default'}
                  onClick={() => onPick(k)}
                  aria-pressed={active}
                >
                  {text}
                </Button>
              );
            })}
          </div>

          {opened && (
            <>
              <div className={styles['response-grid']}>
                <div className={styles['response-panel']}>
                  <div className={styles['response-label']}>Response 1</div>
                  <div className={styles['response-header']}>
                    <ChatAvatar />
                    <h3>RAG output</h3>
                    <span className={styles['response-subtext']}>Text similarity</span>
                  </div>
                  <div ref={leftContentRef} className={styles['response-content']} style={lockStyle}>
                    <Typewriter
                      lines={data.left.lines}
                      startKey={shouldStart}
                      speed={16}
                      showCursor={true}
                      paintMarks={true}
                    />
                  </div>
                </div>

                <div className={styles['response-panel']}>
                  <div className={styles['response-label']}>Response 2</div>
                  <div className={styles['response-header']}>
                    <ChatAvatar />
                    <h3>With Semantic RAG</h3>
                    <span className={styles['response-subtext']}>Data model + rules</span>
                  </div>
                  <div ref={rightContentRef} className={styles['response-content']} style={lockStyle}>
                    <Typewriter
                      lines={data.right.lines}
                      startKey={shouldStart}
                      speed={16}
                      showCursor={true}
                      paintMarks={true}
                    />
                  </div>
                  <div ref={rightMeasureRef} className={styles['response-measure']}>
                    <StaticLines lines={data.right.lines} />
                  </div>
                </div>
              </div>

              <div className={styles['why-grid']}>
                <div className={styles['why-panel']}>
                  <p className={styles['why-title']}>Why this</p>
                  <ul className={styles['why-list']}>
                    {data.left.why.map((line, i) => (<li key={i}>{line}</li>))}
                  </ul>
                </div>
                <div className={styles['why-panel']}>
                  <p className={styles['why-title']}>Why this</p>
                  <ul className={styles['why-list']}>
                    {data.right.why.map((line, i) => (<li key={i}>{line}</li>))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </ConfigProvider>
  );
}
