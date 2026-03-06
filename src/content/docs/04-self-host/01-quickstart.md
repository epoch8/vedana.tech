---
title: "Quickstart"
---


## Overview
Vedana is an omni-agentic AI chatbot system built with semantic RAG and knowledge graph as its main tools.

This is a complete framework for building conversational AI systems. Key features include:

- **Thread-based conversation management** with persistent event storage
- **Semantic RAG** using [Memgraph](https://github.com/memgraph/memgraph) (knowledge graph) + [pgvector](https://github.com/pgvector/pgvector) (vector search)
- **Business-defined data model** managed through [Grist](https://github.com/gristlabs/grist-core) spreadsheets
- **Multiple interfaces**: Telegram bot, Terminal UI, Web backoffice
- **Incremental ETL** built with 

## Prerequisites

### Required
- Docker
- Docker Compose
- LLM API key (OpenAI, OpenRouter)

### Optional (for local development without Docker)
- Python 3.11+
- uv (https://github.com/astral-sh/uv)

## What Will Be Started

Using Docker Compose (`apps/vedana/docker-compose.yml`), the following services will run:

- Vedana API (FastAPI) → http://localhost:8080
- Vedana Backoffice → http://localhost:8000, http://localhost:9000
- Postgres + pgvector → localhost:5432
- Memgraph → localhost:7687
- Memgraph Lab → http://localhost:3000
- Grist → http://localhost:8484

## Quickstart (Docker)

### 1. Clone the repository

```bash
git clone https://github.com/epoch8/vedana
cd vedana-master
```

### 2. Create environment file

```bash
cp apps/vedana/.env.example apps/vedana/.env
```

Open `apps/vedana/.env` and set your LLM API key:

```env
OPENAI_API_KEY="your_api_key_here"
```

Leave the `GRIST_*` variables as-is for now. You will return to these after configuring Grist in the next steps.

```env
GRIST_SERVER_URL="http://grist:8484"  
GRIST_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxx"
GRIST_DATA_MODEL_DOC_ID="xxxxxxxxxxxxxxxxxxxxxx"
GRIST_DATA_DOC_ID="xxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Start the stack

```bash
docker compose -f apps/vedana/docker-compose.yml up --build -d
```

This will:
- start databases
- run Alembic migrations
- start API
- start Backoffice

### 4. Verify system health

Check API health:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"ok"}
```

You can also open:
- Backoffice → http://localhost:8000 (http://localhost:9000)
- Memgraph Lab → http://localhost:3000
- Grist → http://localhost:8484

### 5. Configure Grist

Open Grist at http://localhost:8484 and set up the following before running ETL:

1. **Add your data** — upload your domain data (structured tables, documents, or both).
2. **Define your data model** — declare anchors, attributes, and links in the Data Model section.
3. **Add your golden dataset** — upload evaluation question/answer pairs for retrieval testing.

Once Grist is configured, locate API key and ID for API use for each document:
1. Go to **Profile > Settings** and copy API key.
2. Open a document.
3. Navigate to **Settings** and copy the ID for API. 
4. Update the `GRIST_*` values in `apps/vedana/.env`.

### 6. Restart the stack

After updating `.env`, restart the stack to apply the new configuration:

```bash
docker compose -f apps/vedana/docker-compose.yml down
docker compose -f apps/vedana/docker-compose.yml up -d
```

### 7. Run ETL

Open the Backoffice at http://localhost:8000, navigate to the ETL section, and run the pipeline by clicking **'Run Selected'**

Ensure the following steps complete successfully:
- Data model load
- Data load
- Embedding generation

After ETL completes, retrieval will start returning results.


## Send First Chat Request

In the Backoffice navigate to **Chat** section and start messaging.

## Stop the System

Stop containers:

```bash
docker compose -f apps/vedana/docker-compose.yml down
```

Stop and remove volumes (destructive reset):

```bash
docker compose -f apps/vedana/docker-compose.yml down -v
```

## You Are Ready

If:
- API returns health OK
- ETL completed successfully
- Chat endpoint returns assistant messages

Vedana is running correctly.

Here are two new sections to append to the quickstart:

## Inspect the Graph (Memgraph Lab)

Once ETL has completed, you can explore the knowledge graph directly in Memgraph Lab at http://localhost:3000.

Memgraph Lab provides a visual interface for running Cypher queries and inspecting the graph structure. Use it to verify that your anchors, attributes, and links were ingested correctly before testing the chat endpoint.

A few useful queries to get started:

Check how many nodes were created per type:
```cypher
MATCH (n)
RETURN labels(n) AS type, count(n) AS total
ORDER BY total DESC
```

Inspect a specific anchor:
```cypher
MATCH (p:Person {person_id: "geneva_durben"})
RETURN p
```

Traverse a relationship:
```cypher
MATCH (p:Person)-[:likes]->(i:Interest)
RETURN p.full_name, i.interest_name
LIMIT 20
```

If nodes are missing or relationships are not traversable, the most common causes are an incomplete data model, a failed ETL step, or a type mismatch between the data and the declared attribute schema. Re-check the data model in Grist and re-run ETL if needed.
