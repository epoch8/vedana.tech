---
title: "Documents and Document Chunks"
---

## Overview

Vedana can work with any textual content.  

The most basic ingestion strategy is:
1. Take any file.
2. Split it into chunks.
3. Upload metadata and chunks into Grist.
4. Run ETL.
    
After that, the data becomes searchable via vector search and usable in responses.

Good results depend on:

- Clean text extraction
- Proper chunk size
- Relevant metadata
- Clear instructions in Queries
    
If documents are loaded but not chunked properly, retrieval quality degrades significantly.

## What Files Can Be Used

Vedana works with text. Any document you want to make searchable must first exist as plain text that can be chunked and embedded. This means the format of the original file matters less than whether it can be reliably converted.

Any file that can be converted to text can be ingested:
- PDF
- DOCX
- TXT
- Markdown
- HTML
- Exported Google Docs 
- CSV (as text documents)
    
Raw binary formats (images, audio, video) cannot be ingested directly. If your source material is in one of these formats, it needs to be converted to plain text before it enters the ingestion pipeline. For most common formats this is straightforward, but the quality of the conversion affects the quality of retrieval downstream. Poorly extracted text produces poor chunks, and poor chunks produce poor answers.
When in doubt, review the extracted text before uploading. 

## Preparing Data

### Step 1 – Register Documents

In **Grist > Data**, open the **Documents** table.
For each file, create one row.

Typical fields:
- document_id (primary key)
- document_name
- document_type
- optional metadata relevant to your domain (category, owner, etc.)
    
Each row represents one logical document.

### Step 2 – Create Document Chunks

Open the **document_chunks** table and add one row per chunk. 
Each chunk row should include:
- chunk_id (primary key)
- document_id (reference to documents table)
- chunk_text
- optional metadata (section, page number, etc.)

Each chunk becomes an anchor in the graph.

During ETL, each chunk is written to Memgraph as an anchor, receives an embedding, and is linked back to its parent document.

Chunking strategy matters. Poor chunking degrades retrieval quality significantly. As a general guideline, aim for 300–800 tokens per chunk. If context continuity is important (for example, in long policy documents where meaning spans multiple paragraphs) add overlap between adjacent chunks.
Chunking strategy affects retrieval quality.

Documents become graph entities.Chunks become searchable knowledge units.
This is the minimal working ingestion path for document-based Q&A.

### Step 3 – Configure Assistant's Answering Behaviour

How Vedana responds to document-related questions is controlled in **Grist → Data Model → Queries**. 
This is where you define:
- Which tool to use (vector search, Cypher).
- How many chunks to retrieve.
- How to format response.
- Whether to include citations.

This is part of the playbook layer.
The data model defines the structure of your documents in the graph. The Queries section defines how the assistant uses that structure to answer questions. Both need to be configured for document Q&A to work correctly.

## Runtime Flow for Documents
When a user asks a document-related question, Vedana follows this sequence:

1. User asks question
2. Intent matches document-related query
3. Vector search retrieves top-N chunks
4. Chunks are passed to LLM
5. LLM formats grounded answer
6. If configured, chunk IDs or sources are included.

## Scaling Document Ingestion
For large document volumes, manual entry into Grist is not practical. In these cases:
- Use an automated chunking pipeline to process files in bulk.
- Batch upload chunk data to Grist, or bypass Grist entirely and write directly to Memgraph via custom ETL.

If using custom ETL, the pipeline must create document anchors, create chunk anchors, generate embeddings, and link each chunk to its parent document. The data model must be defined before the pipeline runs – the same rule applies as with Grist-based ingestion.

## About Google Drive / Google Docs ETL

The open-source version of Vedana does not include a built-in connector for Google Drive or Google Docs. 
To ingest content from either source, you need to:

- Export documents using the Google Drive API or Google Docs API.
- Convert the exported content to plain text.
- Chunk the text.
- Upload to Grist or ingest via custom ETL.

A custom connector can be built using Google's APIs and a standard ingestion pipeline. 
See [Custom ETL for Vedana] for implementation guidance.    
    
