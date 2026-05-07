---
title: FAQ
section: Data Ingestion
order: 4
---

# FAQ

## Overview

Vedana includes a built-in FAQ mechanism that works out of the box. It's the simplest way to give short, consistent, high-confidence answers to known questions — no extra modeling required.

FAQ entries are stored in a dedicated Grist table and retrieved directly at runtime. Because the answers are predefined, they **don't vary** between users or sessions. When stable wording matters (for support, policies, operational answers), FAQ is the most reliable ingestion mechanism.

## What an FAQ entry is

A predefined question/answer pair stored in Grist. When a user asks a question that matches an FAQ entry closely enough, the stored answer is returned **directly** — no graph traversal, no document search, no retrieval logic beyond similarity matching.

## Table structure

| Column     | Content                                       |
| ---------- | ----------------------------------------------- |
| **question** | A representative phrasing of the question.   |
| **answer**   | The exact answer to return.                  |

Each row is one FAQ entry. The table is predefined and ready to use; you only need to populate it.

## How retrieval works

```mermaid
flowchart TD
    Q[User:<br/>"What's the return policy?"] --> EM[Embed query]
    EM --> S[Vector similarity vs<br/>FAQ.question]
    S --> C{Score > threshold?}
    C -- "Yes" --> A[Return FAQ.answer<br/>verbatim]
    C -- "No" --> P[Forward to the main<br/>RagPipeline]
    P --> CY[cypher / vector<br/>search over the graph]
    CY --> ANS[Grounded answer]
```

When a user submits a question, the system checks the FAQ table **before** any other retrieval. The user's question is embedded and compared to the `question` column via vector similarity. If the score exceeds the configured threshold, the corresponding `answer` is returned.

Workflow:

1. User asks a question.
2. FAQ intent check.
3. Vector similarity (or direct match) is applied to the `question` column.
4. The matching FAQ entry is retrieved.
5. The corresponding `answer` is returned.

```
User → embedding → similarity ⩾ threshold? →
   Yes → return FAQ answer
   No  → continue in the main pipeline (documents / graph)
```

FAQ retrieval **bypasses** graph traversal and document retrieval. It's lightweight, fast, efficient. A well-matched FAQ entry always returns the same answer.

The threshold controlling "close enough" is configured in the data model. If FAQ matches too broadly or too narrowly, that's the first place to look.

## How FAQ differs from documents and structured data

Each type serves a different purpose. Picking the wrong one is one of the most common causes of inconsistent answers.

**Use FAQ** when the answer is short, fixed, and shouldn't vary: opening hours, return policy, contact details, standard support replies. The answer is authoritative and should be returned verbatim.

**Use documents** when the answer is long, contextual, requires interpretation: policies, manuals, contract texts. The user is asking what something *says*, not which value.

**Use structured data** when the answer depends on a specific attribute, count, filter, or relationship: product prices, branch locations, contract dates. The user is asking for a specific value computable from the graph.

The most common mistake is using FAQ for questions that should be structured data, or documents for questions that should be FAQ. Branch opening hours stored as an FAQ entry work, but they **can't** be filtered, compared, or updated without manual editing of the row. The same data modelled as a `Branch` anchor with an `opening_hours` attribute can be updated in one place and queried precisely for any branch.

## What FAQ doesn't do

FAQ is a lookup table, not a reasoning layer. It:

- doesn't synthesise answers from multiple entries,
- doesn't follow relationships,
- doesn't adapt the answer based on context.

If a question doesn't match a stored entry above the threshold, FAQ returns nothing and the system continues with other retrieval methods.

FAQ also **doesn't scale well** as the primary answer mechanism for a large domain. As the table grows, entries with overlapping intents start competing with each other, producing unstable matching. FAQ works best as a **small, curated** set of high-confidence entries — not as a substitute for a properly modeled domain.

## What's next

- [Adding FAQ Entries guide](../guides/adding-faq-entries.md) — practical guide.
- [Data for Vedana](../concepts/data-for-vedana.md) — the three data types in context.
