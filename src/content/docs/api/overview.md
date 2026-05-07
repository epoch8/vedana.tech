---
title: API Reference Overview
section: API Reference
order: 1
---

# API Reference: Overview

Vedana provides several integration paths:

| Layer              | What it is                                            | Where                       |
| ------------------ | ----------------------------------------------------- | --------------------------- |
| **HTTP API**       | FastAPI with the `/api/v1/chat` endpoint              | `libs/jims-api`             |
| **Web Widget**     | Embeddable JS widget + backend                        | `libs/jims-widget`          |
| **Telegram Bot**   | Bot built with aiogram                                | `libs/jims-telegram`        |
| **Terminal UI**    | Interactive TUI on Textual                             | `libs/jims-tui`             |
| **Python API**     | `make_jims_app()`, `ThreadController`, `RagPipeline`  | `libs/vedana-core` + `libs/jims-core` |

All interfaces use **the same kernel** (`vedana_core.app:app`) — meaning the assistant behaves identically in Telegram, the widget, and the HTTP API; only the transport differs.

## Entry point: `JimsApp`

All CLI wrappers work the same way: they take a `--app` option in `module:attr` format. For Vedana that's `vedana_core.app:app`. The helper `jims_core.util.load_jims_app(app_str)` imports the object, awaits the coroutine if needed, and returns a `JimsApp`.

```python
# vedana_core/app.py
app = make_jims_app()  # this is a coroutine
```

## Common CLI configuration

Every CLI service has a shared set of flags:

| Flag                     | Default      | Description                                                                |
| ------------------------ | ------------ | --------------------------------------------------------------------------- |
| `--app`                   | `app`        | which `JimsApp` to import (`vedana_core.app:app` for Vedana)              |
| `--enable-sentry`         | off          | enable Sentry integration (reads `SENTRY_DSN`, `SENTRY_ENVIRONMENT`)      |
| `--enable-healthcheck`    | on           | bring up a separate `/healthz` (where applicable)                          |
| `--healthcheck-port`      | 9000         | healthcheck port                                                            |
| `--metrics-port`          | 8000         | Prometheus port                                                              |
| `--verbose`               | off          | turn on debug logs                                                           |

All CLIs also read environment variables with the `JIMS_` prefix (`auto_envvar_prefix="JIMS"`).

## What's next

- [HTTP API](./api/http-api.md) — for external integrations.
- [Widget API](./api/widget-api.md) — embedding in a web page.
- [Telegram](./api/telegram.md) — Telegram bot.
- [Python API](./api/python-api.md) — programmatic access.
- [Configuration Reference](./api/configuration-reference.md) — every ENV variable.
