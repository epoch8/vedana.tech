import { useState, useEffect, useMemo } from "react";

import Chat from "@/components/blocks/chat/Chat";
import ChatItem from "@/components/blocks/chat/ChatItem";
import styles from "./ProductDemo.module.css";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

export type DemoScenario = {
  key: string;
  label: string;
  question: string;
  reasoning: string[]; // ← теперь строки
  answer: string;
};

type Phase =
  | "IDLE"
  | "QUESTION"
  | "THINKING"
  | "REASONING"
  | "ANSWER"
  | "DONE";

type Props = {
  scenarios: DemoScenario[];
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function ProductDemo({ scenarios }: Props) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [reasoningStep, setReasoningStep] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");

  /* ---------------------------------- */
  /* Active scenario */
  /* ---------------------------------- */

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.key === activeKey) ?? null;
  }, [scenarios, activeKey]);

  /* ---------------------------------- */
  /* Start scenario */
  /* ---------------------------------- */

  const runScenario = (key: string) => {
    setActiveKey(key);
    setPhase("QUESTION");
    setReasoningStep(0);
    setTypedAnswer("");
  };

  /* ---------------------------------- */
  /* Empty buttons */
  /* ---------------------------------- */

  const emptyButtons = useMemo(
    () =>
      scenarios.map((s) => ({
        key: s.key,
        label: s.label
      })),
    [scenarios]
  );

  /* ---------------------------------- */
  /* Reaction buttons */
  /* ---------------------------------- */

  const reactionButtons = useMemo(() => {
    if (phase !== "DONE" || !activeScenario) return [];

    return scenarios
      .filter((s) => s.key !== activeScenario.key)
      .map((s) => ({
        label: s.label,
        onClick: () => runScenario(s.key)
      }));
  }, [phase, activeScenario, scenarios]);

  /* ---------------------------------- */
  /* Phase machine */
  /* ---------------------------------- */

  useEffect(() => {
    if (!activeScenario) return;

    if (phase === "QUESTION") {
      const t = setTimeout(() => setPhase("THINKING"), 600);
      return () => clearTimeout(t);
    }

    if (phase === "THINKING") {
      const t = setTimeout(() => setPhase("REASONING"), 800);
      return () => clearTimeout(t);
    }

    if (phase === "REASONING") {
      if (reasoningStep < activeScenario.reasoning.length) {
        const t = setTimeout(
          () => setReasoningStep((prev) => prev + 1),
          600
        );
        return () => clearTimeout(t);
      }

      const t = setTimeout(() => setPhase("ANSWER"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "ANSWER") {
      let i = 0;
      const text = activeScenario.answer;

      const interval = setInterval(() => {
        setTypedAnswer(text.slice(0, i));
        i++;

        if (i > text.length) {
          clearInterval(interval);
          setPhase("DONE");
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [phase, activeScenario, reasoningStep]);

  /* ---------------------------------- */
  /* Visible reasoning */
  /* ---------------------------------- */

  const visibleReasoning = useMemo(() => {
    if (!activeScenario) return [];

    if (phase === "DONE") {
      return activeScenario.reasoning;
    }

    return activeScenario.reasoning.slice(0, reasoningStep);
  }, [phase, activeScenario, reasoningStep]);

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        {/* CHAT SIDE */}
        <div className={styles.chatContainer}>
          <Chat
            title="Chat with Vedana"
            isEmpty={!activeScenario}
            showInput={false}
            emptyScenarios={emptyButtons}
            onScenarioClick={runScenario}
            reactions={reactionButtons}
          >
            {activeScenario && (
              <>
                <ChatItem
                  participant={2}
                  text={activeScenario.question}
                />

                {(phase === "ANSWER" || phase === "DONE") && (
                  <ChatItem participant={1}>
                    <div style={{ whiteSpace: "pre-line" }}>
                      {typedAnswer}
                    </div>
                  </ChatItem>
                )}
              </>
            )}
          </Chat>
        </div>

        {/* REASONING SIDE */}
        <div className={styles.reasoning}>
          {activeScenario && phase !== "IDLE" && (
            <div className={styles.reasoningSteps}>
              {visibleReasoning.map((step, index) => (
                <div
                  key={`${activeScenario.key}-step-${index}`}
                  className={styles.reasoningLine}
                >
                  <span
                    className={styles.reasoningContent}
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}