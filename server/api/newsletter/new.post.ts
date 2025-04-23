import { drizzle } from "drizzle-orm/d1";
import { email, object, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const schema = object({
    email: pipe(string(), email(t("Invalid email address"))),
    route: string(), // optional: validate format or fallback
  });

  try {
    const body = await readBody(event);
    const { email: emailAddress, route } = parse(schema, body, {
      abortEarly: false,
    });

    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    const now = new Date();

    // Insert into newsletter table
    await db.insert(newsletter).values({
      email: emailAddress,
      routePath: route,
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: t("Subscription successful"),
      email: emailAddress,
    };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    throw createError({
      statusCode: 400,
      statusMessage: error.statusMessage || t("Subscription failed"),
    });
  }
});
