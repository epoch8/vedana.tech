"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

export default function ScrollFrames() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // вычисляем текущий кадр
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.33) setActiveIndex(0);
    else if (v < 0.66) setActiveIndex(1);
    else setActiveIndex(2);
  });

  // snap-like animation
  const frame1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const frame2Opacity = useTransform(scrollYProgress, [0.33, 0.5, 0.66], [0, 1, 0]);
  const frame3Opacity = useTransform(scrollYProgress, [0.66, 0.85, 1], [0, 1, 1]);

  const frame1Scale = useTransform(scrollYProgress, [0, 0.33], [1, 0.95]);
  const frame2Scale = useTransform(scrollYProgress, [0.33, 0.66], [1, 0.95]);
  const frame3Scale = useTransform(scrollYProgress, [0.66, 1], [1, 1]);

  return (
    <section ref={ref} style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {/* Side Indicator */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: activeIndex === i ? 32 : 12,
                borderRadius: 4,
                background: activeIndex === i ? "#2563eb" : "#cbd5e1",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <div style={{ maxWidth: 760, position: "relative" }}>

          {/* Frame 1 */}
          <motion.div
            style={{
              opacity: frame1Opacity,
              scale: frame1Scale,
              position: activeIndex === 0 ? "relative" : "absolute",
              width: "100%",
            }}
          >
            <h2>Reasoning in enterprises is fragile.</h2>
            <p>Enterprise systems store data.</p>
            <p>Documents store policies.</p>
            <p>Experts store decisions.</p>
            <p>
              But reasoning — the logic that connects rules, constraints,
              versions, and dependencies —
              lives nowhere explicitly.
            </p>
          </motion.div>

          {/* Frame 2 */}
          <motion.div
            style={{
              opacity: frame2Opacity,
              scale: frame2Scale,
              position: activeIndex === 1 ? "relative" : "absolute",
              width: "100%",
            }}
          >
            <h3>Knowledge lives in heads</h3>
            <p>Critical decisions depend on experts who understand:</p>
            <ul>
              <li>which rule applies</li>
              <li>which version is current</li>
              <li>which exception overrides which constraint</li>
            </ul>
            <p>When they leave, reasoning leaves with them.</p>
            <p>Systems remain. Logic disappears.</p>
          </motion.div>

          {/* Frame 3 */}
          <motion.div
            style={{
              opacity: frame3Opacity,
              scale: frame3Scale,
              position: activeIndex === 2 ? "relative" : "absolute",
              width: "100%",
            }}
          >
            <h2>AI without structure guesses</h2>
            <p>LLMs generate fluent answers.</p>
            <p>But enterprise questions are rarely about text similarity.</p>
            <p>They are about:</p>
            <ul>
              <li>constraints</li>
              <li>rule precedence</li>
              <li>version control</li>
              <li>exclusions</li>
              <li>cross-entity dependencies</li>
            </ul>
            <p>
              Without structure, AI cannot enforce rules.
              It can only approximate them.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}