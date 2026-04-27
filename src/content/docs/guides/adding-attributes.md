---
title: How to Define Attributes
---

_This guide assumes you understand what attributes are and how they relate to anchors. If not, read [Attributes] first._

## Before You Start

For each anchor type you have defined, go through its source data table and identify every column that users might ask about. Each of those columns needs an attribute definition. Columns that are purely internal (row numbers, import timestamps, system flags) can be skipped.

Also decide upfront which attributes should be embeddable (available for semantic search by meaning) and which are purely structural (used only for exact filtering and Cypher queries). This affects how ETL processes each field and cannot be changed after ingestion without re-running ETL.

## Step 1 — Open the Attributes Table

Go to **Grist → Data Model → Anchor_attributes**. Each row defines one property on one anchor type. You will fill in a row for each column you want to make queryable.

<img src="/images/attributes-1.png" alt="Hero" width="800" class="center-image" />

## Step 2 — Set the Attribute Name

Write the attribute name in lowercase with no spaces, matching the column name in your Grist data table exactly.

|Do|Don't|
|---|---|
|`price`|`Price` (capitalized)|
|`opening_hours`|`opening hours` (spaces)|
|`start_date`|`startDate` (camelCase)|
|`in_stock`|`inStock`|

The name must match the actual column header in your data table. If they differ, ETL will not find the column and the attribute will not be written to the graph.

## Step 3 — Write the Description

Like anchor descriptions, attribute descriptions are included in the LLM context. Write them for the assistant.

**Ok:** `"Product price."`

**Better:** `"Retail price of the product in the currency specified by the currency attribute. Used to filter products by price range."`

Even a single additional sentence explaining the unit, currency, or intended use significantly improves how accurately the assistant generates Cypher filters for this field.

## Step 4 — Set the Data Type

Set `dtype` to match what is actually stored in your Grist data table. Supported types:

|dtype|Use for|
|---|---|
|`str`|Text values — names, descriptions, addresses, codes|
|`int`|Whole numbers — counts, years, quantities|
|`float`|Decimal numbers — prices, measurements, percentages|
|`bool`|True/false flags — in_stock, is_active, requires_certification|
|`date`|Calendar dates without time — start_date, end_date, expiry_date|
|`datetime`|Dates with time — created_at, updated_at, last_synced|
|`enum`|A fixed set of known values — status, category_type, region|
|`url`|A web address — product_page, document_link|
|`file`|A file path or reference — attachment, image_path|

**Check your actual data before setting the type.** Open your Grist data table and look at a sample of values in the column. If numbers are stored with surrounding quotes, they are strings in Grist, not floats. If dates are stored as `"2024-01-15"` strings rather than Grist date fields, declare them as `str` and note the format in the description — or convert them to proper date fields before upload.

Type mismatches between the declared dtype and the actual data are one of the most common causes of ETL failure.

## Step 5 — Configure Embeddable and Embed Threshold

Set **Embeddable** to `true` for text attributes where users might search by meaning rather than exact value. Set it to `false` for everything else.

Embeddable is appropriate for:

- Names and display labels (`product_name`, `branch_name`, `interest_name`)
- Descriptions and summaries
- Category or tag labels

Embeddable is not appropriate for:

- Identifiers and primary keys
- Numeric values (`price`, `quantity`)
- Boolean flags
- Dates and timestamps
- Structured codes

When Embeddable is true, also set **embed_threshold** — the minimum similarity score required for a result to be returned. Values range from 0 to 1. A reasonable starting point is `0.75`. After running evaluation, adjust per field:

- If the assistant is returning loosely related results, increase the threshold.
- If it is missing valid matches, decrease it.

## Step 6 — Write the Cypher Query

Write the Cypher query that retrieves this attribute's value from the graph. This is required for any attribute that should be directly queryable by the assistant.

A minimal example for `Product.price`:

```cypher
MATCH (p:Product)
WHERE p.product_id = $id
RETURN p.price
```

A query that returns the attribute alongside its parent node for context:

```cypher
MATCH (p:Product)
WHERE p.product_id = $id
RETURN p.product_id, p.name, p.price
```

Verify the query works in Memgraph Lab before saving. An attribute with an empty or broken query will be visible to the assistant in context but will not be reliably retrievable from the graph.

## Step 7 — Handle Link Fields

If an attribute column contains foreign key references to another anchor type (for example, a `category_id` column on a products table) set the **Link** flag to `true` on that attribute row. This signals to ETL that the column value should be used to create a graph edge, not stored as a plain property.

You will also need a corresponding row in the **Links** table defining the relationship. See [How to Define Links] for how to set this up.

Do not leave a foreign key column as a plain `str` attribute if the referenced entity is modeled as an anchor. The graph will store the ID as a string property on the node instead of creating an edge, and traversal queries will not work.

Step 8 — Define Link Attributes

Some relationships carry their own data — not just the fact that two nodes are connected, but properties of the connection itself. A `PERSON_assigned_to_PROJECT` edge might carry a `role` (string) and a `start_date` (date). A `DOCUMENT_covers_REGULATION` edge might carry a `coverage_level` (enum) or a `verified` flag (bool). 

These are link attributes, and they live in a separate table: **Grist → Data Model → Link_attributes**.

<img src="/images/attributes-2.png" alt="Hero" width="800" class="center-image" />

**When to use link attributes.** Use them when the data belongs to the relationship itself, not to either of the connected nodes. If the same value could equally belong to the source or target node, it should be a node attribute instead.

Examples of data that belongs on the edge:

|Link|Attribute|dtype|Why it's on the edge|
|---|---|---|---|
|`PERSON_assigned_to_PROJECT`|`role`|str|The same person can have different roles on different projects|
|`DOCUMENT_covers_REGULATION`|`coverage_level`|enum|Describes the relationship, not the document or regulation individually|
|`PRODUCT_valid_in_REGION`|`valid_from`|date|The validity date is a property of which region, not of the product alone|

**How to fill in the table.** Create one row per property you want to store on the edge:

1. **attribute_name** — lowercase, no spaces, matching the column name in your link data table.
2. **description** — plain-language explanation of what this property represents, written for the assistant.
3. **link** — select the link this attribute belongs to (e.g. `DOCUMENT_covers_REGULATION`). The link must already be defined in the Links table.
4. **dtype**, **embeddable**, **embed_threshold**, **query** — fill in exactly as you would for an anchor attribute.

**Cypher query for a link attribute.** The query must traverse the relationship and return the edge property. For a `coverage_level` attribute on `DOCUMENT_covers_REGULATION`:

cypher

```cypher
MATCH (d:Document)-[r:DOCUMENT_covers_REGULATION]->(reg:Regulation)
WHERE d.document_id = $id
RETURN reg.regulation_id, reg.name, r.coverage_level
```

Note that edge properties are accessed with `r.property_name` where `r` is the relationship variable, not `d` or `reg`.

After filling in Link_attributes rows, click **Update Data Model** and re-run ETL. Verify the edge property in Memgraph Lab:

cypher

```cypher
MATCH (d:Document)-[r:DOCUMENT_covers_REGULATION]->(reg:Regulation)
RETURN d.title, reg.name, r.coverage_level
LIMIT 10
```

## Step 9 – Update the Data Model and Run ETL

After filling in all attribute rows for a given anchor type, click **Update Data Model** and run ETL in Backoffice. After ETL completes, verify that properties were written correctly by inspecting a node in Memgraph Lab:

```cypher
MATCH (p:Product {product_id: "p-001"})
RETURN p
```

Confirm that all declared attributes appear as properties on the node and that their values look correct. If a property is missing, check whether the column name in the Attributes table matches the column header in your Grist data table exactly.
## Common Mistakes

**Type mismatch between dtype and actual data.** Declaring `price` as `float` when Grist stores it as `"999.00"` (a string) will cause ETL to fail or write the value incorrectly. Always check your actual data before setting dtype.

**Marking identifier fields as embeddable.** Primary keys like `product_id` should never be embeddable. They are structural — used for exact lookup, not semantic search. Embedding them wastes compute and does not improve retrieval.

**Storing comma-separated values in a single attribute.** A field like `tags: "electronics, portable, refurbished"` cannot be filtered or traversed reliably. Each value should be its own row in a related table, connected via a link.

**Leaving the Query field empty.** An attribute without a query is known to the assistant but not reliably retrievable from the graph. Fill in a working Cypher query for every attribute that users might ask about directly.

**Using different names for the same concept across anchors.** If one anchor uses `start_date` and another uses `valid_from` for the same concept, the assistant will treat them as unrelated. Use consistent naming across the model.
