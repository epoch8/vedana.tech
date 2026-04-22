---
title: "Example Dataset"
section: "Quick Start"
order: 4
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

- **Data** – the 46 corpus documents (limit-small), pre-loaded as tables and ready for ETL.
- **Data Model** – a pre-configured data model declaring the anchors, attributes, and links required to ingest the corpus into Memgraph.
- **Golden Dataset** – the queries and qrels combined into a question/expected-answer table, ready to use as the evaluation benchmark.

## The Data Structure 
### Data
The Data document contains three tables:
- **Anchor_person** – one row per person, with two columns: person_id (e.g. person:1) and person_name (e.g. Geneva Durben). 46 rows total.
- **Anchor_interest** – one row per interest, with two columns: interest_id (e.g. interest:1) and interest_name (e.g. Symphony, River Otters, Tapirs). Each interest is a distinct entity in the graph.
- **Link_person_has_interest** – one row per person-interest pair, with three columns: from_node_id (e.g. person:1), to_node_id (e.g. interest:1), and edge_label (always PERSON_has_INTEREST). This table encodes every relationship between a person and their interests.

### Data Model
The Data Model document contains seven tables:
- **Anchors** – defines the entity types in the domain. Each row declares one anchor type with a noun, a description, an id_example, and a query field containing the Cypher query used to retrieve that anchor type. In this dataset there are two anchors: person and interest.
- **Anchor_attributes** – four rows defining the properties of each anchor type. Each row has an attribute_name, a linked anchor, an optional description, a data_example, a query for retrieval, a dtype defining the data type of the value, an embeddable flag, and an embed_threshold for semantic search tuning. The person_id and interest_id are non-embeddable identifier fields. person_name and interest_name are both marked as embeddable, meaning their values are vectorized and available for semantic search.
- **Link_attributes** – defines additional properties on relationships. Follows the same structure as Anchor_attributes but applies to links rather than anchors. 
- **Links** – defines the relationships between anchor types. Each row declares one relationship: which two anchors it connects, the edge label used in the graph (sentence), a human-readable description, and the Cypher query used to traverse it. Additional columns allow specifying the link column names on each anchor and whether the relationship has a direction.
- **Queries** – defines named retrieval patterns that the assistant uses to answer specific question types. Each row has a query_name describing the intent and a query_example specifying the retrieval strategy, including which tools to use and in what order. In this dataset there is one query: *'Who likes < interest >?'*, which uses vector search to find the interest node and then Cypher to traverse the graph and return all connected persons.
- **ConversationLifecycle** – defines conversation-level event hooks. Each row maps an event to a text response triggered at that point in the conversation. 
- **Prompts** – stores named prompt templates used by the system. In this dataset there is one prompt, eval_judge_prompt, which instructs the model to compare its answer against a reference answer and return a JSON object indicating pass or fail based on whether all expected names are present in the response.

### Golden Dataset
The Golden Dataset document contains one table, gds, with two columns: gds_question and gds_answer. Each row is one evaluation pair. All questions follow the pattern 'Who likes < interest >?' and answers are comma-separated lists of person names. 

For example:

- Who likes Joshua Trees? → Dorathea Bastress, Geneva Durben
- Who likes Quokkas? → Geneva Durben, Pate Lindley
- Who likes Disco Music? → Geneva Durben, Shelvia Goike

The dataset covers all interests present in the corpus, making it a complete benchmark for the person-interest domain.

## How to Use It

1. Import the Grist tables. [Download](https://vedana-limit.getgrist.com/ws/196656/) the pre-built Grist tables. Import them into your running Grist instance at http://localhost:8484. The tables are already structured to match Vedana's default data model – no column mapping or transformation is needed.
2. Reload Data Model in Backoffice.
3. Go to ETL section of Backoffice and run ETL by clicking **'Run Selected'**.

## What to Expect

Because LIMIT is specifically designed to expose the failure modes of embedding-based retrieval, a system relying on vector search alone will perform poorly on a meaningful portion of the queries. This is by design. Vedana's graph-based retrieval is not subject to the same theoretical constraints, so a healthy hit rate on this dataset is a good early signal that the stack is configured correctly and retrieval is working as intended.

If hit rate is unexpectedly low on structurally simple queries – where the answer maps directly to an ingested document – treat it as an ETL or data model issue rather than a retrieval limitation, and refer to the evaluation guidance in the Golden Dataset chapter.
