import { scryptAsync } from "@noble/hashes/scrypt";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";

// Scrypt configuration options – adjust these values as needed.
const scryptOptions = {
  N: 2 ** 16, // CPU/memory cost factor
  r: 8, // block size
  p: 1, // parallelization factor
  dkLen: 32, // derived key length (in bytes)
};

/**
 * Generate a random salt.
 * @returns A random salt as a hex-encoded string.
 */
export const generateSalt = (): string => {
  const saltBytes = randomBytes(16);
  return bytesToHex(saltBytes);
};

/**
 * Hash a password with a provided salt using scrypt.
 * @param password - The plain text password.
 * @param salt - The salt to use for hashing, as a hex string.
 * @returns A promise that resolves to a hashed password in the format "salt:hash".
 */
export const hashSaltPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  // Convert the provided salt (hex) into a Uint8Array.
  const saltBytes = hexToBytes(salt);
  // Compute the derived key (hash) using scrypt.
  const hashBytes = await scryptAsync(password, saltBytes, scryptOptions);
  const hashHex = bytesToHex(hashBytes);
  // Return the salt and hash separated by a colon.
  return `${salt}:${hashHex}`;
};

/**
 * Verify a password against a stored hashed password.
 * @param hashedPassword - The stored hashed password in "salt:hash" format.
 * @param plainPassword - The plain text password to verify.
 * @returns A promise that resolves to true if the password is valid, false otherwise.
 */
export const verifySaltPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  // Split the stored value into its salt and hash parts.
  const parts = hashedPassword.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid hashed password format");
  }
  const [salt, storedHash] = parts;
  // Convert the salt back into bytes.
  const saltBytes = hexToBytes(salt);
  // Compute the scrypt hash for the provided plain password using the same salt.
  const hashBytes = await scryptAsync(plainPassword, saltBytes, scryptOptions);
  const hashHex = bytesToHex(hashBytes);
  return hashHex === storedHash;
};
