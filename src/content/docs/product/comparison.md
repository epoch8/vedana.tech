---
title: Comparison with Classic RAG
section: Product
order: 2
---

# Comparison with Classic RAG

Vedana isn't an "improved" RAG. It's a **different approach** optimised for a different class of tasks.

## High-level comparison

| Parameter                                       | Classic RAG                              | Vedana (Semantic RAG)                                    |
| ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Storage                                         | flat collection of chunks + embeddings    | knowledge graph + structured data + embeddings           |
| Retrieval                                       | top-K by vector similarity                 | Cypher / vector / hybrid                                  |
| Answer completeness                             | a sample                                  | a complete set                                            |
| Exact values                                    | approximation (text from top-K)           | exact (via Cypher)                                       |
| Multi-hop reasoning                             | bad                                       | good (when links are described)                          |
| Determinism                                     | no                                        | yes (with a strict playbook)                              |
| Source citation                                 | conditional (chunk metadata)              | deterministic (graph nodes, document.url)                 |
| Setup cost                                      | low                                       | medium (data model required)                              |
| Handling data changes                           | re-embedding                              | incremental ETL (Datapipe)                                |
| Explainability                                  | low                                       | high (Cypher + reasoning are visible)                    |
| Speed on simple questions                       | faster (1 LLM call)                       | comparable or slower (filtering + tool calls)             |
| Suited for                                      | summarization, text search                | catalogs, regulations, hybrid domains                    |

## Where Vedana clearly wins

### Exact values

"How much is X?" → Vedana fetches `product.price` via Cypher. Classic RAG will find text like "X currently costs 999, but there are sometimes promos" — and you'll get an answer with possible errors / stale data.

### Complete lists

"Show me every category under 1000" → Vedana returns **all** records. Classic RAG returns the top-5 chunks that mention prices — and that's not "all of them".

### Complex relationships

"Which documents regulate products in category X?" → Vedana traverses two graph hops. Classic RAG, at best, finds a paragraph that happens to mention the relationship.

### Audit

In Vedana every answer can be broken down by operations: which Cypher ran, which chunks were retrieved, how data model filtering picked the context. Classic RAG usually limits you to "these chunks went into the context".

## Where classic RAG is simpler

### "Tell me about this document"

If the task is to summarise a document briefly, classic RAG (or even just the full text in the LLM) is simpler and cheaper.

### A purely text domain

If there's no data, just PDFs, and the assistant is expected to "find and retell" — Vedana is overkill. ChromaDB + a prompt will do.

### MVP over a weekend

Bringing up classic RAG over ChromaDB / Pinecone with one LLM is an evening's work. Describing Vedana's data model is a working week minimum, and ROI shows up on complex domains.

## Hybrid

Vedana still has vector search — it doesn't ditch classic RAG, it **extends** it. That means you can move gradually:

1. Start with the default model (only document/document_chunk/faq) — that's already advanced RAG.
2. Add structured anchors over time for question types where classic RAG fails.
3. Extend the playbook as you spot failure patterns on the golden dataset.

Unlike "RAG vs graph", Vedana enables **gradual migration** — without redeploys or rewrites.

## When to choose what

If your business case looks like this:

- "We have PDF regulations and need search" → start with classic RAG; might be enough.
- "We have PDFs + a structured catalog and accuracy matters" → Vedana.
- "We have a complex domain — legal/compliance/medical/finance" → Vedana, no question.
- "We just need a text helper for the team" → classic RAG, more economical.
- "Everything at once and growing" → Vedana, scaling on its data model is easier.

## What to choose in any case

Whether RAG or Vedana, **definitely** set up a golden dataset and run eval regularly. Without it you can't objectively compare which approach works better for **your** case. See [Quality Metrics & Evaluation](./evaluation.md).

## What's next

- [Use Cases](./use-cases.md)
- [Quality Metrics & Evaluation](./evaluation.md)
- [Limitations](./limitations.md)
