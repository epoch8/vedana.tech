---
title: "Semantic RAG overview"
---

## What Is Semantic RAG?

Semantic RAG is not simply "search + LLM." It is a system built from four interdependent components:

**Data Model + Tools + Data + Assistant**

All four parts work together to produce precise, verifiable answers to questions.

![img](https://github.com/epoch8/content/blob/master/images/Vedana/Screenshot%202026-02-19%20at%2016.42.33.png)

## Definition

A **Semantic RAG** system consists of:

- Data — the raw material: documents, records, and structured entities.
- Data Model — a structured representation of the domain and the relationships within it.
- Tools — capabilities the assistant can invoke: queries, graph traversal, counting, filtering.
- Assistant — an LLM-powered agent that knows when and how to use the right tool for a given question.

Without structure and tools, the assistant guesses answers.
With structure and tools, the assistant understands the question fully and gives a precise answer.

## How It Differs from Classic RAG

Classic RAG operates on a flat pipeline:
```
Chunks → Top-K → LLM → Answer
```
It retrieves text that looks related and asks the LLM to synthesize it. This works for open-ended questions but fails the moment precision matters.

**Semantic RAG** adds structured awareness: 

- Knows what entities exist
- Knows how they relate
- Can count
- Can filter
- Can traverse relationships
- Can prove where the answer came from

Semantic RAG does not rely only on similarity alone.

## “Understand, Not Guess”

To “understand” means:

- If the question asks “How many?”, the system actually counts.
- If the question asks “Show all”, it retrieves everything.
- If the question asks about compatibility, it checks relationships.

The assistant does not invent answers from text fragments.
It uses tools to compute answers.

## How It Works

```mermaid
flowchart LR
User --> Assistant
Assistant -->|Select tool| Tools
Tools --> Graph
Tools --> VectorIndex
Assistant --> Answer
Answer --> Sources
```

The step-by-step process:

1. User asks a question.
2. Assistant detects intent.
3. Assistant selects the right tool.
4. Tool queries structured data (Graph or Vector index).
5. Assistant formats the answer.
6. Sources are attached as evidence.
    
## Required Properties

A real Semantic RAG system must have:

- **Deterministic tool calls**  
    The assistant does not randomly decide — it follows rules.
- **Verifiable sources**  
    Every answer can be traced back to data.
- **Exhaustive answers when required**  
    If the user asks for “all”, the system returns all.

If any of these are missing, the system is still classic RAG regardless of what it is called.

## What Vedana Does Not Do

Vedana does not let the LLM freely invent logic, rely exclusively on embeddings, or treat all text as undifferentiated context. It also does not guarantee correctness without proper domain modeling.

Semantic RAG is not magic. It requires a structured model, clear rules, and well-defined tools. 
Because reliable answers require structure.
Not just probability.
