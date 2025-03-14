import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { asRobotsCollection } from "@nuxtjs/robots/content";

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asRobotsCollection({
        type: "page",
        source: "**/*.md",
        schema: z.object({
          title: z.string(),
          thumbnail: z.string(),
          description: z.string(),
          author: z.string(),
          date: z.string(),
          cat: z.string(),
          tuts: z.string(),
          rawbody: z.string(),
          intro: z.boolean(),
          comments: z.boolean(),
          toc: z.boolean(),
        }),
      })
    ),
    logs: defineCollection(
      asRobotsCollection({
        type: "page",
        source: "**/logs/*.md",
        schema: z.object({
          title: z.string(),
          thumbnail: z.string(),
          description: z.string(),
          author: z.string(),
          date: z.string(),
          cat: z.string(),
          tuts: z.string(),
          rawbody: z.string(),
          intro: z.boolean(),
          comments: z.boolean(),
          toc: z.boolean(),
        }),
      })
    ),
    cats: defineCollection(
      asRobotsCollection({
        type: "page",
        source: "**/cats/*.md",

        schema: z.object({
          title: z.string(),
          thumbnail: z.string(),
          description: z.string(),
          rawbody: z.string(),
        }),
      })
    ),
  },
});
