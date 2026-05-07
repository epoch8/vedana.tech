import { getCollection } from "astro:content";

/* ========================================
   TYPES
======================================== */

export type DocItem = {
  title: string;
  slug: string;   // "concepts/semantic-rag"
  href: string;   // "/docs/concepts/semantic-rag"
  order: number;
};

export type DocSection = {
  id: string;
  title: string;
  order: number;
  items: DocItem[];
};

/* ========================================
   SECTION CONFIG
======================================== */

export const SECTION_ORDER = [
  {
    id: "Overview",
    title: "Overview",
    order: 0,
  },
  {
    id: "Getting Started",
    title: "Getting Started",
    order: 1,
  },
  {
    id: "Concepts",
    title: "Concepts",
    order: 2,
  },
  {
    id: "Architecture",
    title: "Architecture",
    order: 3,
  },
    {
    id: "Data Model",
    title: "Data Model",
    order: 4,
  },
      {
    id: "Data Ingestion",
    title: "Data Ingestion",
    order: 5,
  },
  {
    id: "API Reference",
    title: "API Reference",
    order: 6,
  },
  {
    id: "Guides",
    title: "Guides",
    order: 7,
  },
  {
    id: "Product",
    title: "Product",
    order: 8,
  },
  {
    id: "Operations",
    title: "Operations",
    order: 9,
  },
  {
    id: "Contributing",
    title: "Contributing",
    order: 10,
  },
];

/* ========================================
   MAIN
======================================== */

export async function getDocsNavigation(): Promise<DocSection[]> {
  const docs = await getCollection("docs");

  const knownSections = new Set(SECTION_ORDER.map((s) => s.id));

  /* =========================
     1. NORMALIZE
  ========================= */

  const normalized = docs.map((doc) => {
    const section = doc.data.section;

    if (!section) {
      throw new Error(
        `Doc "${doc.id}" is missing "section" in frontmatter`
      );
    }

    if (!knownSections.has(section)) {
      throw new Error(
        `Unknown section "${section}" in doc "${doc.id}"`
      );
    }

    return {
      title: doc.data.title,
      section,
      order: doc.data.order ?? 999,
      slug: doc.id,              // ← ключевой фикс
      href: `/docs/${doc.id}`,   // ← и тут
    };
  });

  /* =========================
     2. GROUP
  ========================= */

  const grouped = new Map<string, DocItem[]>();

  for (const doc of normalized) {
    if (!grouped.has(doc.section)) {
      grouped.set(doc.section, []);
    }

    grouped.get(doc.section)!.push({
      title: doc.title,
      slug: doc.slug,
      href: doc.href,
      order: doc.order,
    });
  }

  /* =========================
     3. BUILD SECTIONS
  ========================= */

  const sections: DocSection[] = SECTION_ORDER.map((sectionConfig) => {
    const items = grouped.get(sectionConfig.id) ?? [];

    items.sort((a, b) => a.order - b.order);

    return {
      id: sectionConfig.id,
      title: sectionConfig.title,
      order: sectionConfig.order,
      items,
    };
  });

  return sections;
}