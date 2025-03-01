import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
      schema: z.object({
        title: z.string(),
        thumbnail: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.string(),
        category: z.string(),
        rawbody: z.string(),
        intro: z.boolean(),
        comments: z.boolean(),
        toc: z.boolean(),
      }),
    }),
    notes: defineCollection({
      type: "page",
      source: "**/notes/*.md",
      schema: z.object({
        title: z.string(),
        thumbnail: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.string(),
        category: z.string(),
        rawbody: z.string(),
        intro: z.boolean(),
        comments: z.boolean(),
        toc: z.boolean(),
      }),
    }),
  },
});
