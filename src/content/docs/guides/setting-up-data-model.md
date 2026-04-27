---
title: Setting up Data Model
section: "Guides"

---

_This guide walks through configuring all seven tables in **Grist → Data Model**. Read [Data Model for Vedana] first if you want to understand what the data model is and why it exists before filling it in._

## Overview

The data model is configured across seven tables in Grist. They must be filled in a specific order because later tables depend on what earlier tables define: you cannot reference an anchor in Anchor_attributes before defining it in Anchors, and you cannot define a link in Link_attributes before defining it in Links.

Work through the tables in this order:

1. **Anchors** — the entity types in your domain
2. **Anchor_attributes** — properties on those entities
3. **Links** — relationships between entities
4. **Link_attributes** — properties on those relationships
5. **Queries** — retrieval strategies the assistant follows
6. **ConversationLifecycle** — system messages at lifecycle events
7. **Prompts** — the system prompt and other templates

After completing all tables, go to Backoffice, click **Reload Data Model** and then run ETL. Verification steps are at the end of this guide.

## 1. Anchors

Go to **Grist → Data Model → Anchors**. Each row defines one entity type. Fill in four fields per row.

**Noun** — the entity name: singular, English. This becomes the node label in Memgraph. Use `Product`, not `Products` or `product`.

**Description** — a plain-language explanation of what this entity represents, written for the assistant. Include what data the entity contains and when the assistant should query it. This field is included in the LLM context and directly affects whether the assistant selects the right entity type for a given question.

**ID example** — a real primary key value from your data, formatted exactly as it appears in the source table. For example: `product_id: "p-001"` or `branch_id: "branch-vilnius-01"`. The assistant uses this to construct correct Cypher queries at runtime.

**Query** — the Cypher query used to retrieve nodes of this type from Memgraph. A minimal example:

```cypher
MATCH (p:Product)
WHERE p.product_id = $id
RETURN p
```

Verify the query works in Memgraph Lab before moving on. An anchor without a valid query cannot be retrieved deterministically.

For detailed guidance and common mistakes: [How to Define Anchors].

## 2. Anchor_attributes

Go to **Grist → Data Model → Anchor_attributes**. Each row defines one property on one anchor type. Go through each anchor's source data table in Grist and add a row for every column users might ask about.

|Field|What to enter|
|---|---|
|**attribute_name**|Lowercase, no spaces. Must match the column name in the data table exactly.|
|**description**|Plain-language explanation for the assistant. Include units, valid range, or format if relevant.|
|**anchor**|The anchor type this property belongs to. Must already exist in the Anchors table.|
|**data_example**|A real value from your data — e.g. `999.00`, `"Vilnius"`, `true`.|
|**embeddable**|`true` for human-readable text that users might search by meaning (names, descriptions). `false` for IDs, numbers, dates, and flags.|
|**embed_threshold**|Similarity score cutoff for semantic search on this field. Start at `0.75` and tune after evaluation. Only applies when embeddable is true.|
|**query**|Cypher query to retrieve this attribute. Required for any property the assistant should be able to return directly.|
|**dtype**|Must match the actual type stored in Grist: `str`, `int`, `float`, `bool`, `date`, `datetime`, `enum`, `url`, or `file`.|

The dtype and query fields are the most common source of errors. Check your actual data before setting dtype — numbers stored as strings in Grist must be declared as `str`, not `float`. An empty query field means the attribute is visible to the assistant in context but not reliably retrievable from the graph.

**The Link flag.** If a column contains a foreign key reference to another anchor — for example, a `category_id` column on a products table — set the **Link** flag to `true`. This tells ETL to create a graph edge using this column rather than storing the value as a plain string property. You will also need a corresponding row in the Links table.

For detailed guidance: [How to Define Attributes].

## 3. Links

Go to **Grist → Data Model → Links**. Each row defines one relationship type between two anchor types. Both anchor types must already be defined in the Anchors table.

|Field|What to enter|
|---|---|
|**Anchor1**|The source entity type.|
|**Anchor2**|The target entity type.|
|**Sentence**|The edge label in Memgraph — a verb phrase in snake_case, e.g. `belongs_to`, `available_at`, `signed_with`. This is what Cypher queries use.|
|**Description**|One sentence explaining what the relationship means, written for the assistant.|
|**Query**|Cypher query to traverse this relationship. Required for multi-hop reasoning to work.|
|**anchor1_link_column_name**|The column in the Anchor1 data table that holds the foreign key reference.|
|**anchor2_link_column_name**|The matching primary key column in the Anchor2 data table.|
|**has_direction**|`true` for directional relationships, which is most of them.|

The Query field is critical. Without a traversal query, the assistant knows the relationship exists but cannot follow it. A traversal query for `Product → belongs_to → Category`:

```cypher
MATCH (p:Product)-[:belongs_to]->(c:Category)
WHERE p.product_id = $id
RETURN c.category_id, c.name
```

If users will ask questions that traverse this relationship in both directions — "which products are in this category?" as well as "which category does this product belong to?" — define both directions as separate rows in the Links table.

Avoid generic edge labels like `related_to` or `has`. The assistant uses the edge label and description to decide when to traverse a relationship. Generic labels give it nothing to work with.

For detailed guidance: [How to Define Links].

## 4. Link_attributes

Go to **Grist → Data Model → Link_attributes**. Use this table when a relationship itself carries data — not just the fact that two nodes are connected, but properties of the connection. The columns are identical to Anchor_attributes, with one difference: the **link** field references a relationship from the Links table rather than an anchor.

Skip this table entirely if your relationships carry no properties. Most simple models do not need it.

Use link attributes when the same value could differ depending on which specific relationship is being described. For example, a `role` on a `PERSON_assigned_to_PROJECT` edge — the same person can have different roles on different projects, so the role belongs to the edge, not to either node.

|Field|What to enter|
|---|---|
|**attribute_name**|Lowercase, no spaces. Matches the column name in the relationship data table.|
|**description**|What this property represents, written for the assistant.|
|**link**|The link this attribute belongs to. Must already exist in the Links table.|
|**data_example**, **embeddable**, **embed_threshold**, **query**, **dtype**|Same rules as Anchor_attributes.|

The Cypher query for a link attribute must access the edge property using the relationship variable, not the node variable:

```cypher
MATCH (p:Person)-[r:PERSON_assigned_to_PROJECT]->(proj:Project)
WHERE p.person_id = $id
RETURN proj.project_name, r.role, r.start_date
```

Note `r.role` — the `r` variable is the relationship, not `p` or `proj`.

## 5. Queries

Go to **Grist → Data Model → Queries**. This table is the playbook — it defines the retrieval strategies the assistant follows for specific types of user questions. Each row is one intent: a question type and the step-by-step instructions for how to answer it.

The table has two columns.

**query_name** — identifies the question type this strategy covers. You can write it as a natural language description or a short identifier — both work. What matters is that it is specific enough to be unambiguous.

|Style|Example|
|---|---|
|Natural language|`If the user asks about legislation`|
|Short identifier|`law_vs_practice`|
|Question pattern|`Which compliance documents are required for a product?`|

**query_example** — the instructions the assistant follows when this intent is matched. This is the most consequential field in the data model. Write it as numbered steps, each specifying exactly which tool to call, with what parameters, and what to do with the result.

### Tool syntax

Two tools are available:

**`vts()`** — vector text search. Searches embeddable fields by semantic similarity.

```
vts(anchor = '<anchor_name>', label = '<property_name>')
```

**`cypher()`** — structured graph query. Runs a Cypher statement against Memgraph.

```
cypher(query = 'MATCH ...')
```

### Real examples

The following examples are from a legal compliance assistant. They show what well-formed query examples look like in practice.

**Example 1 — vector search across two anchor types, formatted output**

_query_name:_ `If the user asks about legislation`

_query_example:_

```
1) run vts(anchor = 'document_chunk', label = 'document_chunk_text');
2) run vts(anchor = 'faq', label = 'faq_answer_text');
3) provide the answer as:
   'Legally: ...,   // document_chunk_text answer
    Practically: ...'. // faq answer
```

This pattern is useful when two different retrieval sources produce complementary answers — one gives the formal/technical response, the other gives a practical or simplified one — and you want both presented together in a structured format.

**Example 2 — vector search to identify a node, then Cypher traversal**

_query_name:_ `If the user asks which compliance documents are required for a product`

_query_example:_

```
1) run vts(anchor = 'cpa', label = 'code_name') to identify the CPA code;
2) run cypher(query = 'MATCH (c:cpa {code_number: ...})-[:requires]->(d:compliance_document)
   RETURN d.compliance_document_name');
3) present the list of compliance documents in the answer.
```

This is the hybrid retrieval pattern: use `vts()` to find a node by semantic similarity, extract its ID, then use `cypher()` to traverse the graph from that node and return exactly what is needed. This combination handles questions where the user provides a descriptive term (a product name, a category description) but the graph stores structured identifiers.

### What every query_example should specify

- Which tool to call first, and with what parameters
- What to extract from that result (an ID, a name, a list)
- Whether to call a second tool, and how to use the first result as input to it
- How to format the final response — what to include, how to label it, and what to say if no results are found

The assistant follows these instructions literally. The more precise the steps, the more predictable the behavior. Abstract descriptions of the desired outcome ("find the relevant documents and return them") are not sufficient — they leave the assistant to make arbitrary decisions about tool selection and output format.

Start with one row per major question type your users will ask. Add more as you identify gaps during evaluation.

## 6. ConversationLifecycle

Go to **Grist → Data Model → ConversationLifecycle**. This table starts empty — there are no pre-filled rows. Add one row per event you want to handle. It has two columns:

**event** — the name of the lifecycle event. Common events:

|Event|When it fires|
|---|---|
|`conversation_start`|At the beginning of a new conversation|
|`fallback`|When no retrieval result is found for a question|
|`session_end`|When the conversation ends or times out|

**text** — the message or instruction to inject when the event fires. For `conversation_start`, this is typically a greeting that introduces the assistant and tells the user what it can help with. For `fallback`, it is the response the assistant gives when it cannot find an answer.

Write the `conversation_start` text in the voice and tone you want the assistant to use throughout. It sets the register for the conversation. Keep it brief — one or two sentences is enough.

Write the `fallback` text carefully. Users who hit a fallback are already not finding what they need. A good fallback acknowledges this, avoids a generic "I don't know", and either suggests a rephrasing or directs the user to another resource.

Weak fallback: _"I don't have information about that."_
Good fallback: _"I couldn't find a specific answer to that in the knowledge base. Try rephrasing your question, or contact support at support@example.com."_ 

ConversationLifecycle rows are optional. If a table row for a given event is missing, no message is injected at that event. For a first deployment, at minimum add a `conversation_start` greeting and a `fallback` response.

## 7. Prompts

Go to **Grist → Data Model → Prompts**. This table also starts empty. Add one row per named prompt template your system needs. It has two columns: **name** (a unique identifier) and **text** (the full prompt content).

Two prompts are used by the system and must be added manually:

### system_prompt

The system prompt controls the assistant's overall behavior: its tone, the scope of what it will and will not answer, how it formats responses, and any domain-specific rules it should follow.

The default system prompt is functional, but for any production deployment it should be customized. Consider specifying:

- **Domain scope** — what the assistant is for and what it should decline to answer outside that scope. A product catalog assistant should not attempt to answer general knowledge questions.
- **Tone and register** — formal or conversational, technical or plain language, first-person or third-person.
- **Response format** — should answers include bullet points, prose, tables? Should sources always be cited?
- **Fallback behavior** — what the assistant should say when it genuinely does not know the answer, separate from the ConversationLifecycle fallback event.
- **Language** — if your users interact in a language other than English, specify it here.

A minimal system prompt template:

```
You are an assistant for [company/product name]. Your role is to help users with [scope].

Answer only questions related to [domain]. For anything outside this scope, say that you can only help with [domain] questions and suggest the user contacts [support channel].

When answering:
- Use only information retrieved from the tools. Do not invent facts.
- Cite the source of your answer when one is available.
- If you cannot find an answer, say so clearly — do not guess.

Respond in [language]. Use a [formal/conversational] tone.
```

### eval_judge_prompt

The eval judge prompt is used during evaluation runs. It instructs the model that scores each response against the golden dataset — telling it how to compare the assistant's answer to the expected answer and what to return.

The default eval judge prompt works for most use cases. Customize it only if you have domain-specific scoring requirements — for example, if partial matches should count as passes, or if the scoring should be case-insensitive.

The prompt must instruct the judge to return a JSON object. The default structure expected by the evaluation pipeline:

```json
{
  "pass": true,
  "reason": "All expected names were present in the response."
}
```

Do not modify the output structure unless you have also modified the evaluation pipeline to match.

## Applying the Data Model

Once all tables are filled in:

1. Open the Backoffice at `http://localhost:8000`, click **Reload Data Model** in Grist. This loads the current state of all seven tables into the system. **Skipping this step means none of your changes will be applied during ETL.**
2. Navigate to the ETL section, and run the pipeline.
3. Wait for all ETL steps to complete: data model load, data load, and embedding generation.

## Verifying the Result

After ETL completes, run a few checks in Memgraph Lab at `http://localhost:3000` before testing the chat endpoint.

**Check that anchor nodes were created:**

```cypher
MATCH (n)
RETURN labels(n) AS type, count(n) AS total
ORDER BY total DESC
```

Confirm that each anchor type you defined appears in the results, and that the count matches the number of rows in the corresponding Grist data table.

**Check that a specific node has the right properties:**

```cypher
MATCH (p:Product {product_id: "p-001"})
RETURN p
```

Confirm that all declared attributes appear as properties on the node with the expected values and types.

**Check that links were created:**

```cypher
MATCH (a)-[r]->(b)
RETURN type(r) AS relationship, count(r) AS total
ORDER BY total DESC
```

Confirm that each relationship type you defined appears in the results.

If any anchor type is missing or has zero nodes, check the ETL logs for validation errors. The most common causes are a column name mismatch between the Attributes table and the data table, a dtype mismatch, or a missing primary key on one or more rows.

If links are missing, verify that `anchor1_link_column_name` matches the exact column name in the source data table and that the foreign key values in that column match actual primary keys in the target anchor's data.

Once the graph structure looks correct, open the Backoffice Chat section and run a few test questions against the chat endpoint to confirm the assistant is retrieving and formatting answers as expected.
