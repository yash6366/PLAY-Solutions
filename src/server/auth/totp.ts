import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const TOTP_DIGITS = 6;

/**
 * Encode binary buffer into standard RFC 4648 Base32 string.
 */
export function encodeBase32(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decode standard RFC 4648 Base32 string into Buffer.
 */
export function decodeBase32(str: string): Buffer {
  const cleanStr = str.toUpperCase().replace(/[\s-]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generate a cryptographically secure 20-byte (160-bit) Base32 secret for TOTP.
 */
export function generateTotpSecret(): { secret: string; otpauthUrl: string } {
  const randomBytes = crypto.randomBytes(20);
  const secret = encodeBase32(randomBytes);
  const issuer = encodeURIComponent("PLAYQ Solutions");
  const account = encodeURIComponent("admin-portal");
  const otpauthUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

  return { secret, otpauthUrl };
}

/**
 * Generate a 6-digit TOTP code for a given secret at a given counter step.
 */
export function generateTotpToken(secret: string, counter?: number): string {
  const timeStep = counter !== undefined ? counter : Math.floor(Date.now() / 1000 / STEP_SECONDS);
  const key = decodeBase32(secret);

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(timeStep));

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const token = (binary % 10 ** TOTP_DIGITS).toString().padStart(TOTP_DIGITS, "0");
  return token;
}

/**
 * Verify a 6-digit TOTP token against secret within a clock-drift window (default ±1 step).
 * Uses constant-time equality check to prevent timing attacks.
 */
export function verifyTotpToken(
  secret: string,
  token: string,
  window = 1
): { valid: boolean; verifiedStep?: number } {
  const cleanToken = token.trim();
  if (cleanToken.length !== 6 || !/^\d+$/.test(cleanToken)) {
    return { valid: false };
  }

  const currentStep = Math.floor(Date.now() / 1000 / STEP_SECONDS);

  for (let offset = -window; offset <= window; offset++) {
    const step = currentStep + offset;
    const expected = generateTotpToken(secret, step);

    if (
      cleanToken.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))
    ) {
      return { valid: true, verifiedStep: step };
    }
  }

  return { valid: false };
}

/**
 * Generate a set of emergency one-time recovery codes.
 * Returns plaintext codes for user storage and SHA-256 hashes for database persistence.
 */
export function generateRecoveryCodes(count = 8): {
  plaintextCodes: string[];
  hashedCodes: string[];
} {
  const plaintextCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plaintextCodes.push(formatted);
    hashedCodes.push(hashRecoveryCode(formatted));
  }

  return { plaintextCodes, hashedCodes };
}

/**
 * Hash a recovery code for secure database storage.
 */
export function hashRecoveryCode(code: string): string {
  const normalized = code.replace(/[-\s]/g, "").toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Verify a recovery code against stored hashes.
 * Returns index of used code or -1 if invalid.
 */
export function verifyRecoveryCode(candidate: string, storedHashes: string[]): number {
  const candidateHash = hashRecoveryCode(candidate);
  const candidateBuffer = Buffer.from(candidateHash);

  for (let i = 0; i < storedHashes.length; i++) {
    const storedBuffer = Buffer.from(storedHashes[i]);
    if (
      storedBuffer.length === candidateBuffer.length &&
      crypto.timingSafeEqual(storedBuffer, candidateBuffer)
    ) {
      return i;
    }
  }

  return -1;
}
