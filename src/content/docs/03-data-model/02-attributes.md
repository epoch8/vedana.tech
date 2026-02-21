---
title: "Attributes"
---

## What Is an Attribute

An **attribute** is a typed property attached to an anchor (or, in some cases, a link).

If anchors define _what exists_,  
attributes define _what we know about it_.

Examples:

For anchor `Product`:

- name (string)
    
- price (float)
    
- currency (string)
    
- category (string or link)
    
- in_stock (boolean)
    

For anchor `Branch`:

- address (string)
    
- city (string)
    
- opening_hours (string or structured)
    

Attributes enable precise filtering and deterministic answers.

---

# Where Attributes Are Defined

Attributes are defined in Grist inside the **data-model** document.

There is a table responsible for attribute schema definitions  
(often named something like `attributes`).

This table defines schema, not actual data values.

Actual attribute values live in business tables (e.g., `products`, `branches`).

During ETL:

1. Attribute schema is loaded
    
2. Types are validated
    
3. Rows are checked against schema
    
4. Properties are written to Memgraph nodes
    

---

# How to Describe an Attribute

Each attribute definition typically includes:

- anchor_name (which anchor it belongs to)
    
- attribute_name
    
- data_type
    
- description
    
- optional flags (filterable, searchable, embeddable)
    

Attributes must always belong to an anchor type.

---

# Supported Data Types (Conceptual)

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

---

# Example Attribute Definition

Example: Product.price

Attribute definition row in data-model:

- anchor_name: Product
    
- attribute_name: price
    
- data_type: float
    
- description: "Retail price of the product in default currency"
    

After ETL, a graph node may look like:

(:Product { product_id: "123", name: "Laptop", price: 999.0 })

Now Cypher queries can filter:

MATCH (p:Product)  
WHERE p.price < 1000  
RETURN p

This is not possible with document chunks alone.

---

# Attribute vs Link

Not everything should be an attribute.

Use attribute when:

- Value is scalar
    
- No separate lifecycle is required
    
- No relationships originate from it
    

Use link when:

- The value is another entity
    
- It has its own attributes
    
- It participates in relationships
    

Example:

- Product.category as string → attribute
    
- Product → belongs_to → Category → anchor
    

Second option enables richer graph traversal.

---

# How Attributes Affect LLM Behavior

Attribute definitions are included in the LLM context.

The LLM sees:

- Which properties exist
    
- What their types are
    
- What they mean
    

This allows the LLM to:

- Generate correct Cypher filters
    
- Apply numeric comparisons
    
- Avoid inventing nonexistent fields
    

If attributes are not defined in the data model,  
LLM cannot reliably query them.

---

# Best Practices

- Keep attribute names consistent and lowercase
    
- Avoid spaces in attribute names
    
- Use explicit data types
    
- Avoid storing multiple values in one field (no comma-separated lists)
    
- Normalize data where appropriate
    

Clean attribute modeling directly improves answer precision.

---

# Common Mistakes

- Storing numbers as strings
    
- Mixing currencies in one column without explicit currency field
    
- Using free-text columns where structured enums are better
    
- Forgetting to define attribute in data-model before ingestion
    

These mistakes reduce determinism.

---

# Summary

Attributes define structured properties of anchors.

They live in the data-model document in Grist.  
They are validated during ETL.  
They become properties on graph nodes.

Attributes enable precise filtering and deterministic answers.

Without well-defined attributes,  
Vedana behaves like basic RAG.  
With them, it becomes a structured knowledge engine.