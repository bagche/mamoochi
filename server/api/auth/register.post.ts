import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers = getHeaders(event);
  const now = new Date();

  // Schema validation with pipe pattern
  const schema = object({
    firstName: pipe(string(), minLength(1, t("First name must not be empty"))),
    lastName: pipe(string(), minLength(1, t("Last name must not be empty"))),
    userName: pipe(string(), minLength(1, t("Username must not be empty"))),
    password: pipe(string(), minLength(1, t("Password must not be empty"))),
    pub: pipe(string(), minLength(1, t("Public key must not be empty"))),
    about: pipe(string(), minLength(1, t("About must not be empty"))),
  });

  try {
    // Validate request body
    const body = await readBody(event);
    const { firstName, lastName, userName, password, pub, about } = parse(
      schema,
      body,
      { abortEarly: false }
    );

    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    // Check for existing username
    const existingUser = await db
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

    // Hash password
    const hashedPassword = await hashWorkerPassword(password);

    // Create user
    const userData = {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      username: userName,
      about,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    await db.insert(users).values(userData).execute();

    // Fetch created user
    const insertedUser = await db
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

    // Get device information
    const deviceInfo = {
      ip: headers["cf-connecting-ip"] || "",
      userAgent: headers["user-agent"] || "",
      location: headers["cf-ipcountry"] || "unknown",
    };

    // Insert device
    await db
      .insert(devices)
      .values({
        userId: insertedUser.id,
        pubKey: pub,
        deviceName: `Device - ${pub.slice(0, 6)}`,
        ip: deviceInfo.ip,
        location: deviceInfo.location,
        userAgent: deviceInfo.userAgent,
        loginDate: now,
        lastActivity: now,
      })
      .execute();

    // Assign member role
    const memberRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "member"))
      .get();

    if (!memberRole) {
      throw createError({
        statusCode: 500,
        statusMessage: t("The member role is not configured in the system."),
      });
    }

    await db
      .insert(user_roles)
      .values({
        userId: insertedUser.id,
        roleId: memberRole.id,
      })
      .execute();

    // Fetch permissions
    const rolePermissions = await db
      .select({ permissions: roles.permissions })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, insertedUser.id))
      .all();

    const permissions = new Set<string>();
    for (const { permissions: perms } of rolePermissions) {
      try {
        JSON.parse(perms).forEach((p: string) => permissions.add(p));
      } catch (err) {
        console.error("Error parsing permissions:", err);
      }
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: insertedUser.id,
        username: insertedUser.username,
        displayName: insertedUser.displayName,
        pub,
        permissions: Array.from(permissions),
      },
      loggedInAt: now,
    });

    // Return success response
    return {
      message: t("Registered successfully"),
      firstName: insertedUser.firstName,
      lastName: insertedUser.lastName,
      displayName: insertedUser.displayName,
      about: insertedUser.about,
      username: insertedUser.username,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        t("Internal Server Error. Please try again later."),
    });
  }
});
