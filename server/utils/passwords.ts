/** Default number of iterations for PBKDF2. Adjust based on performance needs. */
const PBKDF2_ITERATIONS = 100000;

/** Hash algorithm used in PBKDF2. */
const HASH_ALGORITHM = "SHA-256";

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 * Replaces bytesToHex functionality.
 * @param buffer The ArrayBuffer to convert.
 * @returns A hexadecimal string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Converts a hexadecimal string to an ArrayBuffer.
 * Replaces hexToBytes functionality.
 * @param hex The hexadecimal string to convert.
 * @returns An ArrayBuffer.
 */
function hexToBuffer(hex: string): ArrayBuffer {
  const byteArray = new Uint8Array(hex.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return byteArray.buffer;
}

/**
 * Generates a random salt as a hex string.
 * Replaces randomBytes functionality.
 * @param length Number of bytes for the salt (default: 16).
 * @returns A hexadecimal string representing the salt.
 */
function generateSalt(length = 16): string {
  const salt = crypto.getRandomValues(new Uint8Array(length));
  return bufferToHex(salt.buffer);
}

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns a string in the format "iterations,salt,hashHex".
 * @param password The password to hash.
 * @returns A promise resolving to the hash string.
 */
export async function hashWorkerPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = hexToBuffer(salt);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    256 // Derive 32 bytes (256 bits)
  );
  const hashHex = bufferToHex(derivedBits);
  return `${PBKDF2_ITERATIONS},${salt},${hashHex}`;
}

/**
 * Verifies a password against a stored hash.
 * Supports formats: "iterations,salt,hashHex" (new) and "salt:hashHex" (old).
 * @param password The password to verify.
 * @param storedHash The stored hash string.
 * @returns A promise resolving to true if the password matches, false otherwise.
 */
export async function verifyWorkerPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  let iterations: number;
  let salt: string;
  let hash: string;

  // Parse the stored hash
  if (storedHash.includes(",")) {
    const parts = storedHash.split(",");
    if (parts.length !== 3) {
      throw new Error("Invalid stored hash format");
    }
    iterations = parseInt(parts[0]);
    salt = parts[1];
    hash = parts[2];
  } else {
    const parts = storedHash.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid stored hash format");
    }
    salt = parts[0];
    hash = parts[1];
    iterations = PBKDF2_ITERATIONS; // Default for old format
  }

  // Derive the hash from the provided password
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = hexToBuffer(salt);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: iterations,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    256 // Derive 32 bytes (256 bits)
  );
  const computedHash = bufferToHex(derivedBits);

  // Compare the computed hash with the stored hash
  return computedHash === hash;
}
