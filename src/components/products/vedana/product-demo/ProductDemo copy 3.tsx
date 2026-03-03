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

  const [visibleCardCount, setVisibleCardCount] = useState<number>(0);
  const [highlightedCard, setHighlightedCard] = useState<number | null>(null);

  const [typedAnswer, setTypedAnswer] = useState<string>("");

  /* =====================================================
     UTILS
  ===================================================== */

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

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
    setVisibleCardCount(0);
    setHighlightedCard(null);
    setTypedAnswer("");
  };

  /* =====================================================
     PHASE MACHINE
  ===================================================== */

  useEffect(() => {
    if (!activeScenario) return;

    if (phase === "QUESTION") {
      const t = setTimeout(() => setPhase("THINKING"), 600);
      return () => clearTimeout(t);
    }

    if (phase === "THINKING") {
      const t = setTimeout(() => {
        setPhase("REASONING");
        setBlockIndex(1);
      }, 800);
      return () => clearTimeout(t);
    }

  }, [phase, activeScenario]);

  /* =====================================================
     BLOCK FLOW (SEQUENTIAL, NO OVERLAP)
  ===================================================== */

  useEffect(() => {
    if (!activeScenario) return;
    if (phase !== "REASONING") return;

    const block = activeScenario.reasoning[blockIndex - 1];

    if (!block) {
      const t = setTimeout(() => setPhase("ANSWER"), 400);
      return () => clearTimeout(t);
    }

    let cancelled = false;

    const runBlock = async () => {

      setVisibleCardCount(0);
      setHighlightedCard(null);

      // если нет карточек — просто пауза
      if (!block.cards || block.cards.length === 0) {
        await sleep(600);
        if (!cancelled) {
          setBlockIndex((prev) => prev + 1);
        }
        return;
      }

      for (let i = 0; i < block.cards.length; i++) {
        if (cancelled) return;

        setVisibleCardCount((prev) => prev + 1);
        setHighlightedCard(i);

        await sleep(400); // highlight
        if (cancelled) return;

        setHighlightedCard(null);

        await sleep(200); // micro pause
      }

      await sleep(300); // pause before next block

      if (!cancelled) {
        setBlockIndex((prev) => prev + 1);
      }
    };

    runBlock();

    return () => {
      cancelled = true;
    };

  }, [blockIndex, phase, activeScenario]);

  /* =====================================================
     ANSWER TYPING
  ===================================================== */

  useEffect(() => {
    if (!activeScenario) return;
    if (phase !== "ANSWER") return;

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

  }, [phase, activeScenario]);

  /* =====================================================
     VISIBLE BLOCKS
  ===================================================== */

  const visibleBlocks: readonly Block[] = useMemo(() => {
    if (!activeScenario) return [];
    return activeScenario.reasoning.slice(0, blockIndex);
  }, [activeScenario, blockIndex]);

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
            emptyScenarios={scenarios.map(s => ({
              key: s.key,
              label: s.label
            }))}
            onScenarioClick={runScenario}
            reactions={[]}
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
          {visibleBlocks.map((block: Block, blockIdx: number) => {

            const isActiveBlock = blockIdx === blockIndex - 1;

            return (
              <div key={blockIdx} className={styles.reasoningBlock}>

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
                    {(isActiveBlock
                      ? block.cards.slice(0, visibleCardCount)
                      : block.cards
                    ).map((cardId: CardId, i: number) => {

                      const card = cardRegistry[cardId];

                      return (
                        <EntityCardMini
                          key={cardId}
                          className={
                            isActiveBlock && i === highlightedCard
                              ? styles.highlightCard
                              : undefined
                          }
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
                    {block.logic.map((line: string, i: number) => (
                      <div key={i} className={styles.logicLine}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}