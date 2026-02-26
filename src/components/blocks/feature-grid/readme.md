# FeatureGrid

Responsive content grid component for side-by-side feature blocks.

Supports:

- flexible layout (2–N items)
- optional title, image, and HTML content
- semantic `schema.org/ItemList` markup
- theme-controlled styling via CSS variables
- auto-responsive grid (`auto-fit`)

---

## Architecture

The component is split into:

- `FeatureGrid.astro` → wrapper (`ItemList`)
- `FeatureGridItem.astro` → single item (`ListItem`)
- `FeatureGrid.module.css` → component styles

---

## Props

### FeatureGrid

| Prop | Type | Default |
|------|------|---------|
| id | `string` | `"feature-grid"` |

---

### FeatureGridItem

| Prop | Type | Default |
|------|------|---------|
| title | `string` | `undefined` |
| image | `string` | `undefined` |
| imageAlt | `string` | `""` |
| text | `string` (HTML) | `undefined` |
| position | `number` | `undefined` |

---

## Usage

```astro
---
import FeatureGrid from "@/components/blocks/feature-grid/FeatureGrid.astro";
import FeatureGridItem from "@/components/blocks/feature-grid/FeatureGridItem.astro";
---

<section class="section">
  <div class="container">
    <FeatureGrid>
      <FeatureGridItem
        position={1}
        title="Generic LLM Chatbots"
        image="/images/llm.png"
        imageAlt="Abstract neural network with chaotic glowing nodes representing probabilistic AI behavior"
        text={`
          <ul>
            <li>Retrieve something that looks relevant</li>
            <li>Produce plausible outputs under uncertainty</li>
          </ul>
        `}
      />

      <FeatureGridItem
        position={2}
        title="Vedana's Approach"
        image="/images/graph.png"
        imageAlt="Structured knowledge graph with verified interconnected nodes representing deterministic reasoning"
        text={`
          <ul>
            <li>AI is the interface — not the brain</li>
            <li>Structured knowledge and deterministic logic</li>
            <li>Grounded, verifiable reasoning</li>
          </ul>
        `}
      />
    </FeatureGrid>
  </div>
</section>
```