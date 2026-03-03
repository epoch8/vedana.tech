import { useEffect, useMemo, useState } from "react";

import Chat from "@/components/blocks/chat/Chat";
import ChatItem from "@/components/blocks/chat/ChatItem";

import EntityCardMini from "@/components/blocks/entity-card/EntityCardMini";
import EntityCardMiniList from "@/components/blocks/entity-card/EntityCardMiniList";

import styles from "./ProductDemo.module.css";

/* =====================================================
   TYPES
===================================================== */

export type ReasoningBlock<CardId extends string> = {
  title?: string;
  narration?: string;
  cards?: readonly CardId[];
  logic?: readonly string[];
};

export type Scenario<CardId extends string> = {
  key: string;
  label: string;
  question: string;
  reasoning: readonly ReasoningBlock<CardId>[];
  answer: string;
};

type Phase =
  | "IDLE"
  | "QUESTION"
  | "THINKING"
  | "REASONING"
  | "ANSWER"
  | "DONE";

type CardBase = { entity: string; name: string } & Record<string, any>;

type Props<TRegistry extends Record<string, CardBase>> = {
  cardRegistry: TRegistry;
  scenarios: readonly Scenario<keyof TRegistry & string>[];
};

/* =====================================================
   COMPONENT
===================================================== */

export default function ProductDemo<
  TRegistry extends Record<string, CardBase>
>({ cardRegistry, scenarios }: Props<TRegistry>) {

  type CardId = keyof TRegistry & string;
  type Block = ReasoningBlock<CardId>;

  const [phase, setPhase] = useState<Phase>("IDLE");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [blockIndex, setBlockIndex] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>("");

  /* =====================================================
     ACTIVE SCENARIO
  ===================================================== */

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.key === activeKey) ?? null;
  }, [scenarios, activeKey]);

  /* =====================================================
     START SCENARIO
  ===================================================== */

  const runScenario = (key: string) => {
    setActiveKey(key);
    setPhase("QUESTION");
    setBlockIndex(0);
    setTypedAnswer("");
  };

  /* =====================================================
     EMPTY + REACTIONS
  ===================================================== */

  const emptyScenarios = useMemo(
    () =>
      scenarios.map((s) => ({
        key: s.key,
        label: s.label
      })),
    [scenarios]
  );

  const reactionButtons = useMemo(() => {
    if (phase !== "DONE" || !activeScenario) return [];

    return scenarios
      .filter((s) => s.key !== activeScenario.key)
      .map((s) => ({
        label: s.label,
        onClick: () => runScenario(s.key)
      }));
  }, [phase, activeScenario, scenarios]);

  /* =====================================================
     PHASE MACHINE
  ===================================================== */

  useEffect(() => {
    if (!activeScenario) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (phase === "QUESTION") {
      timeout = setTimeout(() => setPhase("THINKING"), 600);
    }

    else if (phase === "THINKING") {
      timeout = setTimeout(() => setPhase("REASONING"), 800);
    }

    else if (phase === "REASONING") {
      if (blockIndex < activeScenario.reasoning.length) {
        timeout = setTimeout(
          () => setBlockIndex((prev: number) => prev + 1),
          700
        );
      } else {
        timeout = setTimeout(() => setPhase("ANSWER"), 400);
      }
    }

    else if (phase === "ANSWER") {
      let i = 0;
      const text = activeScenario.answer;

      interval = setInterval(() => {
        setTypedAnswer(text.slice(0, i));
        i++;

        if (i > text.length) {
          if (interval) clearInterval(interval);
          setPhase("DONE");
        }
      }, 15);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };

  }, [phase, activeScenario, blockIndex]);

  /* =====================================================
     VISIBLE BLOCKS
  ===================================================== */

  const visibleBlocks: readonly Block[] = useMemo(() => {
    if (!activeScenario) return [];
    if (phase === "DONE") return activeScenario.reasoning;
    return activeScenario.reasoning.slice(0, blockIndex);
  }, [phase, activeScenario, blockIndex]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const cardToAttributes = (card: TRegistry[CardId]) => {
    return Object.entries(card)
      .filter(([key]) => !["entity", "name"].includes(key))
      .map(([key, value]) => ({
        key,
        value: Array.isArray(value)
          ? value.join(", ")
          : String(value)
      }));
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>

        {/* ================= CHAT ================= */}
        <div className={styles.chatContainer}>
          <Chat
            title="Chat with Vedana"
            isEmpty={!activeScenario}
            showInput={false}
            emptyScenarios={emptyScenarios}
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
                    <div
                      className={styles.answerContent}
                      dangerouslySetInnerHTML={{ __html: typedAnswer }}
                    />
                  </ChatItem>
                )}
              </>
            )}
          </Chat>
        </div>

        {/* ================= REASONING ================= */}
        <div className={styles.reasoning}>
          {visibleBlocks.map(
            (block: Block, index: number) => (
              <div key={index} className={styles.reasoningBlock}>

                {block.narration && (
                  <div className={styles.reasoningNarration}>
                    {block.narration}
                  </div>
                )}

                {block.title && (
                  <div className={styles.reasoningTitle}>
                    {block.title}
                  </div>
                )}

                {block.cards && block.cards.length > 0 && (
                  <EntityCardMiniList>
                    {block.cards.map((cardId: CardId) => {
                      const card = cardRegistry[cardId];

                      return (
                        <EntityCardMini
                          key={cardId}
                          title={card.name}
                          entityType={card.entity}
                          attributes={cardToAttributes(card)}
                        />
                      );
                    })}
                  </EntityCardMiniList>
                )}

                {block.logic && block.logic.length > 0 && (
                  <div className={styles.logicBlock}>
                    {block.logic.map(
                      (line: string, i: number) => (
                        <div key={i} className={styles.logicLine}>
                          {line}
                        </div>
                      )
                    )}
                  </div>
                )}

              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}