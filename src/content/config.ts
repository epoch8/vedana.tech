import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    section: z.string().optional(),
    order: z.number().optional().default(0),
  }),
});

export const collections = {
  'docs': docsCollection,
};
