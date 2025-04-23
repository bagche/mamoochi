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
    pub: pipe(string(), minLength(1, t("Public key must not be empty"))),
    about: pipe(string(), minLength(1, t("About must not be empty"))),
    token: pipe(
      string(),
      minLength(1, t("Verification token must not be empty"))
    ),
  });

  try {
    // Validate token
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

    // Validate request body
    const body = await readBody(event);
    const { firstName, lastName, pub, about } = parse(schema, body, {
      abortEarly: false,
    });

    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    // Generate unique username
    const generateUsername = async (): Promise<string> => {
      const randomString = crypto
        .getRandomValues(new Uint8Array(8))
        .reduce((str, b) => str + b.toString(16).padStart(2, "0"), "")
        .slice(0, 12);
      const username = `user-${randomString}`;

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .get();

      return existingUser ? generateUsername() : username;
    };

    // Generate random password
    const generatePassword = (): string => {
      return crypto
        .getRandomValues(new Uint8Array(8))
        .reduce((str, b) => str + b.toString(16).padStart(2, "0"), "");
    };

    const username = await generateUsername();
    const password = generatePassword();
    const hashedPassword = await hashWorkerPassword(password);

    // Create user
    const userData = {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      username,
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
      .where(eq(users.username, username))
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
