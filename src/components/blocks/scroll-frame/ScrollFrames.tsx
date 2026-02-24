"use client";

import GraphFlowLayer from "../scroll-frame/GraphFlowLayer";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   Utils
========================= */

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/* =========================
   Responsive breakpoints
========================= */

function useViewport() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

/* =========================
   Documents Layer
========================= */

type DocType = "PDF" | "DOCX" | "XLSX";

function BackgroundDocs({
  scroll,
  enabled,
}: {
  scroll: MotionValue<number>;
  enabled: boolean;
}) {
  if (!enabled) return null;

  const docs = useMemo(() => {
    const COUNT = 26;

    return Array.from({ length: COUNT }).map((_, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      const leftPos = side === "left" ? random(-14, 18) : random(82, 114);
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

  const enter = useTransform(scroll, [0, 0.2], [0, 1]);
  const containerOpacity = useTransform(scroll, [0, 0.52, 0.58], [1, 1, 0]);
  const containerScale = useTransform(scroll, [0.5, 0.58], [1, 0.82]);

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
          doc.side === "left" ? [-420, 0] : [420, 0]
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
            <div style={{ fontSize: 14, fontWeight: 600 }}>{doc.type}</div>
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
  const width = useViewport();

  const isSmall = width <= 930;
  const isMid = width > 930 && width < 1200;
  const isLarge = width >= 1200;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Animations (НЕ ТРОГАЕМ) */

  const f1Y = useTransform(scrollYProgress, [0, 0.3, 0.45], [0, 0, -620]);
  const f1Opacity = useTransform(scrollYProgress, [0, 0.44, 0.45], [1, 1, 0]);

  const f2Y = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.68, 0.8],
    [620, 0, 0, -620]
  );
  const f2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.31, 0.79, 0.8],
    [0, 1, 1, 0]
  );

  const f3Y = useTransform(scrollYProgress, [0.68, 0.8], [620, 0]);
  const f3Opacity = useTransform(scrollYProgress, [0.68, 0.69], [0, 1]);

  const sectionHeight = isSmall ? "240vh" : "300vh";

  /* ===== Background control ===== */

  const backgroundEnabled = !isSmall;

  /* ===== Layout logic ===== */

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: isMid ? "flex-end" : "center",
    padding: "0 2rem",
    textAlign: isMid ? "left" : "center",
  };

  const frameBase: React.CSSProperties = {
    position: "absolute",
    width: isMid ? "42vw" : "100%",
    maxWidth: 900,
  };

  return (
    <section ref={ref} style={{ height: sectionHeight, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#f8fafc",
        }}
      >
        <BackgroundDocs scroll={scrollYProgress} enabled={backgroundEnabled} />
        {backgroundEnabled && <GraphFlowLayer scroll={scrollYProgress} />}

        <div style={wrapperStyle}>
          <motion.div
            style={{ ...frameBase, y: f1Y, opacity: f1Opacity }}
          >
            <h2>
              Your company knowledge lives in many places at once.
            </h2>
            <p>
              PDFs. Specs. Excel sheets. Shared drives. Emails. Wikis. ERP exports.
            </p>
          </motion.div>

          <motion.div
            style={{ ...frameBase, y: f2Y, opacity: f2Opacity }}
          >
            <h2>Vedana builds a data model of your domain.</h2>
            <p>
              Anchors. Attributes. Links. Structured knowledge instead of chaos.
            </p>
          </motion.div>

          <motion.div
            style={{ ...frameBase, y: f3Y, opacity: f3Opacity }}
          >
            <h2>
              AI explores your structured knowledge with tools.
            </h2>
            <p>
              Answers follow constraints. Reasoning becomes traceable.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}