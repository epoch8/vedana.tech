---
title: "Adding Structured Data"
---

## Why Structured Data Matters

Using document chunks is a good starting point.

However, chunk-based retrieval has limits.

If you need precise, deterministic answers, your data must be structured.

Vector search works well for:

- Explanations
    
- Policies
    
- Long-form documents
    

But it is not reliable for:

- Exact prices
    
- Opening hours
    
- Contract dates
    
- Numeric comparisons
    
- Multi-attribute filtering
    

For those cases, structured modeling is required.

---

## When You Should Add Structured Data

You should structure data when working with:

- Products and product properties
    
- Price lists
    
- Opening hours
    
- Branch addresses and locations
    
- Contracts and effective dates
    
- Regulatory mappings
    
- Inventory data
    
- Service catalogs
    

Any domain where attributes matter should be structured.

If a user might ask:

- "Which products cost less than 500?"
    
- "What time does the Moscow branch close on Sunday?"
    
- "Which contracts expire this month?"
    

You need structured anchors and attributes.

---

## Option 1 – Upload Existing Tables

Often structured data already exists in:

- Excel files
    
- CSV exports
    
- ERP exports
    
- Internal reporting tables
    

These can be uploaded into Grist directly.

Before uploading, ensure:

- Columns are clean and not merged
    
- No multi-row headers
    
- No mixed data types in a single column
    
- No visually formatted cells replacing real structure
    

Bad formatting leads to broken ingestion.

Grist expects real tabular structure.

Each row should represent one entity.

---

## Mapping Tables to Anchors

When uploading structured tables, you must decide:

- What is an anchor type?
    
- What is an attribute?
    
- What is a link?
    

Example:

Table: products

Columns:

- product_id
    
- name
    
- price
    
- category
    

This becomes:

Anchor: Product  
Attributes:

- name (string)
    
- price (float)  
    Link:
    
- Product → belongs_to → Category
    

Data model must be updated accordingly.

---

## Option 2 – Extract Structure from Text

Sometimes structured data is hidden inside documents.

Example:

- Price tables in PDF
    
- Contract terms in text
    
- Address lists in policies
    

In this case:

1. Extract text
    
2. Identify structured elements
    
3. Convert them into tabular format
    
4. Upload into Grist
    
5. Update data model
    

This hybrid approach improves accuracy dramatically.

---

## Structured vs Unstructured Strategy

Best practice:

- Keep explanatory content as document chunks
    
- Extract measurable attributes into structured anchors
    

For example:

Contract document:

- Keep full contract text in document_chunks
    
- Extract:
    
    - contract_id
        
    - start_date
        
    - end_date
        
    - counterparty
        

Store those as structured anchors.

Now you can:

- Answer "When does this contract expire?" deterministically
    
- Still retrieve contract explanation text
    

---

## Benefits of Structured Data

With structured modeling, Vedana can:

- Use Cypher for exact filtering
    
- Perform multi-hop traversal
    
- Combine numeric comparisons
    
- Guarantee attribute correctness
    

This is not possible with pure vector search.

---

## Summary

Chunk-based RAG is good for reading.  
Structured modeling is required for reasoning.

If answers must be exact, data must be structured.

You can:

- Upload existing clean tables
    
- Extract structure from text
    
- Combine both approaches
    

The more structured your domain model is,  
the more deterministic Vedana becomes.