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
    id: "Concepts",
    title: "Concepts",
    order: 1,
  },
  {
    id: "Quick Start",
    title: "Quick Start",
    order: 2,
  },
  {
    id: "Data model",
    title: "Data model",
    order: 3,
  },
    {
    id: "Preparing data for Vedana",
    title: "Preparing data for Vedana",
    order: 4,
  },
      {
    id: "Guides",
    title: "Guides",
    order: 5,
  },
        {
    id: "Example Dataset",
    title: "Example Dataset",
    order: 5,
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