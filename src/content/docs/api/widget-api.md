---
title: Widget API
section: API Reference
order: 3
---

# Widget API (`jims-widget`)

`jims-widget` is the backend + static assets for the embeddable web chat widget. In docker-compose it's the `widget` service on port 8090.

## Architecture

`libs/jims-widget/src/jims_widget/`:

- `main.py` — CLI and uvicorn wrapper.
- `server.py` — the FastAPI application with REST endpoints + a WebSocket for real time.
- `static/` — the built widget frontend (JS/CSS) included on the page via `<script>`.

## Running

```bash
uv run python -m jims_widget.main \
  --app vedana_core.app:app \
  --host 0.0.0.0 \
  --port 8090
```

The CLI options are the same shared ones as in other interfaces (`--app`, `--enable-sentry`, `--metrics-port`, `--verbose`).

## Embedding in a page

Once the service is running, drop on your page:

```html
<script src="https://your-vedana-host/widget/embed.js"
        data-app="vedana_core"
        async></script>
```

The widget creates a floating chat button in the bottom-right corner. Clicking it opens the conversation window.

Customisation (via data attributes or window config):

- `data-position="bottom-left|bottom-right"`
- `data-color="#1a73e8"`
- `data-title="Assistant"`
- `data-greeting="Hello!"`
- `data-contact-id="..."` — if you already have a user-id from your session

> The exact attribute set may vary by version. See `libs/jims-widget/src/jims_widget/static/embed.js` in your version of the repo.

## REST endpoints

The widget uses the same concepts as `jims-api`:

- `GET /healthz` — healthcheck.
- `POST /threads` — create a new thread.
- `POST /threads/{thread_id}/messages` — send a message.
- `GET /threads/{thread_id}/events?since=...` — fetch events for rendering.
- `WS /threads/{thread_id}/stream` — WebSocket for real-time delivery of assistant messages and status updates.

## WebSocket protocol

Connection:

```
ws://your-vedana-host:8090/threads/{thread_id}/stream
```

Server-side messages (JSON):

```json
{
  "type": "status",
  "data": {"text": "Searching knowledge base..."}
}
```

```json
{
  "type": "event",
  "data": {
    "event_type": "comm.assistant_message",
    "event_data": {"role": "assistant", "content": "..."}
  }
}
```

Client-side messages:

```json
{"type": "message", "data": {"content": "Hello"}}
```

## Security

By default the widget has no authentication — if you need to restrict access, use:

- your own reverse proxy that issues a token only to authenticated users;
- pass `contact_id` and a signed token via `data-token` and have the backend validate it (requires modifying `server.py`).

In production, do not expose the widget directly on the public internet without authentication — that opens an unrestricted channel to your LLM provider (= money).

## Localisation

Widget texts (greeting, placeholder, send button) are configured in Grist via `ConversationLifecycle` (see [ConversationLifecycle](../data-model/conversation-lifecycle.md)) or directly in the `data-*` attributes when embedding.

## What's next

- [HTTP API](./http-api.md) — the underlying API (the widget is a thin wrapper over the same kernel).
- [ConversationLifecycle](../data-model/conversation-lifecycle.md) — configure greetings.
