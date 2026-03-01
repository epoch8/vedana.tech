---
title: "Why Classic RAG Fails"
---

Before diving into Vedana's architecture, it helps to understand the problem it was built to solve. This chapter walks through the failure modes of classic RAG, not to dismiss the approach, but to clarify exactly where it breaks down and why a different architecture is needed.

## What Is Classic RAG?

Classic RAG (Retrieval-Augmented Generation) is a widely-used pattern for connecting a language model to a body of documents. The pipeline works like this:

1. Split documents into small chunks
2. Turn each chunk into embeddings (vectors)
3. When a user asks a question, find the top-K most similar chunks
4. Send those chunks to the LLM
5. The LLM writes an answer
    
In short:

```
Chunks → Embeddings → Top-K → LLM → Answer
```

This works surprisingly well for many tasks. When the answer lives neatly inside one or two chunks, classic RAG is fast, cheap to set up, and often accurate enough.

## Where Classic RAG Works Fine

Classic RAG is good at:

- Summarizing text
- Answering simple factual questions
- Searching small documents
- Extracting information from one paragraph
- Approximate answers are acceptable

> **Rule of thumb**: If the answer "lives" visibly inside one or two paragraphs and completeness doesn't matter, classic RAG will serve you well. 

## Where Classic RAG Breaks

Problems start the moment a question requires structure, completeness, or logic across multiple records.
In practice, real-world users ask questions that go beyond text similarity and require a more precise answers. Below are the four most common failure modes, encountered repeatedly across different domains.

#### 1. Aggregation Queries - “How many?”

**Example query:** *"How many certified products do we have?"*

Classic RAG does not count. It retrieves a few similar chunks and has the LLM estimate. The result is almost always wrong:

- *"Around 10"* — a guess based on what appeared in the top chunks
- *"About 15"* — a different guess on the next run
- A list of examples instead of a count at all

The root problem: classic RAG only sees the top-K chunks, not the full dataset. The model has no way to count across all records. It approximates, and approximation is not acceptable when business decisions depend on the number.

#### 2. Exhaustive Queries - “Show me all”

**Example query:** *"Show me all bathroom lighting products."*

Classic RAG retrieves only the top matches. If your catalog has 200 bathroom lights, you will see maybe 5–10. The rest are silently omitted, and the assistant typically doesn't signal that the list is incomplete.

This failure is especially damaging in high-stakes contexts. A user who asks *"Show me all required compliance documents for this product"* and receives a partial list may assume the list is complete. Missing documents can mean regulatory violations, delays, or legal liability.

> ⚠️ In a relational or graph database, these queries are trivial: a simple filter or JOIN returns every matching record. Classic RAG has no mechanism for exhaustive retrieval. It is fundamentally a "top-N most similar" system.

#### 3. Compatibility Quieries

**Example:** *"Is product A compatible with regulation B?"*

The answer may require:

- Graph traversal
- Relationship checking
- Logical conditions

Classic RAG cannot reliably reason over structured relationships.  
It just reads text and makes a guess.

#### 4. Domain Logic (Rules and Regulations)

In real-world systems, answers depend on rules:

- If product type = X AND region = EU → require document Y
- If voltage > 50V → certification required
    
Classic RAG does not execute logic.  
It predicts text. But prediction is not reasoning.


## The Root Cause: LLMs Have No World Model

All four failure modes trace back to one fundamental fact: **modern language models do not build an internal model of a domain.** They process patterns in text, not representations of reality.

This shows up in predictable ways:

- Weak generalization when encountering new or edge-case inputs.
- Self-contradictions in longer reasoning chains.
- No ability to simulate a system (e.g., a business process or product catalog).
- Inability to enforce fixed rules and invariants unless they are explicitly encoded in retrieved data.

For domains where strict logic and accuracy are critical — compliance, engineering, medicine, finance — this is a fundamental limitation, not a minor inconvenience.

> **Key insight:** Classic RAG amplifies this problem. It hands the model a few text fragments and asks it to reason about a world it has never formally modeled. The results reflect the limits of both the retrieval mechanism and the model's underlying architecture.

## What These Failures Require

Solving these problems requires more than better embeddings or a larger top-K window. 

LLMs are trained to produce fluent, confident-sounding output. When they don't have a definitive answer, they still try to generate something reasonable and plausible. 

That is dangerous when:

- You need exact counts
- You need complete lists
- You need regulatory compliance
- Mistakes cost money

Fluency is not correctness.
The failures are structural. The solution needs to address them at the architecture level:

- **Aggregation queries** need a system that can execute `COUNT`, `SUM`, and `GROUP BY` against the full dataset, not sample a few chunks.
- **Exhaustive queries** need a retrieval mechanism that guarantees completeness — every matching record, not just the most similar ones.
- **Precision queries** need structured lookups against verified data, not semantic similarity against document text.
- **Relationship queries** need an explicit domain model with encoded rules and entity links, not inference from overlapping language.

Reliable answers require more than text similarity. They require a structured model of the domain, tools capable of querying that structure, deterministic counting and filtering, and evidence attached to every answer.
That is why Vedana exists.


