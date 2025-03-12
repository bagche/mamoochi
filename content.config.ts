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
        rawbody: z.string(),
        comments: z.boolean(),
        toc: z.boolean(),
      }),
    }),
    logs: defineCollection({
      type: "page",
      source: "**/logs/*.md",
      schema: z.object({
        title: z.string(),
        thumbnail: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.string(),
        cat: z.string(),
        rawbody: z.string(),
        intro: z.boolean(),
        comments: z.boolean(),
        toc: z.boolean(),
      }),
    }),
    cats: defineCollection({
      type: "page",
      source: "**/cats/*.md",
      schema: z.object({
        title: z.string(),
        thumbnail: z.string(),
        description: z.string(),
        rawbody: z.string(),
      }),
    }),
  },
});
