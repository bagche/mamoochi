import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers = getHeaders(event);
  const now = new Date();

  // Schema validation with pipe pattern
  const schema = object({
    userName: pipe(string(), minLength(1, t("Username must not be empty"))),
    password: pipe(string(), minLength(1, t("Password must not be empty"))),
    pub: pipe(string(), minLength(1, t("Public key must not be empty"))),
  });

  try {
    // Validate request body
    const body = await readBody(event);
    const { userName, password, pub } = parse(schema, body, {
      abortEarly: false,
    });

    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    // Find user by username
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Invalid username or password"),
      });
    }

    // Verify password
    const isPasswordValid = await verifyWorkerPassword(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Invalid username or password"),
      });
    }

    // Fetch permissions
    const rolePermissions = await db
      .select({ permissions: roles.permissions })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, user.id))
      .all();

    const permissions = new Set<string>();
    for (const { permissions: perms } of rolePermissions) {
      try {
        JSON.parse(perms).forEach((p: string) => permissions.add(p));
      } catch (err) {
        console.error("Error parsing permissions:", err);
      }
    }

    // Get device information
    const deviceInfo = {
      ip: headers["cf-connecting-ip"] || "",
      userAgent: headers["user-agent"] || "",
      location: headers["cf-ipcountry"] || "unknown",
    };

    // Handle device
    const existingDevice = await db
      .select()
      .from(devices)
      .where(eq(devices.pubKey, pub))
      .get();

    if (existingDevice) {
      await db
        .update(devices)
        .set({
          lastActivity: now,
          ip: deviceInfo.ip,
          userAgent: deviceInfo.userAgent,
          location: deviceInfo.location,
        })
        .where(eq(devices.id, existingDevice.id))
        .execute();
    } else {
      await db
        .insert(devices)
        .values({
          userId: user.id,
          pubKey: pub,
          deviceName: `Device - ${pub.slice(0, 6)}`,
          ip: deviceInfo.ip,
          userAgent: deviceInfo.userAgent,
          location: deviceInfo.location,
          loginDate: now,
          lastActivity: now,
        })
        .execute();
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        username: userName,
        displayName: user.displayName,
        pub,
        permissions: Array.from(permissions),
      },
      loggedInAt: now,
    });

    // Return success response
    return {
      message: t("Login successful"),
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      about: user.about,
      username: user.username,
    };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
