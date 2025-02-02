import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "page",
      source: "pages/*.md",
      schema: z.object({
        rawbody: z.string(),
      }),
    }),
    blogs: defineCollection({
      type: "page",
      source: "blogs/*.md",
      schema: z.object({
        rawbody: z.string(),
      }),
    }),
  },
});
