---
title: Testing
section: Contributing
order: 3
---

# Testing

Vedana uses pytest. Tests come in three categories:

| Category       | Location                                                              | When to run                       |
| -------------- | --------------------------------------------------------------------- | --------------------------------- |
| Unit           | `libs/<package>/tests/unit`                                            | on every commit                   |
| Integration    | `libs/<package>/tests/integration`                                     | requires DB / API to be up        |
| Cassette-based | `libs/<package>/tests/cassettes` (VCR)                                 | for LLM calls with recorded responses |

## Running

All tests:

```bash
uv run pytest
```

A specific package:

```bash
uv run pytest libs/vedana-core/tests
```

Unit only:

```bash
uv run pytest libs/vedana-core/tests/unit
```

By marker:

```bash
uv run pytest -m "not integration"
```

## Preparing infra for integration tests

Bring up the DB and Memgraph:

```bash
docker compose -f apps/vedana/docker-compose.yml up -d db memgraph
```

Apply migrations:

```bash
cd apps/vedana
uv run alembic upgrade head
```

Set up the test ENV (e.g. `apps/vedana/.env.ci-cd`).

## Unit tests

### What to cover

- Pure functions (normalisation, parsing, utilities).
- Logic without I/O — for example, data model template rendering, top_n selection.
- Pydantic models and their validators.

### Example

```python
# libs/vedana-core/tests/unit/test_data_model.py

import pytest
from vedana_core.data_model import Anchor, Attribute

def test_anchor_str_returns_noun():
    a = Anchor(noun="product", description="...", id_example="...", query="...", attributes=[])
    assert str(a) == "product"
```

## Integration tests

### What to cover

- ThreadController — creating threads, recording events, reading history.
- Graph — that queries actually execute in Memgraph.
- VectorStore — that cosine search returns the expected results.
- ETL steps — that DataFrames really convert into the expected nodes.

### Example

```python
# libs/jims-core/tests/integration/test_thread_controller.py

import pytest
from uuid import uuid4
from jims_core.thread.thread_controller import ThreadController

@pytest.mark.asyncio
async def test_new_thread_creates_lifecycle_event(sessionmaker):
    ctl = await ThreadController.new_thread(
        sessionmaker=sessionmaker,
        contact_id="test",
        thread_id=uuid4(),
        thread_config={},
    )
    ctx = await ctl.make_context()
    assert any(ev.event_type == "jims.lifecycle.thread_created" for ev in ctx.events)
```

## VCR / Cassettes

For tests that call the LLM, we use `vcr.py` or cassette-based mocking. That:

- avoids paying for LLM in CI;
- gives deterministic results;
- shows in the commit exactly what's sent to the LLM and what comes back.

Cassettes are stored at `tests/cassettes/<test_name>.yaml`. To re-record — `pytest --record-mode=once` (or equivalent).

> Be careful: a cassette can contain sensitive data. Before committing, check there are no real API keys in there.

## Snapshot tests

For data-model-to-text rendering, snapshot tests are useful — store the "right" output in a file and compare:

```python
def test_render_anchors(data_model, snapshot):
    text = data_model.to_text_descr_sync()
    assert text == snapshot
```

(Example — requires `syrupy` or `pytest-snapshot`.)

## Coverage

Target coverage — **80%+** for the main packages:

- `jims-core`
- `vedana-core`
- `vedana-etl`

Run:

```bash
uv run pytest --cov=vedana_core --cov-report=html
```

Don't chase 100% — cover behaviour, not lines.

## CI

In GitHub Actions, automatically:

- `uv` is installed;
- `uv sync`;
- linters (ruff);
- type checker (mypy);
- unit tests;
- integration tests (with services brought up via `services:` in the job).

PRs don't merge until CI is green.

## Best practices

- **Test behaviour, not implementation.** If a test breaks on refactor without changing the public API, it's a bad test.
- **One test = one behaviour.** Don't pile 5 assertions into one test.
- **Use fixtures for setup.** sessionmaker, graph client, sample data — all in `conftest.py`.
- **Clean up between tests.** Especially for Memgraph (`graph.clear()`) and Postgres (transaction rollback).
- **Don't make tests order-dependent.** Each test should run in isolation.
- **Faster is better.** If an integration test takes 30 seconds, consider replacing it with a unit test + mock.

## What not to cover

- Third-party libraries (LiteLLM, Datapipe, neo4j-driver) — that's their responsibility.
- Specific LLM responses — they're unstable. Test the structure of the answer, not the content.
- The Reflex backoffice UI — that's a separate story, with E2E tests via Playwright (if added later).

## What's next

- [Code Style](./code-style.md)
- [Repository Structure](./repository-structure.md)
- [Contributing Guide](./contributing.md)
