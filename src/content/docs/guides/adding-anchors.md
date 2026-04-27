---
title: How to Define Anchors
section: "Guides"
---

_This guide assumes you understand what anchors are and how they work. If not, read [Data Model for Vedana] and [Anchors] first._

## Before You Start

Before opening Grist, answer these questions for each entity type you plan to model:

- What is the real-world object this anchor represents? Can you describe it in one clear sentence?
- What is the primary key — the field that uniquely and stably identifies each instance?
- Does this entity need to be queried independently, or is it always accessed through another entity?

If you cannot answer the first two questions clearly, the anchor definition will be vague, and vague definitions produce unreliable assistant behavior. It is better to start with fewer, well-defined anchors and extend the model later than to define many anchors with poor descriptions.

### Step 1 — Open the Anchors Table

Go to **Grist → Data Model → Anchors**. Each row in this table defines one anchor type. You will fill in four fields per row.

<img src="/images/anchors-1.png" alt="Hero" width="800" class="center-image" />

### Step 2 — Fill In the Noun

Write the entity name in singular English. This becomes the node label in Memgraph and the term the assistant uses to identify this entity type.

The noun must be unique across the entire data model. If your domain has both `SalesContract` and `SupplierContract`, model them as separate anchor types with distinct nouns — not as a single `Contract` anchor with a `type` attribute, unless the modeling decision is deliberate and documented.

### Step 3 — Write the Description

The description is included in the LLM context. Write it for the assistant, not for yourself. Assume the reader has no prior knowledge of your domain.

A good description answers three questions:

1. What is this entity?
2. What data does it contain?
3. When should the assistant query it?

**Weak description:**

> "Represents a product."

**Strong description:**

> "A product available for sale in the catalog. Each product has a name, price, currency, category, and availability status. Use this anchor to answer questions about specific products, their prices, stock levels, or category membership."

The extra detail costs you thirty seconds to write and directly improves how correctly the assistant selects and queries this anchor type.

### Step 4 — Add an ID Example

Write a real primary key value from your data. This is not a placeholder — use an actual value from your dataset.

Examples:

- `product_id: "p-001"`
- `branch_id: "branch-vilnius-01"`
- `contract_id: "CNT-2024-0042"`

The ID example shows the assistant what a valid identifier looks like for this entity type. It uses this when constructing Cypher queries at runtime. If the example does not match the actual format of your primary keys, the assistant will generate queries that fail or return empty results.

### Step 5 — Write the Cypher Query

The query field contains the Cypher statement used to retrieve nodes of this type from Memgraph. This is one of the most important fields in the anchor definition — without a valid query, the assistant cannot retrieve this entity deterministically.

A minimal retrieval query for a Product anchor:

```cypher
MATCH (p:Product)
WHERE p.product_id = $id
RETURN p
```

A query that also returns related attributes:

```cypher
MATCH (p:Product)
WHERE p.product_id = $id
RETURN p.product_id, p.name, p.price, p.currency, p.in_stock
```

Write the query before running ETL and verify it works by running it manually in Memgraph Lab at `http://localhost:3000`. A query that returns no results or throws an error at definition time will behave the same way at runtime.

### Step 6 — Update the Data Model

After adding or editing anchor definitions, open the Backoffice at `http://localhost:8000` and click **Reload Data Model**. This step is required before ETL will pick up your changes. If you skip it, the new anchor definitions will not be applied.

### Step 7 — Run ETL and Verify

In the Backoffice, navigate to the ETL section, and run the pipeline. After ETL completes, verify that nodes were created correctly in Memgraph Lab:

```cypher
MATCH (n:Product)
RETURN count(n)
```

The count should match the number of rows in your source data table. If it is lower, check the ETL logs for validation errors — the most common causes are a type mismatch between a declared attribute and the actual data, or a missing primary key on one or more rows.

To inspect a specific node:

```cypher
MATCH (p:Product {product_id: "p-001"})
RETURN p
```

Confirm that all expected properties are present and their values look correct.

## Common Mistakes

**Using a vague or generic description.** Descriptions like "Represents a product" or "A contract entity" give the assistant almost no usable information. Write descriptions that specify what data the anchor contains and when to query it.

**Using unstable primary keys.** If your primary keys change between ingestion runs — sequential row numbers, auto-generated IDs that regenerate — the graph will accumulate duplicate or orphaned nodes over time. Use identifiers that are stable and meaningful: SKUs, contract numbers, branch codes.

**Defining anchors you don't yet need.** It is tempting to model the full domain upfront. Start with the anchors that are directly required to answer the questions your users will actually ask. Add more as the need becomes clear.

**Leaving the Query field empty.** An anchor without a Cypher query is defined but not queryable. The assistant will know the entity type exists but will not be able to retrieve it from the graph reliably. Always write and verify the query before running ETL.

**Plural or formatted nouns.** The Noun field must be singular and use PascalCase or a simple English word. Node labels in Memgraph are case-sensitive, and the assistant uses the noun exactly as written when generating queries.
