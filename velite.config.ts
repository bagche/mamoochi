import { defineCollection, defineConfig, s } from "velite";

const content = defineCollection({
  name: "Content",
  pattern: "**/**/*.md",
  schema: s
    .object({
      title: s.string(),
      thumbnail: s.string().optional(), // Make optional to avoid errors
      description: s.string().optional(),
      author: s.string().optional(),
      date: s.string().optional(),
      cat: s.string().optional(),
      tuts: s.string().optional(),
      intro: s.boolean().optional(),
      comments: s.boolean().optional(),
      newsletter: s.boolean().optional(),
      toc: s.boolean().optional(),
      path: s.path(),
      body: s.raw(),
      tocData: s.toc(),
    })
    .transform((data) => ({
      ...data,
      path: "/" + data.path,
      type: "page",
    })),
});
const logs = defineCollection({
  name: "Logs",
  pattern: "**/logs/**/*.md",
  schema: s
    .object({
      title: s.string(),
      thumbnail: s.string().optional(), // Make optional to avoid errors
      description: s.string().optional(),
      author: s.string().optional(),
      date: s.string().optional(),
      cat: s.string().optional(),
      tuts: s.string().optional(),
      intro: s.boolean().optional(),
      comments: s.boolean().optional(),
      newsletter: s.boolean().optional(),
      toc: s.boolean().optional(),
      path: s.path(),
      body: s.raw(),
      tocData: s.toc(),
    })
    .transform((data) => ({
      ...data,
      path: "/" + data.path,
      type: "page",
    })),
});
export default defineConfig({
  collections: { content, logs },
});
