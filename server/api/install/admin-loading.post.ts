import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, optional, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);
  const headers = getHeaders(event);
  const now = new Date();
  const appConfig = useAppConfig(event);

  // Check if app is installed
  if (appConfig.installed) {
    throw createError({
      statusCode: 403,
      message: t("Application is already installed"),
    });
  }

  // Define Valibot schema with pipe pattern
  const UserSchema = object({
    firstName: pipe(string(), minLength(1, t("First name must not be empty"))),
    lastName: pipe(string(), minLength(1, t("Last name must not be empty"))),
    userName: pipe(string(), minLength(1, t("Username must not be empty"))),
    password: pipe(string(), minLength(1, t("Password must not be empty"))),
    pub: pipe(string(), minLength(1, t("Public key must not be empty"))),
    about: pipe(string(), minLength(1, t("About must not be empty"))),
    avatar: optional(string()),
  });

  try {
    // Validate request body
    const body = await readBody(event);
    const { firstName, lastName, userName, password, pub, about, avatar } =
      parse(UserSchema, body, { abortEarly: false });

    // Check for existing username
    const existingUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: t("This username is already in use. Please choose another."),
      });
    }

    // Hash password
    const hashedPassword = await hashWorkerPassword(password);

    // Insert new user
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

    // Retrieve created user
    const newUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();
    if (!newUser) {
      throw createError({
        statusCode: 500,
        message: t("Failed to retrieve the newly created user."),
      });
    }

    // Insert device information
    const ip = headers["cf-connecting-ip"] || "";
    const userAgent = headers["user-agent"] || "";
    const location = headers["cf-ipcountry"] || "unknown";
    await drizzleDb.insert(devices).values({
      userId: newUser.id,
      pubKey: pub,
      deviceName: `Device - ${pub.slice(0, 6)}`,
      ip,
      location,
      userAgent,
      loginDate: now,
      lastActivity: now,
    });

    // Assign admin role
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "owner"))
      .get();
    if (!adminRole) {
      throw createError({
        statusCode: 500,
        message: t("The Admin role is not configured in the system."),
      });
    }

    await drizzleDb
      .insert(user_roles)
      .values({ userId: newUser.id, roleId: adminRole.id })
      .execute();

    // Set user session
    await setUserSession(event, {
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
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
      message:
        error.message ||
        t("An unexpected error occurred. Please try again later."),
    });
  }
});
