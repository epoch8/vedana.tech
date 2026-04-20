---
title: "Attributes"
---

## What Is an Attribute

An attribute is a typed property attached to an anchor. If anchors define what exists, attributes define what we know about it — the specific, queryable data that describes each entity.

Examples of attributes for a `Product` anchor:
- name (string)
- price (float)
- currency (string)
- category (string or link)
- in_stock (boolean)

For anchor `Branch`:
- address (string)
- city (string) 
- opening_hours (string or structured)

Attributes are what make precise filtering possible. Without them, Vedana behaves like basic RAG: it can retrieve documents that mention a product's price, but it cannot filter products by price. The difference between approximate retrieval and deterministic answers comes down to whether the relevant data is stored as a typed attribute.

## Where Attributes Are Defined

Attributes are defined in **Grist > Data Model > Attributes** table. 
Like the Anchors table, this table contains schema definitions, not actual data values. The actual values live in your business tables (e.g. `products`, `branches`). 
The Attributes table tells Vedana what those values are and how to use them.

During ETL:
1. Attribute schema is loaded.
2. Types are validated.
3. Rows are checked against schema.
4. Properties are written to Memgraph nodes.

## How to Describe an Attribute

Each attribute definition typically includes:
- anchor_name (which anchor it belongs to)
- attribute_name
- data_type 
- description  
- optional flags (filterable, searchable, embeddable) 

Attributes must always belong to an anchor type.

### Required Fields for an Attribute Definition

Each row in the Attributes table defines one attribute using the following fields:

|Field|Description|
|---|---|
|**Attribute Name**|System name of the attribute (lowercase, no spaces)|
|**Description**|Human-readable explanation of what this attribute represents — included in LLM context|
|**Anchor**|The entity this attribute belongs to|
|**Link**|Whether the field is a reference to another anchor rather than a scalar value|
|**Data example**|A real example value from your data|
|**Embeddable**|Whether the value can be vectorized and used in semantic search|
|**Query**|The query used to retrieve this attribute from the graph|
|**dtype**|Data type — `str`, `int`, `float`, `bool`, `url`, `file`, etc.|
|**embed_threshold**|Similarity threshold for returning results in semantic search|

The data type must match what is actually stored in your Grist tables. If a price is stored as a string but declared as a float, ETL will either fail or produce unpredictable results at query time.

## Supported Data Types (Conceptual)

Common attribute types include:
- string
- integer
- float
- boolean
- date   
- datetime 
- enum

The type must match the data stored in Grist tables.
If types are inconsistent, ETL may fail or produce unpredictable results.

## What Attributes Enable

Attribute definitions are included in the LLM context. The assistant sees which properties exist on each anchor, what their types are, and what they mean. This is what allows it to generate correct Cypher filters, apply numeric comparisons, and avoid inventing fields that do not exist.

**Example: Product.price**

Attribute definition row in data-model:

- anchor_name: Product
- attribute_name: price
- data_type: float
- description: "Retail price of the product in default currency"

After ETL, a graph node may look like:
```
(:Product { product_id: "123", name: "Laptop", price: 999.0 })
```
Now Cypher queries can filter:
```
MATCH (p:Product)  
WHERE p.price < 1000  
RETURN p
```

The Attributes table also controls which fields participate in semantic search (via the Embeddable flag), which fields are shown to the user in responses, and how anchors are correctly linked to document content and FAQs. 
This is not possible with document chunks alone.

# Attribute vs Link

Not every relationship should be modeled as an attribute. 

**Use attribute** when:

- Value is scalar (a number, a string, a date).
- No separate lifecycle is required.
- No relationships originate from it or no further structure attached to it.
    
**Use a link** when the value refers to another entity that has its own attributes or participates in other relationships.

For example, storing Product.category as a plain string attribute is simpler and works for basic filtering. Modeling Category as a separate anchor connected via a belongs_to link enables category-level filtering, hierarchy traversal, and multi-hop queries: 

- Product.category as string → attribute
- Product → belongs_to → Category → anchor

The right choice depends on how much your domain needs to reason about that value.
Second option enables richer graph traversal.

## How Attributes Affect LLM Behavior

Attribute definitions are included in the LLM context.
The LLM sees:
- Which properties exist
- What their types are
- What they mean

This allows the LLM to:
- Generate correct Cypher filters
- Apply numeric comparisons
- Avoid inventing nonexistent fields
    
If attributes are not defined in the data model, LLM cannot reliably query them.

## Best Practices

- Use lowercase attribute names with no spaces.
- Always declare an explicit data type — never leave it ambiguous.
- Avoid storing multiple values in a single field (no comma-separated lists).
- Do not store numbers as strings.
- Use enums rather than free text where values are finite and known.
- If mixing currencies or units, add an explicit field for the unit alongside the value.

Clean attribute modeling directly improves answer precision. Poorly typed or inconsistently structured attributes are one of the most common causes of unreliable answers in Vedana.
