import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * folder → section
 * 01-overview → Overview
 */
function deriveSection(id: string): string {
  const dir = id.split("/")[0] ?? "";

  return dir
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * id → slug
 * 01-overview/02-what-is-vedana.md → overview/what-is-vedana
 */
function deriveSlug(id: string): string {
  return id
    .replace(/\.(md|mdx)$/, "")
    .split("/")
    .map((part) => part.replace(/^\d+-/, ""))
    .join("/");
}

const docsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),

    // optional overrides
    section: z.string().optional(),
    order: z.number().optional(),

    next: z.string().optional(),
    previous: z.string().optional(),
  }),

  loader: {
    name: "docs",
    load: async (ctx: any) => {
      await glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/docs",
      }).load(ctx);

      for (const entry of ctx.store.values()) {
        const { digest, ...rest } = entry;

        const derivedSection = deriveSection(entry.id);
        const derivedSlug = deriveSlug(entry.id);

        ctx.store.set({
          ...rest,

          slug: derivedSlug, // 👉 добавляем slug прямо в entry

          data: {
            ...entry.data,

            // если section НЕ задан — берём из папки
            section: entry.data.section ?? derivedSection,

            // если order НЕ задан — пусть будет 0
            order: entry.data.order ?? 0,
          },
        });
      }
    },
  },
});

export const collections = {
  docs: docsCollection,
};