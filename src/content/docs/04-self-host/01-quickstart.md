---
title: "Quickstart"
---

## Goal

Bring up the full Vedana stack locally and get a working chat response via API in 20–30 minutes.

---

## Prerequisites

### Required

- Docker
- Docker Compose
- LLM API key (OpenAI or any LiteLLM-supported provider)

### Optional (for local development without Docker)

- Python 3.11+
- uv (https://github.com/astral-sh/uv)

---

## What Will Be Started

Using Docker Compose (`apps/vedana/docker-compose.yml`), the following services will run:

- Vedana API (FastAPI) → http://localhost:8080
- Vedana Backoffice → http://localhost:3002
- Postgres + pgvector → localhost:5432
- Memgraph → localhost:7687
- Memgraph Lab → http://localhost:3000
- Grist → http://localhost:8484

---

# Quickstart (Docker)

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd vedana-master
```

---

## 2. Create environment file

```bash
cp apps/vedana/.env.example apps/vedana/.env
```

Open `apps/vedana/.env` and configure:

### Minimal required settings

```env
OPENAI_API_KEY="your_api_key_here"
```

### Grist demo configuration (works with bundled compose setup)

```env
GRIST_SERVER_URL="http://grist:8484"
GRIST_API_KEY="e30d2f274a538c05fecd14510887f8a3b7eab718"
GRIST_DATA_MODEL_DOC_ID="wEEmPY3UiwMD"
GRIST_DATA_DOC_ID="qAxQ1gcBKcW7"
```

Notes:
- Vedana reads `GRIST_*` from `apps/vedana/.env`
- Database and Memgraph connection settings are already correct for Docker network

---

## 3. Start the stack

```bash
docker compose -f apps/vedana/docker-compose.yml up --build -d
```

This will:
- start databases
- run Alembic migrations
- start API
- start Backoffice

---

## 4. Verify system health

Check API health:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"ok"}
```

You can also open:

- Backoffice → http://localhost:3002
- Memgraph Lab → http://localhost:3000
- Grist → http://localhost:8484

---

# First Data Load (ETL)

Vedana requires data model + data from Grist before chat works.

## Recommended method (Backoffice)

1. Open http://localhost:3002
2. Navigate to ETL section
3. Run the ETL pipeline

Ensure the following steps are executed:
- Data model load
- Data load
- Embedding generation

After ETL completes, retrieval will start returning results.

---

# Send First Chat Request

```bash
curl http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "contact_id": "local-dev",
    "message": "Hello, what can you do?"
  }'
```

Expected response structure:

```json
{
  "thread_id": "...",
  "assistant_messages": [...],
  "events": [...]
}
```

---

# Stop the system

Stop containers:

```bash
docker compose -f apps/vedana/docker-compose.yml down
```

Stop and remove volumes (destructive reset):

```bash
docker compose -f apps/vedana/docker-compose.yml down -v
```

---

# You Are Ready

If:
- API returns health OK
- ETL completed successfully
- Chat endpoint returns assistant messages

Vedana is running correctly.

