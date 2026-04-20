---
title: "Anchors"
---

## What Is an Anchor

An **anchor** is a core entity type in the Vedana data model. It represents a real-world or logical object in your domain, the things your system knows about and can reason over.

Examples:

- Product
- Branch
- Contract
- Department
- PriceList 
- Service
    
In Memgraph, each anchor type corresponds to a class of nodes. When you define a Product anchor and run ETL, every row in your products table becomes a typed node in the graph. Anchors define what exists in your system. Without them, there is no structure for the assistant to navigate.

## Where Anchors Are Defined

Anchors are defined in Grist inside the data model document, in the Anchors table: **Grist > Data Model > Anchors**. 
This table does not contain actual data. It contains **schema definitions**. 

Each row describes one type of entity that the assistant can recognize and retrieve from the knowledge graph.

During ETL:
1. Anchor definitions are loaded.
2. Schema rules are validated.
3. Data rows are mapped to anchor types.
4. Nodes are created in Memgraph.

## How to Describe an Anchor

Each anchor definition typically includes:

- anchor_name (unique identifier of the type)
- primary_key_field (which attribute uniquely identifies it)
- description (human-readable explanation)
- optional flags (searchable, embeddable, etc.)
    
The primary key must be unique per entity, stable over time, and independent of row order. 
If primary keys are inconsistent or change between ingestion runs, the graph will produce duplicate or orphaned nodes.

### Required Fields of Anchor Definition

Each row in the Anchors table describes one anchor type using the following fields:

|Field|What it contains|
|---|---|
|**Noun**|The entity name in English, singular, and unique across the data model (e.g. `Product`, `Branch`, `Contract`)|
|**Description**|A plain-language explanation of what this entity represents. This is included in the LLM context — the clearer and more specific it is, the better the assistant will understand when and how to use this anchor|
|**ID example**|A real example of a primary key value from your data (e.g. `product_id: "123"`). This helps the ETL process and the LLM understand what a valid identifier looks like for this entity type|
|**Query**|The Cypher query used to retrieve nodes of this type from Memgraph|

All four fields are required. An anchor definition with missing or vague entries will either fail during ETL or produce unreliable behavior at query time. Pay particular attention to the Description field – it is the primary way the assistant learns what an anchor represents and when to query it.

**Example:**

- Product anchor:

Noun: Product
Description: Represents a sellable product with a price and category.
ID example: product_id: "123"
Query: (Cypher query to retrieve Product nodes)

After ETL, each row in the products table in Grist becomes a node in Memgraph:

```
(:Product { product_id: "123", name: "Laptop", price: 999.0 })
```    

## What Anchors Are NOT

Anchors are stable schema definitions, not data. They are not free text, not prompt instructions, and not temporary runtime objects. Document chunks are a specific kind of anchor, but most anchors represent structured domain entities that exist independently of any document.

## How Anchors Affect LLM Behavior

Anchor definitions are included directly in the LLM context. The assistant sees which entity types exist, how they are named, and what they represent. This is what allows it to generate correct Cypher queries, select the right tools, and understand the vocabulary of your domain.

If anchors are poorly defined (vague descriptions, inconsistent naming, missing primary keys) the assistant cannot reason correctly about the domain. The quality of anchor definitions directly affects the quality of answers.

## Best Practices

- Use singular nouns – Product, not Products
- Keep names clear and aligned with your domain's own terminology
- Write descriptions that are specific enough for the LLM to understand the entity's role
- Ensure primary keys are clean, consistent, and stable across data updates
- Avoid over-modeling early – start with the entities you actually need and extend as requirements grow

Anchors are the foundation of deterministic reasoning in Vedana. Define them carefully.
