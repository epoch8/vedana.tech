---
title: Installation
section: Getting Started
order: 3
---

# Installation

This guide describes three modes for installing Vedana: local development with Docker Compose, local development with `uv` without Docker, and a production install.

## System requirements

| Component       | Version / requirement                                                          |
| --------------- | ------------------------------------------------------------------------------- |
| Python          | 3.12 (see `.python-version`)                                                   |
| PostgreSQL      | 15+ with the [`pgvector`](https://github.com/pgvector/pgvector) extension      |
| Memgraph        | recent `memgraph/memgraph-mage`, Bolt protocol                                 |
| Grist           | `gristlabs/grist:latest`, locally or managed                                   |
| LLM provider    | OpenAI, OpenRouter, Google/VertexAI, or any provider compatible with LiteLLM   |
| Docker          | 24+ with Compose v2 (for the quick start)                                      |
| `uv`            | recent, for local development (https://docs.astral.sh/uv/)                     |

## Option A. Docker Compose (recommended for the first run)

The simplest path is to bring the entire stack up with a single command. See [Quick Start](./getting-started/quick-start.md). The compose file `apps/vedana/docker-compose.yml` brings up app, api, widget, Postgres, Memgraph, Memgraph Lab, and Grist.

If a port is already in use on your host, change the corresponding mapping in `docker-compose.yml`.

## Option B. Local dev without Docker

Suitable if you're developing Vedana itself or want to debug a single service.

### 1. Dependencies via `uv`

The repository is a [uv workspace](https://docs.astral.sh/uv/concepts/projects/workspaces/) containing every `libs/jims-*` and `libs/vedana-*` library.

```bash
uv sync
```

`uv` will create a virtual environment and install every library in workspace mode (you can edit any `libs/*` package directly).

### 2. Bring up Postgres + Memgraph + Grist

The simplest path is a separate compose file with the infrastructure only:

```bash
docker compose -f apps/vedana/docker-compose.yml up -d db memgraph grist
```

After that you can run the apps (`app`, `api`, `widget`) locally.

### 3. Set up `.env`

```bash
cp apps/vedana/.env.example apps/vedana/.env
```

At minimum, configure:

- `JIMS_DB_CONN_URI` — Postgres URI (for example `postgresql://postgres:postgres@localhost:5432`).
- `MEMGRAPH_URI`, `MEMGRAPH_USER`, `MEMGRAPH_PWD` — Memgraph.
- `GRIST_SERVER_URL`, `GRIST_API_KEY`, `GRIST_DATA_MODEL_DOC_ID`, `GRIST_DATA_DOC_ID` — the source of the data model and data.
- An LLM provider key (`OPENAI_API_KEY` / `OPENROUTER_API_KEY` / `GOOGLE_APPLICATION_CREDENTIALS`).

The full list is in the [Configuration Reference](../api/configuration-reference.md).

### 4. Apply migrations

```bash
cd apps/vedana
uv run alembic upgrade head
```

The migration `2dfad73e5cce_move_emb_to_pgvector` requires the `pgvector` extension. If your Postgres provider manages extensions itself (Supabase, Neon), set `CREATE_PGVECTOR_EXTENSION=false`. For self-hosted setups, use `true`.

### 5. Run the service you need

The repository defines several CLI scripts ([README.md](https://github.com/epoch8/vedana/blob/main/README.md)):

| Command                            | What it runs                                              |
| ---------------------------------- | ---------------------------------------------------------- |
| `vedana-backoffice-with-caddy`     | Reflex backoffice behind a Caddy reverse proxy (production) |
| `uv run python -m jims_api.main`   | HTTP API on FastAPI                                        |
| `uv run python -m jims_widget.main`| Web widget                                                 |
| `jims-telegram`                    | Telegram bot                                               |
| `jims-tui`                         | Terminal UI for interactive debugging                      |
| `jims-backoffice`                  | A minimal FastAPI backoffice                               |

All scripts accept a `--app` option in `module:attr` format; the default is `app`. For Vedana, use `vedana_core.app:app`.

Example: starting the API:

```bash
uv run python -m jims_api.main --app vedana_core.app:app --host 0.0.0.0 --port 8080
```

## Option C. Production

A production build uses the same Docker image from `apps/vedana/Dockerfile`, but typically:

- Postgres and Memgraph are moved to a managed service.
- Grist is deployed separately (or you use managed Grist).
- Models and API keys come from secrets managed by your orchestrator (Kubernetes Secret, GCP Secret Manager, etc.).
- `vedana-backoffice-with-caddy` runs behind an external reverse proxy (nginx, ingress).
- `SENTRY_DSN`, OpenTelemetry exporters, and Prometheus scraping are turned on.

Details and YAML examples are in [Operations → Deployment](../operations/deployment.md).

## Verifying the install

After installation, run the minimum smoke test:

```bash
curl http://localhost:8080/healthz
# {"status":"ok"}

curl -X POST http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"contact_id": "test-user", "message": "ping"}'
```

If the response is correct, the install succeeded. If not, see [Troubleshooting](../operations/troubleshooting.md).
