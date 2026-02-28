---
title: "Questions and Answers"
---

## Overview

Vedana includes a built-in FAQ mechanism that works out of the box. It is the simplest way to provide short, consistent, high-confidence answers to known questions, no additional modeling required.

FAQ entries are stored in a dedicated table in Grist and retrieved directly at runtime. Because the answers are predefined, they do not vary between users or sessions. For questions where consistent wording matters, FAQ is the most reliable ingestion method available.

## FAQ Table Structure

The FAQ table lives in Grist and contains two columns:

|Column|Content|
|---|---|
|**question**|A representative phrasing of the question|
|**answer**|The exact answer to return|

Each row is one FAQ entry. 
The table is predefined and ready to use — you only need to populate it.

## How FAQ Is Used

When a user asks a question, the system checks whether it matches a FAQ entry by applying vector similarity against the question column. If a match is found above the configured threshold, the corresponding answer is retrieved and returned.

The workflow:
1. User asks a question.
2. System checks FAQ intent.
3. Vector similarity (or direct matching) is applied to the `question` column.
4. Matching FAQ entry is retrieved.
5. The corresponding `answer` is returned or formatted.

FAQ retrieval is lightweight and efficient. It bypasses graph traversal and document retrieval entirely, making it well-suited for:

- Common support questions.
- Standard policy responses.
- Fixed operational answers.
- Any question where the response must not vary.
    
## Controlling FAQ Behaviour

FAQ answer behavior is governed by a predefined prompt template in **Grist → Data Model → Queries**. 
There is a predefined prompt template that instructs the LLM:

- Prefer FAQ answers when relevant.
- Use the stored `answer` field.
- Avoid inventing additional information.
- Keep formatting consistent.

This ensures FAQ answers are stable and controlled.
You do not need to configure this manually. It is set up out of the box. 
If you need to adjust how FAQ answers are formatted or when they are preferred over other retrieval methods, this is where to look.

## When to Use FAQ vs Documents

Use FAQ when the answer is short, canonical, and should not vary. 
For example: business hours, return policies, or standard support responses. 

Use document chunks when the answer is long, contextual, retrieving information spans across multiple sections or requires interpretation.

FAQ entries behave like high-priority knowledge units. When a question matches a FAQ entry well, that answer takes precedence over document retrieval.

## Best Practices

- Keep questions concise and representative: choose phrasing your users are most likely to use.
- Avoid duplicating the same intent across multiple FAQ rows, as this can produce inconsistent retrieval.
- Ensure answers are self-contained. The response should make sense without additional context.
- Review FAQ coverage periodically and add entries for questions that recur frequently in usage logs.

FAQ is not a replacement for structured data modeling or document ingestion. It is a fast, stable answer layer for known question-and-answer pairs.
