---
title: "Questions and Answers"
---

## Overview

Vedana includes a predefined FAQ mechanism out of the box.

This is the simplest way to provide high-confidence, short, deterministic answers.

FAQ entries are stored in a dedicated table and are used directly during retrieval.

---

## FAQ Table Structure

In Grist, there is a predefined table:

**faq**

It contains two main columns:

- question
    
- answer
    

Each row represents one FAQ entry.

---

## How FAQ Is Used

At runtime:

1. User asks a question
    
2. System checks FAQ intent
    
3. Vector similarity (or direct matching) is applied to the `question` column
    
4. Matching FAQ entry is retrieved
    
5. The corresponding `answer` is returned or formatted
    

FAQ retrieval is lightweight and efficient.

It is ideal for:

- Common support questions
    
- Standard policies
    
- Fixed operational answers
    
- Short deterministic responses
    

---

## Prompt Instructions for FAQ

The behavior for FAQ answering is already defined in:

Grist → Data-model → Queries

There is a predefined prompt template that instructs the LLM:

- Prefer FAQ answers when relevant
    
- Use the stored `answer` field
    
- Avoid inventing additional information
    
- Keep formatting consistent
    

This ensures FAQ answers are stable and controlled.

---

## When to Use FAQ vs Documents

Use FAQ when:

- The answer is short and canonical
    
- You want consistent wording
    
- The response must not vary
    

Use document chunks when:

- The answer is long or contextual
    
- The information spans multiple sections
    
- Interpretation is required
    

FAQ entries behave like high-priority knowledge units.

---

## Best Practices

- Keep questions concise and representative
    
- Avoid duplicating the same intent across multiple FAQ rows
    
- Ensure answers are self-contained
    
- Periodically validate FAQ coverage using evaluation datasets
    

FAQ is not a replacement for structured data modeling.

It is a fast, deterministic answer layer.

---

## Summary

Vedana includes a built-in FAQ table with:

- question
    
- answer
    

It is immediately usable without additional modeling.

FAQ responses are controlled via predefined prompt templates.

This is the simplest and most stable ingestion method for known Q&A pa