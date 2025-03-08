import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const headers: any = getHeaders(event);
  const now = new Date();

  try {
    const { userName, password, pub } = await readBody(event);

    // Validate input fields
    if (!userName || !password || !pub) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Missing required fields: userName, password, pub"),
      });
    }

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
    // Note: the updated schema uses the field name "pubKey"
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
          // If you add a location column to your schema, uncomment the following:
          // location,
        })
        .where(eq(devices.id, existingDevice.id))
        .execute();
    } else {
      // Insert new device entry
      await drizzleDb.insert(devices).values({
        userId: user.id,
        pubKey: pub,
        ip,
        deviceName: "", // Optionally fill this based on additional client info or logic
        userAgent,
        // If you add a location column to your schema, uncomment the following:
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
        pub: pub,
        permissions,
      },
      loggedInAt: now,
    });

    // Return updated profile fields so the client can update its local storage via useUser composable
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
