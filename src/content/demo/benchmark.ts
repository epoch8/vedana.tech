import raw from "./benchmark.json";

export type QuestionType =
  | "trap"
  | "cross-case"
  | "article"
  | "court-fact"
  | "chronological"
  | "law-structure";

export type Verdict = "PASS" | "FAIL";
export type ChatGptVerdict = "PASS" | "PARTIAL" | "FAIL";

export type Outcome = "vedana-wins" | "chatgpt-wins" | "both-pass" | "both-fail";

export type BenchmarkQuestion = {
  id: string;
  type: QuestionType;
  typeLabel: string;
  question: string;
  official: string;
  vedana: { answer: string; verdict: Verdict; comment: string; trace?: string };
  chatgpt?: { answer: string; verdict: ChatGptVerdict; comment: string };
  outcome: Outcome;
};

function computeOutcome(vedana: Verdict, chatgpt?: ChatGptVerdict): Outcome {
  const vedanaPass = vedana === "PASS";
  const chatgptPass = chatgpt === "PASS";
  if (vedanaPass && chatgptPass) return "both-pass";
  if (vedanaPass && !chatgptPass) return "vedana-wins";
  if (!vedanaPass && chatgptPass) return "chatgpt-wins";
  return "both-fail";
}

export const typeLabels: Record<QuestionType, string> = {
  trap: "TRAP",
  "cross-case": "CROSS-CASE",
  article: "ARTICLE",
  "court-fact": "COURT FACT",
  chronological: "CHRONOLOGICAL",
  "law-structure": "LAW STRUCTURE",
};

export const typeNames: Record<QuestionType, string> = {
  trap: "Trap questions",
  "cross-case": "Cross-case comparison",
  article: "Article provisions",
  "court-fact": "Court case facts",
  chronological: "Chronological ordering",
  "law-structure": "Law structure & metadata",
};

export const benchmarkQuestions: BenchmarkQuestion[] = (
  raw as Omit<BenchmarkQuestion, "typeLabel" | "outcome">[]
).map((q) => ({
  ...q,
  typeLabel: typeLabels[q.type],
  outcome: computeOutcome(q.vedana.verdict, q.chatgpt?.verdict),
}));

export const passedCount = benchmarkQuestions.filter((q) => q.vedana.verdict === "PASS").length;
export const totalCount = benchmarkQuestions.length;
export const passRate = ((passedCount / totalCount) * 100).toFixed(1);

export const chatgptPassedCount = benchmarkQuestions.filter((q) => q.chatgpt?.verdict === "PASS").length;
export const chatgptPassRate = ((chatgptPassedCount / totalCount) * 100).toFixed(1);

const typeOrder: QuestionType[] = ["trap", "cross-case", "article", "court-fact", "chronological", "law-structure"];

const shortLabels: Record<QuestionType, string> = {
  trap: "Trap",
  "cross-case": "Cross-case",
  article: "Article",
  "court-fact": "Court fact",
  chronological: "Chronological",
  "law-structure": "Law structure",
};

export const questionTypeFilters: { key: QuestionType | "all"; label: string; count: number }[] = [
  { key: "all", label: `All ${totalCount}`, count: totalCount },
  ...typeOrder.map((t) => ({
    key: t,
    label: shortLabels[t],
    count: benchmarkQuestions.filter((q) => q.type === t).length,
  })),
];

export const outcomeFilters: { key: Outcome | "all"; label: string; count: number }[] = [
  { key: "all", label: "All", count: totalCount },
  { key: "vedana-wins", label: "Vedana wins", count: benchmarkQuestions.filter((q) => q.outcome === "vedana-wins").length },
  { key: "chatgpt-wins", label: "ChatGPT wins", count: benchmarkQuestions.filter((q) => q.outcome === "chatgpt-wins").length },
  { key: "both-pass", label: "Both pass", count: benchmarkQuestions.filter((q) => q.outcome === "both-pass").length },
  { key: "both-fail", label: "Both fail", count: benchmarkQuestions.filter((q) => q.outcome === "both-fail").length },
];
