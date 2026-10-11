import { describe, it, expect } from "vitest";
import {
  generateTotpSecret,
  generateTotpToken,
  verifyTotpToken,
  generateRecoveryCodes,
  verifyRecoveryCode,
  encodeBase32,
  decodeBase32,
} from "@/server/auth/totp";

describe("RFC 6238 TOTP Multi-Factor Authentication Engine", () => {
  describe("Base32 Encoding & Decoding", () => {
    it("should round-trip binary data through Base32 encoding and decoding", () => {
      const buffer = Buffer.from("PLAYQ Solutions Security Test 2026");
      const base32 = encodeBase32(buffer);
      const decoded = decodeBase32(base32);

      expect(decoded.toString()).toBe("PLAYQ Solutions Security Test 2026");
    });
  });

  describe("TOTP Token Generation & Verification", () => {
    it("should generate a valid 6-digit TOTP secret and token", () => {
      const { secret, otpauthUrl } = generateTotpSecret();

      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThanOrEqual(16);
      expect(otpauthUrl.startsWith("otpauth://totp/")).toBe(true);

      const token = generateTotpToken(secret);
      expect(token).toMatch(/^\d{6}$/);

      const result = verifyTotpToken(secret, token);
      expect(result.valid).toBe(true);
    });

    it("should reject an invalid or malformed token", () => {
      const { secret } = generateTotpSecret();

      expect(verifyTotpToken(secret, "000000").valid).toBe(false);
      expect(verifyTotpToken(secret, "abc").valid).toBe(false);
      expect(verifyTotpToken(secret, "12345").valid).toBe(false);
      expect(verifyTotpToken(secret, "1234567").valid).toBe(false);
    });

    it("should accept tokens within clock drift window (±1 step / 30 seconds)", () => {
      const { secret } = generateTotpSecret();
      const currentStep = Math.floor(Date.now() / 1000 / 30);

      // Previous step (drift -1)
      const prevToken = generateTotpToken(secret, currentStep - 1);
      expect(verifyTotpToken(secret, prevToken, 1).valid).toBe(true);

      // Next step (drift +1)
      const nextToken = generateTotpToken(secret, currentStep + 1);
      expect(verifyTotpToken(secret, nextToken, 1).valid).toBe(true);

      // Far future step (drift +5) -> rejected
      const farToken = generateTotpToken(secret, currentStep + 5);
      expect(verifyTotpToken(secret, farToken, 1).valid).toBe(false);
    });
  });

  describe("Emergency Recovery Codes", () => {
    it("should generate 8 formatted recovery codes with corresponding SHA-256 hashes", () => {
      const { plaintextCodes, hashedCodes } = generateRecoveryCodes(8);

      expect(plaintextCodes.length).toBe(8);
      expect(hashedCodes.length).toBe(8);

      plaintextCodes.forEach((code) => {
        expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      });
    });

    it("should successfully verify and match a plaintext recovery code against hashes", () => {
      const { plaintextCodes, hashedCodes } = generateRecoveryCodes(8);
      const targetIndex = 3;
      const targetCode = plaintextCodes[targetIndex];

      const foundIndex = verifyRecoveryCode(targetCode, hashedCodes);
      expect(foundIndex).toBe(targetIndex);

      // Case-insensitivity and hyphen flexibility
      const withoutHyphen = targetCode.replace("-", "").toLowerCase();
      expect(verifyRecoveryCode(withoutHyphen, hashedCodes)).toBe(targetIndex);
    });

    it("should reject an invalid recovery code", () => {
      const { hashedCodes } = generateRecoveryCodes(8);
      const invalidCode = "XXXX-9999";

      const foundIndex = verifyRecoveryCode(invalidCode, hashedCodes);
      expect(foundIndex).toBe(-1);
    });
  });
});
