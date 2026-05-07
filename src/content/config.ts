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
      ctx.store.clear();

      await glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/docs",
      }).load(ctx);

      const entries = [...ctx.store.values()];
      ctx.store.clear();

      for (const entry of entries) {
        const { digest, ...rest } = entry;

        ctx.store.set({
          ...rest,

          slug: deriveSlug(entry.id),

          data: {
            ...entry.data,
            section: entry.data.section ?? deriveSection(entry.id),
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