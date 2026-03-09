---
title: "Data for Vedana"
---

## Core Principle

Vedana is a question-answering system that understands your data rather than guessing from it.
Most RAG systems work by finding text that looks similar to a question and asking an LLM to produce an answer from it. 
Vedana works differently. It stores your domain knowledge as a structured graph and answers questions by navigating that graph directly. This means it can count, filter, follow relationships across multiple steps, and show exactly where every answer came from.

The system has four parts that work together: the **data** itself, a **data model** that describes what exists and how things relate, **tools** that query the graph, and an **assistant** that knows which tool to use for which question. 

<img src="/images/vedana_arch.png" alt="Hero" width="800" class="center-image" />

All domain data in Vedana lives in Memgraph not as a flat collection of text chunks used for vector search, but as a structured knowledge graph. 

This means:

- Data is stored as anchors (nodes).
- Relationships are stored as links (edges).
- Attributes are stored as typed properties.
- Embeddings are optional and secondary.

Because retrieval is not limited to vector search, you can:

- Run Cypher queries. 
- Traverse relationships.
- Filter by structured attributes.
- Combine structure + vector search.

<img src="/images/Screenshot%202026-02-19%20at%2008.10.03.png" alt="Hero" width="800" class="center-image" />

Vedana is graph-first, not embedding-first. 
Embeddings are supported and used where they are the right tool. But the foundation is structure. Without a properly defined data model, Vedana behaves like an advanced RAG system. With one, it becomes a domain knowledge engine capable of reasoning over your data the way a structured query language reasons over a database: precisely, transparently, and on demand.

The data model defines the structure, but the data itself determines the quality of answers. A well-designed model with incomplete, outdated, or poorly structured data will still produce wrong answers. The graph is only as reliable as what has been put into it, which means data quality, coverage, and freshness matter as much as the model that describes it.
The practical result is a system whose behavior is determined by structure you define, not by probability. If your data model is well-built and your data is accurate and complete, Vedana can answer complex domain questions consistently and reliably.

This is why the quality of data is crucial.
The better your data is, the better assistan't performance.

## Where Data Comes From

There are two primary ingestion paths:

| Path | Best for |
|---|---|
| Grist-based ingestion | Manual entry, moderate-scale datasets |
| Custom ETL → Memgraph | Large-scale, automated pipelines |

### 1. Grist

Grist is the default data control layer in Vedana. 
Grist is used as a structured data control layer.
It acts as a:
- Schema-aware interface.
- Collaborative data entry tool.
- Configuration storage system.
- Staging layer for ETL.

You write to Grist. And Vedana ETL then transforms Grist tables into graph structures and saves it in Memgraph:

```
Data → Grist → ETL → Memgraph
```

#### What Can Be Uploaded via Grist

There are two types of data you can add to Vedana through Grist: documents and structured data.

##### A. Documents and Document Chunks

Unstructured documents can be uploaded.

**Typical workflow:**
1. Document is uploaded.
2. Document is split into chunks.
3. Each chunk becomes an anchor.
4. Chunks may receive embeddings.
5. Chunks may link to parent document.

Use cases: policies, contracts, knowledge base articles, manuals, etc.
    
Chunks are graph entities, not just text blobs.

##### B. Structured Data (CSV/Excel)

Structured data can be uploaded as tables in Grist.

Examples: product catalogs, legal mappings, compliance matrices, requirements tables.
    
Each row becomes an anchor or part of an anchor definition
Relationships between tables become graph links.

Structured ingestion enables:
- Cypher filtering
- Deterministic traversal
- Attribute-level querying

#### Data Model Enforcement

Data from Grist is automatically synchronized with Memgraph (the graph database) once per day. 
But data model can be updated manually as well.

Before updating the data model:
- Anchor types must be defined
- Link types must be defined
- Attribute schema must exist

ETL validates data against schema.
Invalid schema = ingestion failure.

#### Adding new Data to Grist

Depending on what you are adding, follow one of the two paths below.

**Adding rows to an existing table:**
1. Add new rows to the table.
2. Fill in the required attributes.
3. Link them to existing data as needed.

<img src="/images/Screenshot%202025-10-26%20at%2023.14.15.png" alt="Hero" width="800" class="center-image" />

4. Update the Data Model.
   
**Creating a new table:**
1. Create the table in Grist and load your data into it.
2. Go to the Data Model section and define the structure: declare the anchor type, its attributes, and any links to other anchors.
3. Update Data Model.

### 2. Custom ETL (Direct to Memgraph)

For large datasets or automated pipelines, data can be loaded directly into Memgraph.
This is recommended when:
- Data volume is high.
- External systems generate data.
- Near real-time updates are required.

Custom ETL can generate anchors and links, attach attributes and compute embeddings.
But ETL must still respect the defined data model.

Direct graph writes must preserve invariants:
- No orphan links.
- No missing primary keys.
- No schema mutation.

## Vector Search vs Graph Query

Vedana supports hybrid retrieval, meaning it can combine two fundamentally different ways of finding information depending on what the question requires. The assistant decides which tool to use based on the question and the rules defined in the playbook. 

### Vector Search

In Vedana, embeddings are stored directly inside Memgraph alongside the graph structure. 
Vector search is used for:
- Semantic similarity
- Textual relevance
- Chunk retrieval

Vector search is the right tool when the answer is somewhere in a document and the question is open-ended or descriptive in nature.

### Cypher Queries

Unlike vector search, which finds things that look related, Cypher queries follow explicitly defined relationships and return results that are exact and verifiable.
Cypher queries are used when the question requires:
- Structural reasoning
- Relationship traversal
- Attribute filtering
- Deterministic domain queries

<img src="/images/Memgraph.png" alt="Hero" width="800" class="center-image" />
    
Example use cases:

- "Which requirements apply to this product?"
- "Which documents regulate this category?"
- "Which departments own this policy?"
    
These cannot be answered reliably with vector search because they depend on relationships that must be traversed, not text that must be matched. A similarity search might return something plausible, but it cannot guarantee completeness or correctness the way a graph query can.

## Data Storage Guarantees

A few properties of Vedana's storage layer are worth understanding clearly:
- The graph is persistent. Data written to Memgraph stays there until explicitly changed or removed.
- Embeddings are optional — they enhance retrieval for text-heavy questions but are not required for the system to function.
- Structure is mandatory. Without defined anchors, attributes, and links, there is nothing for the tools to reason over.
- Graph queries are deterministic. The same Cypher query run against the same data will always return the same result.

The practical consequence of these properties is straightforward: if you load only documents without any structured model, Vedana behaves like a basic RAG system — useful, but limited to text retrieval. 
If you model your domain correctly with anchors, attributes, and links, Vedana becomes a domain knowledge engine capable of precise, verifiable, relationship-driven answers.

## Recommended Strategy 

For most deployments:

1. Define the data model in Grist — anchors, attributes, and links.
2. Upload structured data via Grist.
3. Upload documents.
4. Update Data Model.
5. Validate the graph by running Cypher queries to confirm the structure looks correct.
6. Enable pipelines and make the assistant available.

For large enterprises:

- Use Grist for schema definition and configuration management.
- Use automated ETL pipelines for bulk data ingestion.
