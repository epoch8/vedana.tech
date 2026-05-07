---
title: Roadmap
section: Product
order: 5
---

# Roadmap

This document is a high-level map of Vedana's development directions. Specific priorities are published as GitHub Issues and Milestones in the [repository](https://github.com/epoch8/vedana). If you want to influence priorities, open an issue or a discussion.

## What already works

- Semantic RAG pipeline with data model filtering, vector search, and Cypher.
- Datapipe-based ETL with incremental loading from Grist.
- Memgraph (graph) and pgvector (embeddings) support.
- Multi-provider LLM through LiteLLM.
- Several interfaces: HTTP API, Telegram, web widget, TUI, Reflex backoffice.
- Evaluation on a golden dataset with an LLM-judge.
- OpenTelemetry / Prometheus / Sentry observability.
- Custom tools and pipelines.

## Development directions

### Performance and cost

- Caching of intermediate results (data model filtering, vector search).
- Streaming of the response (chunk-by-chunk via SSE / WebSocket).
- Fine-tuning embeddings batching for different providers.
- Optional compression of the data model description through summary embeddings.

### Expanding data sources

- First-class support for alternative data model sources (YAML in the repo, Notion, Airtable).
- Connectors for popular CRM / ERP / ITSM systems without custom ETL hand-writing.
- Streaming ETL on top of Kafka / NATS for near-realtime ingestion.

### Expanding stores

- Production-ready connectors for Pinecone / Qdrant / Weaviate as alternatives to pgvector.
- Neo4j support alongside Memgraph (the driver is already compatible).
- Optional offload to DuckDB / Clickhouse for analytical sub-queries.

### Quality and evaluation

- Extended retrieval metrics: precision/recall/F1, hallucination rate, faithfulness.
- Regression tests in CI with metric history.
- A/B infrastructure for comparing configs in production.

### UI / UX

- Expanded backoffice: visual playbook editor, drag-and-drop for the data model.
- A ready-made widget for several frameworks (React, Vue, embedded HTML).
- Deeper integration with Memgraph Lab.

### Security and multi-tenancy

- Row-level security at the Cypher template layer.
- Off-the-shelf integrations with identity providers (Keycloak, Auth0).
- Audit log of incoming requests and generated Cypher.

### Tool expansion

- Off-the-shelf integration tools: calculations, conversions, external APIs.
- A DSL for describing tools in Grist (no Python for simple cases).

### Availability

- A hosted variant (managed Vedana) for teams that don't want to run their own infrastructure.
- A CLI wrapper for a fast start (no Docker, with a local SQLite + local Memgraph).

## What's NOT on the roadmap

- Replacing the LLM provider core (LiteLLM is enough).
- Switching to an in-house graph engine (Memgraph covers 95% of scenarios).
- A full no-code platform (Vedana stays a framework that requires modeling).

## How to influence the roadmap

- **Open an issue** in the [repository](https://github.com/epoch8/vedana/issues) tagged `enhancement` or `discussion`.
- If you want to do it yourself — discuss the design in the issue first, then a PR (see [Contributing](../contributing/contributing.md)).
- For commercial integrations — contact the Epoch8 team (contacts on [vedana.tech](https://vedana.tech)).

> These are directions, not promises. The project is open-source; development is driven by the Epoch8 team and the community. The pace of specific tracks depends on demand and contributors.
