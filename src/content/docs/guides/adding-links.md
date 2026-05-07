---
title: Adding Links
section: Guides
order: 5
---

# Adding Links

A step-by-step scenario: how to add a new link between anchors.

## 1. Decide whether you need a link

Create a link if:

- there's a real domain relationship between two anchors that needs to be traversed;
- users ask multi-hop questions ("which documents regulate products of category X");
- there's a foreign key in the data pointing to another anchor.

Don't create a link if:

- the value is just a "string" that doesn't reference anything → attribute;
- the relationship is obvious to people but no one asks questions about it (overengineering).

## 2. Prepare the data

The source tables must contain something ETL can build the edge from. Possible variants:

- **Foreign key** in the anchor1 table (`product.category_id`).
- **Foreign key** in the anchor2 table (`document.category_id`).
- **A join table** (`product_branch_availability` with `product_id`, `branch_id`).

In the first two cases, fill in `anchor1_link_column_name` or `anchor2_link_column_name` as appropriate.

## 3. Fill in the row in Links

**Grist > Data Model > Links**:

| anchor1  | anchor2  | sentence                       | description                              | query                                                                                                                | anchor1_link_column_name | anchor2_link_column_name | has_direction |
| -------- | -------- | ------------------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------ | ------------- |
| product  | category | `PRODUCT_belongs_to_CATEGORY`  | A product belongs to a category.         | `MATCH (p:product)-[:PRODUCT_belongs_to_CATEGORY]->(c:category) WHERE p.product_id=$id RETURN c.name`               | `category_id`            |                          | true          |
| document | category | `DOCUMENT_regulates_CATEGORY`  | A document regulates a category's requirements. | `MATCH (d:document)-[:DOCUMENT_regulates_CATEGORY]->(c:category) WHERE c.category_id=$id RETURN d.title, d.url`     | `category_id`            |                          | true          |
| product  | branch   | `PRODUCT_available_at_BRANCH`  | The product is available at a branch.    | `MATCH (p:product)-[:PRODUCT_available_at_BRANCH]->(b:branch) WHERE p.product_id=$id RETURN b.name, b.address`      |                          |                          | true          |

### Naming convention

`sentence` is the edge label in Memgraph. The convention adopted in Vedana: `ANCHOR1_verb_ANCHOR2` in upper case with underscores. This improves Cypher readability and helps the LLM understand meaning.

Examples:
- `PERSON_has_INTEREST`
- `PRODUCT_belongs_to_CATEGORY`
- `CONTRACT_signed_with_COUNTERPARTY`

### `has_direction`

Use `true` for most real relationships — it makes LLM reasoning simpler and more accurately reflects domain semantics. Use `false` only for genuinely symmetric relationships (`CITY_neighbors_CITY`).

### `query`

The most important field. It's the **Cypher for traversing** the link, which the LLM can use as a template. The more precise, the better.

Good practices:

- parameterise via `$id` (or `$from_id`, `$to_id`);
- return only the fields you need, not `RETURN *`;
- if you do multi-hop traversal — describe the pattern in the playbook.

## 4. Add edge attributes if needed

If the link has its own properties (`since: 2024-01-01`, `priority: 1`, `assigned_by: "John"`), describe them in **Link_attributes** — same structure as Anchor_attributes; in the `link` column put the edge `sentence`.

## 5. Run ETL

Backoffice → ETL → **Run Selected**.

## 6. Verify in Memgraph Lab

```cypher
MATCH (p:product)-[:PRODUCT_belongs_to_CATEGORY]->(c:category)
RETURN p.name, c.name LIMIT 10
```

Pairs should be returned. If empty — check that:

- ETL actually built the edges (the `memgraph_edges` step succeeded);
- the foreign key in the data isn't empty;
- the anchor names match.

## 7. Verify in chat

Ask a question requiring traversal of the new edge:

> "What products are in the Laptops category?"

In Details there should be Cypher with your `sentence`. If the LLM generated Cypher with a different edge name — improve the link description and `query` field.

## Best practices

- **Verb-like names.** `belongs_to`, `applies_to`, `located_in` — not `relation_a`.
- **Consistent direction.** Don't add `Product → in → Category` and `Category → contains → Product` in parallel — it inflates the graph.
- **Minimise generic links.** `related_to` carries no meaning and reduces graph expressiveness.
- **Document via `description`.** It goes into the LLM context.

## Common mistakes

- **Encoding a relationship as a string attribute.** `Product.category = "Laptops"` blocks all traversal.
- **Empty `query`.** Multi-hop reasoning won't work.
- **No direction.** The LLM doesn't know which way to traverse.
- **Cycles without semantics.** `A → related → B`, `B → related → A`, `A → related → C`, `C → related → A` — the LLM gets lost.
- **Duplicate labels.** `product_belongs_to_category` and `PRODUCT_belongs_to_CATEGORY` — for Cypher these are different edges.

## What's next

- [Adding Anchors](./adding-anchors.md), [Adding Attributes](./adding-attributes.md)
- [Setting Up Data Model](./setting-up-data-model.md)
