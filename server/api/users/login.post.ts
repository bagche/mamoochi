import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers: any = getHeaders(event);
  const now = new Date();

  try {
    // Define Valibot schema for body validation
    const schema = object({
      userName: string([minLength(1, t("Username must not be empty"))]),
      password: string([minLength(1, t("Password must not be empty"))]),
      pub: string([minLength(1, t("Public key must not be empty"))]),
    });

    // Read and validate the body
    const body = await readBody(event);
    const parsed = parse(schema, body, { abortEarly: false });
    const { userName, password, pub } = parsed;

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Find user by username
    const user = await drizzleDb
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

    // Fetch user's roles and permissions
    const rolePermissions = await drizzleDb
      .select({ permissions: roles.permissions })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, user.id))
      .all();

    const permissionsSet = new Set<string>();
    for (const role of rolePermissions) {
      try {
        const perms: string[] = JSON.parse(role.permissions);
        perms.forEach((p) => permissionsSet.add(p));
      } catch (err) {
        console.error("Error parsing permissions for role", role, err);
      }
    }
    const permissions = Array.from(permissionsSet);

    // Get device information from Cloudflare headers
    const ip = headers["cf-connecting-ip"] || "";
    const userAgent = headers["user-agent"] || "";
    const location = headers["cf-ipcountry"] || "unknown";

    // Check if device already exists using the public key (pub)
    const existingDevice = await drizzleDb
      .select()
      .from(devices)
      .where(eq(devices.pubKey, pub))
      .get();

    if (existingDevice) {
      // Update the device's last activity and other details
      await drizzleDb
        .update(devices)
        .set({
          lastActivity: now,
          ip,
          userAgent,
          location,
        })
        .where(eq(devices.id, existingDevice.id))
        .execute();
    } else {
      // Insert new device entry
      await drizzleDb.insert(devices).values({
        userId: user.id,
        pubKey: pub,
        ip,
        deviceName: "",
        userAgent,
        location,
        loginDate: now,
        lastActivity: now,
      });
    }

    // Set user session with permissions
    await setUserSession(event, {
      user: {
        id: user.id,
        username: userName,
        displayName: user.displayName,
        pub,
        permissions,
      },
      loggedInAt: now,
    });

    // Return updated profile fields
    return {
      message: t("Login successful"),
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      about: user.about,
    };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
