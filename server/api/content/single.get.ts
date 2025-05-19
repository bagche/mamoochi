import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { default: Content } = await import("#velite/content.json", {
    with: { type: "json" },
  });
  const t = await useTranslation(event);
  const schema = z.object({
    path: z.string().min(1, "Missing or invalid path parameter"),
  });
  try {
    const query = getQuery(event);
    const parsed = schema.parse(query);
    let { path } = parsed;

    // Normalize path
    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    // Lookup content
    const item = (Content as Array<{ path: string }>).find(
      (i) => i.path === path
    );

    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: t("Page not found"),
      });
    }

    return item;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
