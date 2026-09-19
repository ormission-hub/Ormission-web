/**
 * Server-side AES-256-GCM encryption for video URLs.
 * 
 * Encrypts YouTube video IDs/URLs before sending to client.
 * Each encryption produces a unique IV, making every ciphertext unique
 * even for the same plaintext — preventing replay/pattern analysis.
 * 
 * IMPORTANT: This module uses Node.js `crypto` — server-side only.
 */

import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;       // 128-bit IV
const TAG_LENGTH = 16;      // 128-bit auth tag
const KEY_LENGTH = 32;      // 256-bit key

/**
 * Get the encryption key as a 64-hex string.
 */
export function getEncryptionKeyHex(): string {
  const keyHex = process.env.VIDEO_ENCRYPTION_SECRET;
  if (keyHex && keyHex.length === 64) {
    return keyHex;
  }
  // Deterministic fallback derived from existing secrets
  const fallbackSeed =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "ormission-secure-video-encryption-fallback-seed-2026";
  return createHash("sha256").update(fallbackSeed).digest("hex");
}

/**
 * Get the encryption key as a Buffer.
 */
export function getEncryptionKey(): Buffer {
  return Buffer.from(getEncryptionKeyHex(), "hex");
}

/**
 * Encrypt a video URL or ID using AES-256-GCM.
 * Returns a base64url-encoded string containing: IV + AuthTag + Ciphertext
 * 
 * Optionally embeds a timestamp for expiry checking.
 */
export function encryptVideoUrl(plaintext: string, expiresInMs: number = 10 * 60 * 1000): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  
  // Embed timestamp for expiry
  const expiresAt = Date.now() + expiresInMs;
  const payload = JSON.stringify({ v: plaintext, exp: expiresAt });
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack: IV (16 bytes) + AuthTag (16 bytes) + Ciphertext
  const packed = Buffer.concat([iv, authTag, encrypted]);
  
  // Use base64url encoding (URL-safe, no padding issues)
  return packed.toString("base64url");
}

/**
 * Decrypt a video URL/ID encrypted by encryptVideoUrl().
 * Validates auth tag integrity and checks expiry timestamp.
 * 
 * Returns null if decryption fails, data is tampered, or token expired.
 */
export function decryptVideoUrl(ciphertext: string): string | null {
  try {
    const key = getEncryptionKey();
    const packed = Buffer.from(ciphertext, "base64url");
    
    if (packed.length < IV_LENGTH + TAG_LENGTH + 1) {
      return null;
    }

    const iv = packed.subarray(0, IV_LENGTH);
    const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = packed.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    const payload = JSON.parse(decrypted.toString("utf8"));
    
    // Check expiry
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }
    
    return payload.v || null;
  } catch {
    return null; // Tampered, invalid, or corrupted
  }
}

/**
 * Encrypt an entire servers array — encrypts each server's URL individually.
 * The server name/type remain visible (needed for UI), but URLs are encrypted.
 */
export function encryptServersArray(
  servers: { name: string; type: string; url: string }[]
): { name: string; type: string; url: string }[] {
  return servers.map((srv) => ({
    name: srv.name,
    type: srv.type,
    url: encryptVideoUrl(srv.url),
  }));
}
