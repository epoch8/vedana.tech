---
title: "Anchors"
---

## What Is an Anchor

An **anchor** is a core entity type in the Vedana data model.

It represents a real-world or logical object that exists in your domain.

Examples:

- Product
    
- Branch
    
- Contract
    
- Department
    
- PriceList
    
- Service
    

In the graph database (Memgraph), each anchor type corresponds to a class of nodes.

Anchors define _what exists_ in your system.

Without anchors, there is no structure.

---

# Where Anchors Are Defined

Anchors are defined in Grist inside the **data-model** document.

Specifically, they live in the table responsible for anchor type definitions  
(commonly named something like `anchors` or similar depending on your setup).

This table does not contain actual data.  
It contains **schema definitions**.

During ETL:

1. Anchor definitions are loaded
    
2. Schema rules are validated
    
3. Data rows are mapped to anchor types
    
4. Nodes are created in Memgraph
    

---

# How to Describe an Anchor

Each anchor definition typically includes:

- anchor_name (unique identifier of the type)
    
- primary_key_field (which attribute uniquely identifies it)
    
- description (human-readable explanation)
    
- optional flags (searchable, embeddable, etc.)
    

The primary key must:

- Be unique per entity
    
- Be stable over time
    
- Not depend on row order
    

---

# Required Fields for an Anchor Definition

Minimum recommended fields:

1. **name** – internal anchor type name (e.g., `Product`)
    
2. **table_name** – source table in Grist
    
3. **primary_key** – column used as unique ID
    
4. **description** – explanation for LLM context
    

Optional fields may include:

- embeddable (boolean)
    
- searchable (boolean)
    
- visible_in_tools (boolean)
    

Exact schema may evolve, but these concepts remain stable.

---

# Example Anchor Definition

Example: Product

Anchor definition row in data-model:

- name: Product
    
- table_name: products
    
- primary_key: product_id
    
- description: "Represents a sellable product with price and category."
    

After ETL:

Each row in `products` table becomes:

(:Product { product_id: "123", name: "Laptop", price: 999.0 })

---

# What Anchors Are NOT

Anchors are not:

- Free text
    
- Document chunks (those are a specific anchor type)
    
- Temporary runtime objects
    
- Prompt instructions
    

Anchors represent stable domain entities.

---

# How Anchors Affect LLM Behavior

Anchor definitions are included in LLM context.

The LLM sees:

- Which entity types exist
    
- How they are named
    
- What they represent
    

This allows the LLM to:

- Generate correct Cypher queries
    
- Select appropriate tools
    
- Understand domain vocabulary
    

If anchors are poorly defined,  
the LLM cannot reason correctly about the domain.

---

# Best Practices

- Use singular nouns (Product, not Products)
    
- Keep names clear and domain-aligned
    
- Avoid over-modeling too early
    
- Ensure primary keys are clean and consistent
    

Define anchors carefully.

They are the foundation of deterministic reasoning in Vedana.

---

# Summary

Anchors define the entity types in your domain.

They live in Grist inside the data-model document.  
They specify schema, not data.  
They are mapped to graph nodes during ETL.

A well-defined anchor layer is the foundation of the entire system.