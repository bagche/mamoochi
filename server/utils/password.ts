let cryptoPromise: Promise<Crypto> | null = null;

function getCryptoInstance(): Promise<Crypto> {
  if (cryptoPromise) return cryptoPromise;
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    cryptoPromise = Promise.resolve(globalThis.crypto);
  } else {
    cryptoPromise = import("crypto").then((module) => module.webcrypto);
  }
  return cryptoPromise;
}

/**
 * Generate a random salt using the appropriate crypto API.
 * @returns A Promise that resolves to a random salt string in hexadecimal format.
 */
export async function generateSalt(): Promise<string> {
  const crypto = await getCryptoInstance();
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  return Array.from(saltArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash a password with a provided salt using PBKDF2.
 * @param password - The plain text password.
 * @param salt - The salt to use (hex string or a Promise resolving to a string).
 * @returns A promise that resolves to a hexadecimal hash string.
 */
export async function hashSaltPassword(
  password: string,
  salt: string | Promise<string>
): Promise<string> {
  // If salt is a promise, await it so we always have a string.
  if (salt && typeof (salt as any).then === "function") {
    salt = await salt;
  }
  if (typeof salt !== "string") {
    throw new Error(`Invalid salt provided: ${salt}`);
  }
  const crypto = await getCryptoInstance();
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  // Convert the hex salt string back to a Uint8Array
  const saltMatch = salt.match(/.{1,2}/g);
  if (!saltMatch) {
    throw new Error("Invalid salt format");
  }
  const saltBuffer = Uint8Array.from(
    saltMatch.map((byte) => parseInt(byte, 16))
  );
  const key = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const iterations = 100000;
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations,
      hash: "SHA-256",
    },
    key,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * Verify a plain text password against a stored hashed password and its salt.
 * @param hashedPassword - The stored hash.
 * @param plainPassword - The plain text password to verify.
 * @param salt - The salt used (hex string or a Promise resolving to a string).
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export async function verifySaltPassword(
  hashedPassword: string,
  plainPassword: string,
  salt: string | Promise<string>
): Promise<boolean> {
  const computedHash = await hashSaltPassword(plainPassword, salt);
  return computedHash === hashedPassword;
}
