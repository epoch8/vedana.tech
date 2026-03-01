import { useState, useEffect } from "react";
import styles from "./ProductDemo.module.css";

const SCENARIOS = {
  wine: {
    label: "Wine pairing",
    question:
      "Which wine pairs best with the Chef’s special pasta?",
    reasoning: [
      "Identifying entity types: Dish, Wine",
      "Applying relationship: Dish_pairs_with_Wine",
      "Retrieving paired wines",
      "Comparing structural attributes (body, acidity)",
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

  // Flow controller
  useEffect(() => {
    if (!scenario) return;

    if (state === "USER_QUESTION") {
      setTimeout(() => setState("THINKING"), 600);
    }

    if (state === "THINKING") {
      setTimeout(() => setState("REASONING"), 1000);
    }

    if (state === "REASONING") {
      if (reasoningIndex < scenario.reasoning.length) {
        const timer = setTimeout(() => {
          setReasoningIndex((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setState("ANSWER"), 600);
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
        <div className={styles.chat}>
          {scenario && (
            <>
              <div className={styles.userMessage}>
                {scenario.question}
              </div>

              {state === "ANSWER" || state === "DONE" ? (
                <div className={styles.vedanaMessage}>
                  {displayedAnswer}
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className={styles.reasoning}>
        {scenario && state !== "IDLE" && (
            <>
            {/* <ThinkingLogo active={state === "THINKING" || state === "REASONING"} /> */}

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
            </>
        )}
        </div>
      </div>
    </div>
  );
}