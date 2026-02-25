"use client";

import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useRef, useMemo } from "react";

/* =========================
   Utils
========================= */

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/* =========================
   Documents Layer (НЕ ТРОГАЕМ)
========================= */

type DocType = "PDF" | "DOCX" | "XLSX";

function BackgroundDocs({
  scroll,
}: {
  scroll: MotionValue<number>;
}) {
  const docs = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const side = i % 2 === 0 ? "left" : "right";

      return {
        id: i,
        top: random(5, 90),
        left:
          side === "left"
            ? random(-12, 28)
            : random(72, 112),
        rotate: random(-35, 35),
        floatOffset: random(-25, 25),
        delay: random(0, 2),
        scale: random(0.92, 1.06),
        type: ["PDF", "DOCX", "XLSX"][i % 3] as DocType,
        side,
      };
    });
  }, []);

  const colors: Record<DocType, string> = {
    PDF: "#FEE2E2",
    DOCX: "#DBEAFE",
    XLSX: "#DCFCE7",
  };

  const enter = useTransform(scroll, [0, 0.2], [0, 1]);

  const containerOpacity = useTransform(
    scroll,
    [0, 0.5, 0.66],
    [1, 1, 0]
  );

  const containerScale = useTransform(
    scroll,
    [0.5, 0.66],
    [1, 0.8]
  );

  return (
    <motion.div
      style={{
        opacity: containerOpacity,
        scale: containerScale,
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {docs.map((doc) => {
        const scale = useTransform(enter, [0, 1], [0.2, doc.scale]);
        const opacity = useTransform(enter, [0, 1], [0, 1]);
        const x = useTransform(
          enter,
          [0, 1],
          doc.side === "left" ? [-300, 0] : [300, 0]
        );

        return (
          <motion.div
            key={doc.id}
            animate={{ y: [0, doc.floatOffset, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              delay: doc.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: `${doc.top}%`,
              left: `${doc.left}%`,
              width: 160,
              height: 200,
              borderRadius: 22,
              padding: 18,
              background: colors[doc.type],
              boxShadow: "0 30px 70px rgba(0,0,0,0.12)",
              rotate: doc.rotate,
              scale,
              opacity,
              x,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {doc.type}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* =========================
   Graph Layer (ПЕРЕПИСАН)
========================= */

const nodes = [
  { id: "Product", x: 50, y: 35 },
  { id: "Supplier", x: 25, y: 55 },
  { id: "Market", x: 75, y: 55 },
  { id: "Region", x: 75, y: 75 },
  { id: "Regulation", x: 50, y: 75 },
];

const links = [
  ["Product", "Supplier"],
  ["Product", "Market"],
  ["Market", "Region"],
  ["Product", "Regulation"],
  ["Regulation", "Region"],
];

function BackgroundGraph({
  scroll,
}: {
  scroll: MotionValue<number>;
}) {
  // появление
  const appearOpacity = useTransform(scroll, [0.5, 0.66], [0, 1]);
  const appearScale = useTransform(scroll, [0.5, 0.66], [0.7, 1]);

  // zoom-out + уезд
  const exitY = useTransform(scroll, [0.75, 0.9], [0, -200]);
  const exitScale = useTransform(scroll, [0.75, 0.9], [1, 0.6]);
  const exitOpacity = useTransform(scroll, [0.8, 0.95], [1, 0]);

  const finalOpacity = useTransform(
    [appearOpacity, exitOpacity] as MotionValue<number>[],
    ([a, b]: number[]) => a * b
  );

  const finalScale = useTransform(
    [appearScale, exitScale] as MotionValue<number>[],
    ([a, b]: number[]) => a * b
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity: finalOpacity,
        scale: finalScale,
        y: exitY,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%">
        {links.map(([a, b], i) => {
          const from = nodes.find((n) => n.id === a)!;
          const to = nodes.find((n) => n.id === b)!;

          return (
            <line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
          }}
        >
          {node.id}
        </div>
      ))}
    </motion.div>
  );
}

/* =========================
   Scroll Scene
========================= */

export default function ScrollFrames() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* 
    Timeline

    0.00 – 0.30  → Frame 1
    0.30 – 0.45  → 1 → 2 transition
    0.45 – 0.60  → Frame 2
    0.60 – 0.75  → 2 → 3 transition
    0.75 – 1.00  → Frame 3
  */

  /* ---------- FRAME 1 ---------- */

  const f1Y = useTransform(
    scrollYProgress,
    [0, 0.30, 0.45],
    [0, 0, -620]
  );

  const f1Opacity = useTransform(
    scrollYProgress,
    [0, 0.44, 0.45],
    [1, 1, 0]
  );

  /* ---------- FRAME 2 ---------- */

  const f2Y = useTransform(
    scrollYProgress,
    [0.30, 0.45, 0.60, 0.75],
    [620, 0, 0, -620]
  );

  const f2Opacity = useTransform(
    scrollYProgress,
    [0.30, 0.31, 0.74, 0.75],
    [0, 1, 1, 0]
  );

  /* ---------- FRAME 3 ---------- */

  const f3Y = useTransform(
    scrollYProgress,
    [0.60, 0.75],
    [620, 0]
  );

  const f3Opacity = useTransform(
    scrollYProgress,
    [0.60, 0.61],
    [0, 1]
  );

  return (
    <section ref={ref} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#f8fafc",
        }}
      >
        <BackgroundDocs scroll={scrollYProgress} />
        <BackgroundGraph scroll={scrollYProgress} />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 2rem",
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              y: f1Y,
              opacity: f1Opacity,
            }}
          >
            <h2><b>Your company knowledge lives in many places at once.</b></h2>
            <p>PDFs. Specs. Excel sheets. Shared drives. Emails. Wikis. ERP exports.</p>
            <p>AI can read text. But your knowledge isn't text. It's a fragmented structure.</p>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              y: f2Y,
              opacity: f2Opacity,
            }}
          >
            <h2><b>Vedana builds a data model of your domain.</b></h2>
            <p>It turns scattered documents into structured knowledge:</p>
            <p>Anchors (entities), Attributes (facts), Links (relations)</p>
            <p>You get a model of how your world works.</p>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              y: f3Y,
              opacity: f3Opacity,
            }}
          >
            <h2>AI works differently on structured knowledge.</h2>
            <p>It can query your domain. Compare options. Apply constraints.</p>
            <p>So the answers follow your reasoning guidelines.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}