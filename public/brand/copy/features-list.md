# Vedana Features

## Core reasoning

- **Typed knowledge graph.** You describe your domain as anchors (entities), attributes (facts), and links (relations); your data lands in Memgraph following that model. Structure first, interpretation second.
- **Hybrid retrieval.** Cypher graph queries for structured questions, pgvector semantic search for fuzzy ones, combined in a single tool-calling loop.
- **Explicit data model.** The schema is a contract: the assistant operates within a described domain and can't invent entities or bypass constraints.
- **Playbook (intent-based routing).** Typical question classes get explicit step-by-step navigation strategies.
- **Deterministic execution.** The same question triggers the same operations. Reproducible, auditable.
- **Complete result sets.** Graph queries return all matching records, so nothing gets silently dropped.
- **Exact values.** Prices, dates, IDs, and statuses come straight from the graph, always current.
- **Multi-hop reasoning.** Traverses explicit relationships: product to category to regulation to document.
- **Source attribution.** Every answer traces back to specific nodes, edges, and source chunks.

## Quality

- **Evaluation harness.** Golden datasets (curated Q&A pairs), quality metrics, automated regression testing on every change.
- **Observability.** OpenTelemetry traces, Prometheus metrics, optional Sentry.

## Integration

- **HTTP API** (FastAPI) and embeddable web chat widget
- **Telegram bot** adapter; terminal UI for development
- **Backoffice admin UI** for running ETL, tuning prompts, and watching metrics
- **Any LLM provider** via LiteLLM: OpenAI, Anthropic, Gemini, or local models via Ollama
- **Incremental ETL** (built on Datapipe), with Grist out of the box and custom sources supported

## Deployment

- **Open-core.** The engine is open source.
- **Managed cloud** or **on-premise.** Same stack, your choice.
- **4-week structured pilot.** Discovery, domain modeling, data loading, launch.
