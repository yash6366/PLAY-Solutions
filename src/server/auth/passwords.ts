import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password with salted bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Constant-time compare a plain text password against a hashed password.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
