import { useState, useEffect } from "react";
import Chat from "@/components/blocks/chat/Chat.jsx";
import ChatItem from "@/components/blocks/chat/ChatItem.jsx";
import styles from "./ProductDemo.module.css";

const SCENARIOS = {
  wine: {
    label: "Wine pairing",
    question:
      "Which wine pairs best with the Chef’s special pasta?",
    reasoning: [
      "The user asks for a wine pairing recommendation and a comparison between two wines.",
      "To recommend a wine for the Chef's special pasta: - We need the Dish entity (Chef’s special pasta).",
      "To compare Pinot Noir and Merlot: - We need Wine entities filtered by name.",
      "Relevant entity types: Dish, Wine; Relevant relationships: Dish_pairs_with_Wine; Relevant attributes: wine_type, body, acidity, origin, flavor_profile",
      "Synthesizing verified recommendation"
    ],
    answer: `The Chef’s special pasta pairs best with Pinot Noir due to its medium body and higher acidity.

Compared to Merlot:
– Pinot Noir: lighter body, brighter acidity  
– Merlot: fuller body, softer tannins  

For creamy sauces → Pinot Noir is optimal.`
  }
};

export default function ProductDemo() {
  const [state, setState] = useState("IDLE");
  const [scenario, setScenario] = useState(null);
  const [reasoningIndex, setReasoningIndex] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState("");

  const startScenario = (key) => {
    setScenario(SCENARIOS[key]);
    setState("USER_QUESTION");
    setReasoningIndex(0);
    setDisplayedAnswer("");
  };

  useEffect(() => {
    if (!scenario) return;

    if (state === "USER_QUESTION") {
      const t = setTimeout(() => setState("THINKING"), 600);
      return () => clearTimeout(t);
    }

    if (state === "THINKING") {
      const t = setTimeout(() => setState("REASONING"), 1000);
      return () => clearTimeout(t);
    }

    if (state === "REASONING") {
      if (reasoningIndex < scenario.reasoning.length) {
        const timer = setTimeout(() => {
          setReasoningIndex((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        const t = setTimeout(() => setState("ANSWER"), 600);
        return () => clearTimeout(t);
      }
    }

    if (state === "ANSWER") {
      let i = 0;
      const text = scenario.answer;

      const interval = setInterval(() => {
        setDisplayedAnswer(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setState("DONE");
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [state, reasoningIndex, scenario]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scenarios}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => startScenario(key)}
            className={styles.scenarioBtn}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.layout}>

        {/* CHAT SIDE */}
        <Chat title="Chat with Vedana">
          {scenario && (
            <>
              {/* User message */}
              <ChatItem
                participant={2}
                text={scenario.question}
              />

              {/* Bot answer */}
              {(state === "ANSWER" || state === "DONE") && (
                <ChatItem participant={1}>
                  <div style={{ whiteSpace: "pre-line" }}>
                    {displayedAnswer}
                  </div>
                </ChatItem>
              )}
            </>
          )}
        </Chat>

        {/* REASONING SIDE */}
        <div className={styles.reasoning}>
          {scenario && state !== "IDLE" && (
            <div className={styles.reasoningSteps}>
              {scenario.reasoning
                .slice(
                  0,
                  state === "DONE"
                    ? scenario.reasoning.length
                    : reasoningIndex
                )
                .map((step, i) => (
                  <div key={i} className={styles.reasoningLine}>
                    → {step}
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}