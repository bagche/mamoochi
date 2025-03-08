import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  // Use plain object property access for headers
  const headers: any = getHeaders(event);
  const now = new Date();

  try {
    const body = await readBody(event);

    // Validate that all required admin details are provided
    const { firstName, lastName, userName, password, pub, about, avatar } = body;
    if (!firstName || !lastName || !userName || !password || !pub || !about) {
      throw createError({
        statusCode: 400,
        statusMessage: t(
          "Please provide firstName, lastName, about, userName, password, and pub."
        ),
      });
    }

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Check if the username already exists
    const existingUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: t(
          "This username is already in use. Please choose another."
        ),
      });
    }

    // Hash password using the new hashWorkerPassword function
    const hashedPassword = await hashWorkerPassword(password);

    // Create the new admin user
    await drizzleDb
      .insert(users)
      .values({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        username: userName,
        about,
        avatar: avatar || "",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      })
      .execute();

    // Retrieve the newly created user
    const insertedUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();

    if (!insertedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to retrieve the newly created user."),
      });
    }

    // Insert device information associated with the new admin user
    const ip = headers["cf-connecting-ip"] || "";
    const userAgent = headers["user-agent"] || "";
    const location = headers["cf-ipcountry"] || "unknown";
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

    // Retrieve the default Admin role (which should already be configured)
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "Admin"))
      .get();

    if (!adminRole) {
      throw createError({
        statusCode: 500,
        statusMessage: t("The Admin role is not configured in the system."),
      });
    }

    // Associate the new user with the Admin role
    await drizzleDb
      .insert(user_roles)
      .values({
        userId: insertedUser.id,
        roleId: adminRole.id,
      })
      .execute();

    // Establish the user session with the new admin's details
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

    return {
      message: t("Admin user registered and loaded successfully."),
    };
  } catch (error: any) {
    console.error("Error during admin user registration:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        t("An unexpected error occurred. Please try again later."),
    });
  }
});
