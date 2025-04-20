import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers: any = getHeaders(event);
  const now = new Date();

  try {
    // Read and validate token
    const { token } = await readBody(event);
    if (!token) {
      throw createError({
        statusCode: 422,
        statusMessage: t("Token not provided."),
      });
    }

    const turnstileResult = await verifyTurnstileToken(token);
    if (!turnstileResult) {
      throw createError({
        statusCode: 422,
        statusMessage: t("Invalid verification token."),
      });
    }
    // Define Valibot schema for body validation
    const schema = object({
      firstName: string([minLength(1, t("First name must not be empty"))]),
      lastName: string([minLength(1, t("Last name must not be empty"))]),
      pub: string([minLength(1, t("Public key must not be empty"))]),
      about: string([minLength(1, t("About must not be empty"))]),
      token: string([minLength(1, t("Verification token must not be empty"))]),
    });

    // Read and validate the body
    const body = await readBody(event);
    const parsed = parse(schema, body, { abortEarly: false });
    const { firstName, lastName, pub, about } = parsed;

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Generate random username in the format user-RANDOMSTRING
    const generateUsername = async (): Promise<string> => {
      const randomValues = crypto.getRandomValues(new Uint8Array(8)); // 8 bytes = 16 hex chars
      const randomString = Array.from(randomValues)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 12); // Use first 12 chars for brevity
      const username = `user-${randomString}`;

      // Check if username exists
      const existingUser = await drizzleDb
        .select()
        .from(users)
        .where(eq(users.username, username))
        .get();

      if (existingUser) {
        return generateUsername(); // Recursively try again
      }
      return username;
    };

    // Generate random password
    const generatePassword = (): string => {
      const randomValues = crypto.getRandomValues(new Uint8Array(8)); // 8 bytes = 16 hex chars
      return Array.from(randomValues)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    };

    const username = await generateUsername();
    const password = generatePassword();

    // Hash password securely
    const hashedPassword = await hashWorkerPassword(password);

    // Create user
    await drizzleDb
      .insert(users)
      .values({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        username,
        about,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      })
      .execute();

    // Fetch inserted user
    const insertedUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!insertedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to retrieve the newly created user"),
      });
    }

    // Capture device information from headers
    const ip = headers["cf-connecting-ip"] || "";
    const userAgent = headers["user-agent"] || "";
    const location = headers["cf-ipcountry"] || "unknown";

    // Insert device associated with the user
    await drizzleDb.insert(devices).values({
      userId: insertedUser.id,
      pubKey: pub,
      deviceName: `Device - ${pub.slice(0, 6)}`,
      ip,
      location,
      userAgent,
      loginDate: now,
      lastActivity: now,
    });

    // Set user session with default permissions
    await setUserSession(event, {
      user: {
        id: insertedUser.id,
        username: insertedUser.username,
        displayName: insertedUser.displayName,
        pub,
        permissions: ["comments.create"],
      },
      loggedInAt: now,
    });

    // Successful response
    return {
      message: t("Registered successfully"),
      firstName: insertedUser.firstName,
      lastName: insertedUser.lastName,
      displayName: insertedUser.displayName,
      about: insertedUser.about,
      username: insertedUser.username,
    };
  } catch (e: any) {
    console.error("Error creating user:", e);
    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage:
        e.statusMessage || t("Internal Server Error. Please try again later."),
    });
  }
});
