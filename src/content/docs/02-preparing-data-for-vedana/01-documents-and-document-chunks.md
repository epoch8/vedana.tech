---
title: "Documents and Document Chunks"
---

## Overview

Vedana can work with any textual content.

The most basic ingestion strategy is:

1. Take any file
    
2. Split it into chunks
    
3. Upload metadata and chunks into Grist
    
4. Run ETL
    

After that, the data becomes searchable via vector search and usable in responses.

---

## What Files Can Be Used

Any file that can be converted to text can be ingested:

- PDF
    
- DOCX
    
- TXT
    
- Markdown
    
- HTML
    
- Exported Google Docs
    
- CSV (as text documents)
    

Vedana does not ingest raw binary formats directly.  
Files must be converted to text before chunking.

---

## Step 1 – Register Documents

In Grist, open the **documents** table.

For each file, create one row.

Typical fields:

- document_id (primary key)
    
- document_name
    
- document_type
    
- optional metadata (category, owner, etc.)
    

Each row represents one logical document.

---

## Step 2 – Create Document Chunks

Open the **document_chunks** table.

For each chunk:

- chunk_id (primary key)
    
- document_id (reference to documents table)
    
- chunk_text
    
- optional metadata (section, page number, etc.)
    

Each chunk becomes an anchor in the graph.

During ETL:

- Chunks are written to Memgraph
    
- Embeddings are generated
    
- Parent-child relationships are created
    

Chunking strategy affects retrieval quality.

Recommended:

- 300–800 tokens per chunk
    
- Overlap between chunks if context continuity is important
    

---

## How Answers Are Controlled

The behavior for answering document questions is defined in:

Grist → Data-model → Queries

This section defines:

- Which tool to use (vector search)
    
- How many chunks to retrieve
    
- How to format response
    
- Whether to include citations
    

This is part of the playbook layer.

The data model defines structure.  
The Queries section defines behavior.

---

## Runtime Flow for Documents

1. User asks question
    
2. Intent matches document-related query
    
3. Vector search retrieves top-N chunks
    
4. Chunks are passed to LLM
    
5. LLM formats grounded answer
    

If configured, chunk IDs or sources are included.

---

## Quality Considerations

Good results depend on:

- Clean text extraction
    
- Proper chunk size
    
- Relevant metadata
    
- Clear instructions in Queries
    

If documents are loaded but not chunked properly,  
retrieval quality degrades significantly.

---

## Scaling Document Ingestion

For large volumes of documents:

- Use automated chunking pipeline
    
- Batch upload to Grist
    
- Or bypass Grist and write via custom ETL directly to Memgraph
    

Custom ETL must:

- Create document anchors
    
- Create chunk anchors
    
- Generate embeddings
    
- Link chunks to documents
    

---

## About Google Drive / Google Docs ETL

In the open-source version of Vedana,  
there is no built-in ETL connector specifically for Google Drive or Google Docs.

To ingest from Google Drive / Docs you must:

1. Export documents via Google API
    
2. Convert to text
    
3. Chunk content
    
4. Upload to Grist or ingest via custom ETL
    

A custom connector can be implemented using:

- Google Drive API
    
- Google Docs API
    
- Custom ingestion pipeline
    

(See section: Custom ETL for Vedana)

---

## Summary

To prepare documents for Vedana:

- Register files in documents
    
- Split into chunks in document_chunks
    
- Configure answering logic in Data-model → Queries
    
- Run ETL
    

Documents become graph entities.  
Chunks become searchable knowledge units.

This is the minimal working ingestion path for document-based Q&A.
