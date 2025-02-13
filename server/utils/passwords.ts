import { scryptAsync } from "@noble/hashes/scrypt";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";

/**
 * Scrypt options optimized for serverless (Cloudflare Workers).
 * Work factor N is reduced to 2^12 (4096) to lower CPU consumption.
 * Adjust these values as needed to balance security and performance.
 */
const scryptOptions = {
  N: 2 ** 12, // Lowered work factor for reduced CPU usage in Workers.
  r: 8,
  p: 1,
  dkLen: 32,
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
 * Hash a password using scrypt with a provided salt.
 *
 * This function derives a key using the given plain password and salt,
 * and returns a string formatted as "salt:hash" (both in hex).
 *
 * @param password - The plain text password.
 * @param salt - The salt to use (hex-encoded string).
 * @returns A promise that resolves to the salted hash string.
 */
export const hashSaltPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  const saltBytes = hexToBytes(salt);
  const hashBytes = await scryptAsync(password, saltBytes, scryptOptions);
  const hashHex = bytesToHex(hashBytes);
  return `${salt}:${hashHex}`;
};

/**
 * Verify a plain text password against a stored salted hash.
 *
 * The stored hashed password is expected to be in the format "salt:hash".
 *
 * @param hashedPassword - The stored salted hash.
 * @param plainPassword - The plain text password to verify.
 * @param salt - The stored salt (hex-encoded string) used when hashing the original password.
 * @returns A promise that resolves to true if the password is valid, false otherwise.
 */
export const verifySaltPassword = async (
  hashedPassword: string,
  plainPassword: string,
  salt: string
): Promise<boolean> => {
  // Recompute the salted hash using the provided plain password and salt.
  const computed = await hashSaltPassword(plainPassword, salt);
  // Compare the recomputed salted hash with the stored value.
  return computed === hashedPassword;
};
