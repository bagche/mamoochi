// server/api/content/query.get.ts
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    // Import logs.json
    const { default: Logs } = await import("#velite/logs.json", {
      with: { type: "json" },
    });

    // Define Zod schema for query parameters
    const schema = z.object({
      intro: z
        .string()
        .transform((value) => value === "true")
        .optional(),
      sortBy: z.string().default("date"),
      sortOrder: z.string().default("DESC"),
      limit: z.string().transform(Number).default("10"),
      locale: z.string().optional(),
      cat: z.string().optional(),
    });

    // Parse query parameters
    const query = getQuery(event);
    const parsed = schema.parse(query);

    // Filter logs by intro, locale, and cat if provided
    let filteredLogs = Logs;
    if (parsed.intro !== undefined) {
      filteredLogs = filteredLogs.filter((log) => log.intro === parsed.intro);
    }
    if (parsed.locale) {
      filteredLogs = filteredLogs.filter((log) =>
        log.path.startsWith(`/${parsed.locale}/`)
      );
    }
    if (parsed.cat) {
      filteredLogs = filteredLogs.filter((log) => log.cat === parsed.cat);
    }

    // Sort logs
    filteredLogs = filteredLogs.sort((a, b) => {
      const aValue = a[parsed.sortBy] || "";
      const bValue = b[parsed.sortBy] || "";
      const order = parsed.sortOrder === "ASC" ? 1 : -1;
      return aValue > bValue ? order : -order;
    });

    // Apply limit
    filteredLogs = filteredLogs.slice(0, parsed.limit);

    // Return formatted response
    return {
      status: 200,
      data: filteredLogs.map((log) => ({
        path: log.path,
        title: log.title || "",
        thumbnail: log.thumbnail || "",
        description: log.description || "",
        author: log.author || "",
        date: log.date || "",
        cat: log.cat || "",
        intro: log.intro || false,
        comments: log.comments || false,
        toc: log.toc || false,
      })),
    };
  } catch (error) {
    console.error("Error querying logs:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to query logs. Please check server logs for details.",
    });
  }
});
