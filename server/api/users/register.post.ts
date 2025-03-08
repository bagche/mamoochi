import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers: any = getHeaders(event);
  const now = new Date();

  try {
    const body = await readBody(event);

    // Required fields validation
    const { firstName, lastName, userName, password, pub, about } = body;

    if (!firstName || !lastName || !userName || !password || !pub || !about) {
      throw createError({
        statusCode: 400,
        statusMessage: t(
          "Missing required fields: firstName, lastName, about, userName, password, or pub"
        ),
      });
    }

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Check for existing username
    const existingUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: t(
          "Username is already taken. Please choose another one."
        ),
      });
    }

    // Hash password securely with PBKDF2 (iterations and salt included)
    const hashedPassword = await hashWorkerPassword(password);

    // Create user
    await drizzleDb
      .insert(users)
      .values({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        username: userName,
        about: about,
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
      .where(eq(users.username, userName))
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

    // Set user session
    await setUserSession(event, {
      user: {
        id: insertedUser.id,
        username: insertedUser.username,
        displayName: insertedUser.displayName,
        pub,
        permissions: [],
      },
      loggedInAt: now,
    });

    // Successful response with profile data
    return {
      message: t("Registered successfully"),
      firstName: insertedUser.firstName,
      lastName: insertedUser.lastName,
      displayName: insertedUser.displayName,
      about: insertedUser.about,
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
