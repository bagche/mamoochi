import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
      schema: z.object({
        rawbody: z.string(),
      }),
    }),
    items: defineCollection({
      type: "page",
      source: "items/*.md",
      schema: z.object({
        rawbody: z.string(),
      }),
    }),
  },
});
