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

> **Rule of thumb**: If the answer "lives" visibly inside one or two paragraphs and completeness doesn't matter, classic RAG will serve you well. Problems start the moment a question requires structure, completeness, or logic across multiple records.

## Where Classic RAG Breaks

Problems start when a question requires structure, completeness, or logic.

#### 1. Aggregation Queries - “How many?”

Example:

> How many certified products do we have?

Classic RAG does not count.  
It retrieves a few similar chunks and guesses.

It might answer:

- “Around 10”
- “About 15”
- Or give examples instead of a real number
    
It does not know the full dataset. It only sees top-K chunks.

#### 2. Exhaustive Queries - “Show me all”

Example:

> List all products that require document X.

Classic RAG retrieves only the top matches.
If there are 47 items, it may show 5 or 8.
It does not know what “all” means.

#### 3. Compatibility Quieries

Example:

> Is product A compatible with regulation B?

The answer may require:

- Graph traversal
- Relationship checking
- Logical conditions

Classic RAG cannot reliably reason over structured relationships.  
It just reads text and guesses.

#### 4. Domain Logic (Rules and Regulations)

In real-world systems, answers depend on rules:

- If product type = X AND region = EU → require document Y
- If voltage > 50V → certification required
    
Classic RAG does not execute logic.  
It predicts text.
Prediction is not reasoning.

## Why “Increase K” Is Not a Solution

A common suggestion is to simply increase the number of retrieved chunks. 
This does not solve the underlying problem:

- More chunks = more noise
- LLM context gets overloaded
- Costs go up
- There is still no guarantee of completeness

Even with 50 chunks, the model is still guessing.

## Why LLM Should Not Guess

LLMs are trained to produce fluent, confident-sounding output. When they don't have a definitive answer, they still try to generate something reasonable and plausible. 

That is dangerous when:

- You need exact counts
- You need complete lists
- You need regulatory compliance
- Mistakes cost money

Fluency is not correctness.

### Example: a Typical Failure

**Question:**

> How many devices require CE certification?

**Classic RAG:**

Retrieves 6 chunks mentioning CE.  
LLM answers:
> “There are several devices that require CE certification, including…”
No number.
Or worse:
> “There are 6 devices…”
But there are actually 23.

#### What Is Missing?

Classic RAG sees text.
It does not see:

- Entities
- Relationships
- Rules
- Full datasets
- Exact counts
    
It has no structured understanding of the domain. Which is why it can't give a precise answer.

## Conclusion

Reliable answers require more than text similarity. They require a structured model of the domain, tools capable of querying that structure, deterministic counting and filtering, and evidence attached to every answer.
That is why Vedana exists.
