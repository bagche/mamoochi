import { Hash } from "@adonisjs/hash";
import { Scrypt } from "@adonisjs/hash/drivers/scrypt";
import type { ScryptConfig } from "@adonisjs/hash/types";
import { randomBytes } from "crypto";

let _hash: Hash;

const getHash = (): Hash => {
  if (!_hash) {
    const options = useRuntimeConfig().hash?.scrypt as ScryptConfig;
    const scrypt = new Scrypt(options);
    _hash = new Hash(scrypt);
  }
  return _hash;
};

/**
 * Generate a random salt
 * @returns A random salt string
 */
export const generateSalt = (): string => randomBytes(16).toString("hex");

/**
 * Hash a password with a provided salt
 * @param password - The plain text password
 * @param salt - The salt to use for hashing
 * @returns A hashed password
 */
export const hashSaltPassword = async (
  password: string,
  salt: string
): Promise<string> => getHash().make(`${salt}:${password}`);

/**
 * Verify a password against a hashed password and its salt
 * @param hashedPassword - The stored hashed password
 * @param plainPassword - The plain text password to verify
 * @param salt - The stored salt
 * @returns `true` if the password matches, `false` otherwise
 */
export const verifySaltPassword = async (
  hashedPassword: string,
  plainPassword: string,
  salt: string
): Promise<boolean> =>
  getHash().verify(hashedPassword, `${salt}:${plainPassword}`);
