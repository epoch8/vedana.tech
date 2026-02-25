"use client";

import GraphFlowLayer from "./GraphFlowLayer";

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
   Documents Layer 
========================= */

type DocType = "PDF" | "DOCX" | "XLSX";

function BackgroundDocs({
  scroll,
}: {
  scroll: MotionValue<number>;
}) {

  const docs = useMemo(() => {
    const COUNT = 26;

    return Array.from({ length: COUNT }).map((_, i) => {
      const side = i % 2 === 0 ? "left" : "right";

      /* ---- SIDE CLUSTERS ---- */

      const leftPos =
        side === "left"
          ? random(-14, 18)     // левый край
          : random(82, 114);    // правый край

      /* вертикальное распределение
         чуть более равномерное */
      const verticalBand = (i / COUNT) * 100;

      return {
        id: i,
        side,
        top: verticalBand + random(-6, 6),
        left: leftPos,

        rotate: random(-28, 28),
        floatOffset: random(-22, 22),
        delay: random(0, 2),
        scale: random(0.9, 1.05),

        type: ["PDF", "DOCX", "XLSX"][i % 3] as DocType,
      };
    });
  }, []);

  const colors: Record<DocType, string> = {
    PDF: "#FEE2E2",
    DOCX: "#DBEAFE",
    XLSX: "#DCFCE7",
  };

  /* enter animation */
  const enter = useTransform(scroll, [0, 0.2], [0, 1]);

  const containerOpacity = useTransform(
    scroll,
    [0, 0.52, 0.58],
    [1, 1, 0]
  );

  const containerScale = useTransform(
    scroll,
    [0.50, 0.58],
    [1, 0.82]
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

        /* документы приезжают С КРАЁВ */
        const x = useTransform(
          enter,
          [0, 1],
          doc.side === "left"
            ? [-420, 0]
            : [420, 0]
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
   Scroll Scene
========================= */

export default function ScrollFrames() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

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
    [0.30, 0.45, 0.68, 0.80],
    [620, 0, 0, -620]
  );

  const f2Opacity = useTransform(
    scrollYProgress,
    [0.30, 0.31, 0.79, 0.80],
    [0, 1, 1, 0]
  );

  /* ---------- FRAME 3 ---------- */

  const f3Y = useTransform(
    scrollYProgress,
    [0.68, 0.80],
    [620, 0]
  );

  const f3Opacity = useTransform(
    scrollYProgress,
    [0.68, 0.69],
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
      <GraphFlowLayer scroll={scrollYProgress} />

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
        <motion.div className="frame-copy" style={{ position: "absolute", y: f1Y, opacity: f1Opacity }}>
          <h2 className="frame-title">Your company knowledge<br /> lives in many places at once.</h2>
          <p className="frame-lead">PDFs. Specs. Excel sheets. Shared drives. Emails. Wikis. ERP exports.</p>
          <p className="frame-text">AI can read text. But your knowledge isn’t text – it’s a fragmented system.</p>
        </motion.div>

        <motion.div className="frame-copy" style={{ position: "absolute", y: f2Y, opacity: f2Opacity }}>
          <h2 className="frame-title">Vedana builds a data model of your domain.</h2>
          <p className="frame-text">It turns scattered documents into structured knowledge:</p>
          <p className="frame-text frame-accent">Anchors (entities), Attributes (facts), Links (relations)</p>
          <p className="frame-text">AI gets a model of how your world works.</p>
        </motion.div>

        <motion.div className="frame-copy" style={{ position: "absolute", y: f3Y, opacity: f3Opacity }}>
          <h2 className="frame-title">AI explores your structured knowledge<br/> with tools.</h2>
          <p className="frame-text">It queries the model, compares options, and applies constraints step by step.</p>
          <p className="frame-text">So answers follow your rules and you can trace how they were reached.</p>
        </motion.div>
        </div>
      </div>
    </section>
  );
}