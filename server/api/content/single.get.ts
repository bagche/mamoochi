import { minLength, object, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const { default: Content } = await import("#velite/content.json", {
    with: { type: "json" },
  });
  const t = await useTranslation(event);
  const schema = object({
    path: pipe(string(), minLength(1, "Missing or invalid path parameter")),
  });
  try {
    const query = getQuery(event);
    const parsed = parse(schema, query, { abortEarly: false });
    let { path } = parsed as { path: string };

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
