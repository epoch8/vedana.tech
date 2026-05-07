---
title: Configuration
section: Getting Started
order: 4
---

# Configuration

Vedana is configured through environment variables. Everything important is read via `pydantic-settings` in three places:

- `vedana_core.settings.VedanaCoreSettings` — main settings of the RAG pipeline.
- `vedana_etl.settings.Settings` — ETL settings.
- `jims_core.llms.llm_provider.LLMSettings` — LLM provider parameters.

This guide covers the most important variables. The full reference is in the [Configuration Reference](../api/configuration-reference.md).

## LLM

Vedana runs on top of [LiteLLM](https://www.litellm.ai/). Model names follow the LiteLLM format (`gpt-4.1-mini`, `openrouter/anthropic/claude-3.5-sonnet`, `vertex_ai/gemini-2.5-pro`, etc.). Provider access is configured through standard environment variables (`OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`, etc.).

| Variable                          | Purpose                                                                                                | Default                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `MODEL`                            | Main model: user answers and Cypher generation.                                                        | `gpt-4.1`                     |
| `FILTER_MODEL`                     | Model for the data model filtering step (see [`RagPipeline.filter_data_model`](../architecture/vedana-core.md#data-model-filtering)). Usually smaller and faster. | `gpt-4.1-mini`               |
| `JUDGE_MODEL`                      | Model for the evaluation pipeline (LLM-as-judge).                                                       | `gpt-4.1-mini`                |
| `EMBEDDINGS_MODEL`                 | Embeddings model.                                                                                       | `text-embedding-3-large`      |
| `EMBEDDINGS_DIM`                   | Embeddings dimensionality. Changing this requires a SQL migration.                                      | `1024`                        |
| `EMBEDDINGS_MAX_BATCH_SIZE`        | Maximum number of texts in one embeddings batch.                                                        | `2048`                        |
| `EMBEDDINGS_MAX_TOKENS_PER_BATCH`  | Maximum tokens in one embeddings batch.                                                                  | `200000`                      |
| `MODEL_API_KEY`                    | If set, overrides the key for the main model (otherwise the standard provider env var is used).         | `None`                        |
| `EMBEDDINGS_MODEL_API_KEY`         | Same for the embeddings model.                                                                           | `None`                        |
| `OPENROUTER_API_BASE_URL`          | OpenRouter endpoint (you can change it to your own gateway).                                            | `https://openrouter.ai/api/v1`|

## RAG pipeline

| Variable                    | Purpose                                                                                              | Default      |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------ |
| `ENABLE_DM_FILTERING`        | Enables the data model filtering step before the main agent. Reduces tokens for large data models.   | `true`       |
| `PIPELINE_HISTORY_LENGTH`    | How many recent `comm.*` messages to feed into the agent's context.                                  | `20`         |
| `DEBUG`                      | Turns on additional logging and dev features.                                                         | `false`      |

The threshold and `top_n` parameters for vector search are configured in code (`RagPipeline(threshold=0.8, top_n=5)`) and in the `embed_threshold` of every embeddable attribute in the data model.

## Databases

### PostgreSQL (JIMS + pgvector + Datapipe)

| Variable                       | Purpose                                                                | Example                                  |
| ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------- |
| `JIMS_DB_CONN_URI`              | Connection URI for JIMS (threads, events, state).                      | `postgresql://postgres:postgres@db:5432` |
| `DB_CONN_URI`                   | Connection URI for Datapipe / ETL.                                      | `postgresql://postgres:postgres@db:5432` |
| `JIMS_DB_USE_NULL_POOL`         | Disable the connection pool (useful in serverless setups).             | `false`                                  |
| `JIMS_DB_POOL_SIZE`             | Pool size.                                                              | SQLAlchemy default                       |
| `JIMS_DB_POOL_MAX_OVERFLOW`     | Maximum extra connections above the pool.                               | SQLAlchemy default                       |
| `CREATE_PGVECTOR_EXTENSION`     | Whether the migration should create the `pgvector` extension.          | `true`                                   |

> By default, JIMS and Datapipe write to the same database. They can be split into two if you need isolation.

### Memgraph

| Variable         | Purpose                          | Example                  |
| ---------------- | -------------------------------- | ------------------------ |
| `MEMGRAPH_URI`   | Memgraph Bolt endpoint.          | `bolt://memgraph:7687`   |
| `MEMGRAPH_USER`  | User.                             | `neo4j`                  |
| `MEMGRAPH_PWD`   | Password.                         | set in `.env.example`    |

## Data source

### Grist (default)

| Variable                   | Purpose                                                |
| -------------------------- | ------------------------------------------------------- |
| `GRIST_SERVER_URL`         | Grist base URL (`http://grist:8484` or `https://api.getgrist.com`). |
| `GRIST_API_KEY`            | API key.                                                |
| `GRIST_DATA_MODEL_DOC_ID`  | DocId of the document with the data model (Anchors, Links, …). |
| `GRIST_DATA_DOC_ID`        | DocId of the document with the data itself.              |
| `GRIST_TEST_SET_DOC_ID`    | DocId of the document with the golden dataset for evaluation. |

Alternative sources are wired up via [Custom ETL](../data-ingestion/custom-etl.md).

## Interfaces

### Telegram

| Variable             | Purpose                                  |
| -------------------- | ----------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather.                |

### HTTP API (`jims-api`) — authentication

The API supports two modes:

- Bearer token via the `--api-key` flag.
- [Authentik](https://goauthentik.io/) verification (`--authentik-url`, `--authentik-app-slug`).

See [HTTP API](../api/http-api.md).

### Backoffice

| Variable                    | Purpose                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| `VEDANA_BACKOFFICE_DEBUG`   | Enables dev-only features in the backoffice (test stands, manual queries). |

## Observability

| Variable             | Purpose                                                    |
| -------------------- | ----------------------------------------------------------- |
| `SENTRY_DSN`         | Sentry endpoint. If empty, Sentry is off.                  |
| `SENTRY_ENVIRONMENT` | Environment name shown in Sentry.                           |

OpenTelemetry traces and Prometheus metrics are exposed through the standard mechanisms (`--metrics-port` of each CLI and `OTEL_*` env vars). See [Observability](../architecture/observability.md).

## Environment profiles

`apps/vedana/` ships two profiles:

- `.env.example` — a template for local development and the quick start.
- `.env.ci-cd` — a CI/CD profile (used in GitHub Actions).

Create your own profiles using the same template. Never commit secret keys: `.env` is already in `.gitignore`.
