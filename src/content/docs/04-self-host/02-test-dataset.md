---
Title: "Example Dataset"
---

## Testing Vedana with the Example Dataset

The LIMIT dataset is a sample dataset prepared by our team to help you run an end-to-end test of Vedana without needing to prepare your own domain data first.
It is based on the [LIMIT benchmark](https://github.com/google-deepmind/limit) published by Google DeepMind, which is designed to stress-test retrieval systems by exposing the theoretical limitations of single-vector embedding models. 
We converted it into Grist-ready tables so you can load it into Vedana without any manual transformation.

For a first test run, use the **limit-small** version. 
It contains only the 46 documents relevant to the queries, which is sufficient to validate the full pipeline without the overhead of ingesting the full 50k document corpus.

## What the Dataset Contains

The original LIMIT benchmark follows the MTEB format and consists of three files – a corpus of documents, a set of 1000 queries, and a relevance mapping (`qrels`) linking each query to its correct document. 
Our team has transformed these into three Grist files:

- **Data** – the 46 corpus documents (limit-small), pre-loaded as a document_chunks table and ready for ETL.
- **Data Model** – a pre-configured data model declaring the anchors, attributes, and links required to ingest the corpus into Memgraph.
- **Golden Dataset** – the queries and qrels combined into a question/expected-answer table, ready to use as the evaluation benchmark.

## How to Use It

1. Import the Grist tables. [Download](https://vedana-limit.getgrist.com/ws/196656/) the pre-built Grist tables. Import them into your running Grist instance at http://localhost:8484. The tables are already structured to match Vedana's default data model – no column mapping or transformation is needed.
2. Reload Data Model in Backoffice.
3. Go to ETL section of Backoffice and run ETL by clicking **'Run Selected'**.

## What to Expect

Because LIMIT is specifically designed to expose the failure modes of embedding-based retrieval, a system relying on vector search alone will perform poorly on a meaningful portion of the queries. This is by design. Vedana's graph-based retrieval is not subject to the same theoretical constraints, so a healthy hit rate on this dataset is a good early signal that the stack is configured correctly and retrieval is working as intended.

If hit rate is unexpectedly low on structurally simple queries – where the answer maps directly to an ingested document – treat it as an ETL or data model issue rather than a retrieval limitation, and refer to the evaluation guidance in the Golden Dataset chapter.
