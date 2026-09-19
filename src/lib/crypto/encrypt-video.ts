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
export const DECOY_HONEYPOT_URL = "https://youtu.be/dQw4w9WgXcQ";

export function getDecoyForUrl(urlOrType: string): string {
  if (!urlOrType) return DECOY_HONEYPOT_URL;
  const lower = urlOrType.toLowerCase();
  if (lower.includes("streamtape")) {
    return "https://streamtape.com/e/dQw4w9WgXcQ_decoy/";
  }
  if (lower.includes("avcaption")) {
    return "https://avcaption.com/watch/decoy_68f871a4d6c82a2f841fab1e30da";
  }
  return DECOY_HONEYPOT_URL;
}

function extractYouTubeIdInternal(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const m1 = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (m1) return m1[1];
  return null;
}

function xorMask(str: string, saltHex: string): string {
  const sBuf = Buffer.from(saltHex, "hex");
  const bytes = Buffer.from(str, "utf8");
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] ^= sBuf[i % sBuf.length];
  }
  return bytes.toString("base64url");
}

function xorUnmask(b64url: string, saltHex: string): string {
  const bytes = Buffer.from(b64url, "base64url");
  const sBuf = Buffer.from(saltHex, "hex");
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] ^= sBuf[i % sBuf.length];
  }
  return bytes.toString("utf8");
}

/**
 * Encrypt a video URL or ID using AES-256-GCM.
 * Embeds:
 * 1. 3-way fragmented video ID/URL chunks with unique cryptographic salts
 * 2. Platform-specific honeypot decoy link (for scrapers/inspectors)
 * 3. Timestamp expiration
 * 4. AES-256-GCM authenticated ciphertext
 */
export function encryptVideoUrl(plaintext: string, expiresInMs: number = 10 * 60 * 1000): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  
  // Embed timestamp for expiry
  const expiresAt = Date.now() + expiresInMs;
  const ytId = extractYouTubeIdInternal(plaintext);
  const serverDecoy = getDecoyForUrl(plaintext);

  const payloadObj: any = {
    v: plaintext,
    exp: expiresAt,
    decoy: serverDecoy,
  };

  // 3-Way Fragmentation for YouTube IDs & Universal URLs (Server 2 & 3)
  if (ytId && ytId.length === 11) {
    // 1. YouTube 11-char ID
    const p1 = ytId.slice(0, 4);
    const p2 = ytId.slice(4, 8);
    const p3 = ytId.slice(8);

    const s1 = randomBytes(4).toString("hex");
    const s2 = randomBytes(4).toString("hex");
    const s3 = randomBytes(4).toString("hex");

    payloadObj.f1 = xorMask(p1, s1);
    payloadObj.f2 = xorMask(p2, s2);
    payloadObj.f3 = xorMask(p3, s3);
    payloadObj.s = [s1, s2, s3];
    payloadObj.yt = true;
  } else if (plaintext && plaintext.length > 5) {
    // 2. Universal 3-Way Fragmentation for Server 2 & 3 (Streamtape, AVCaption, Embeds)
    const len = plaintext.length;
    const split1 = Math.floor(len / 3);
    const split2 = Math.floor((2 * len) / 3);
    const p1 = plaintext.slice(0, split1);
    const p2 = plaintext.slice(split1, split2);
    const p3 = plaintext.slice(split2);

    const s1 = randomBytes(4).toString("hex");
    const s2 = randomBytes(4).toString("hex");
    const s3 = randomBytes(4).toString("hex");

    payloadObj.f1 = xorMask(p1, s1);
    payloadObj.f2 = xorMask(p2, s2);
    payloadObj.f3 = xorMask(p3, s3);
    payloadObj.s = [s1, s2, s3];
    payloadObj.yt = false;
  }

  const payload = JSON.stringify(payloadObj);
  
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
 * Validates auth tag integrity, reassembles 3-way fragments, and checks expiry timestamp.
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
    
    // If fragmented 3-way YouTube ID exists, reassemble in memory
    if (payload.f1 && payload.f2 && payload.f3 && Array.isArray(payload.s) && payload.s.length === 3) {
      const p1 = xorUnmask(payload.f1, payload.s[0]);
      const p2 = xorUnmask(payload.f2, payload.s[1]);
      const p3 = xorUnmask(payload.f3, payload.s[2]);
      return `${p1}${p2}${p3}`;
    }

    return payload.v || null;
  } catch {
    return null; // Tampered, invalid, or corrupted
  }
}

/**
 * Encrypt an entire servers array — encrypts each server's URL individually.
 * The server name/type remain visible (needed for UI), but URLs are encrypted and honeypot decoys are embedded.
 */
export function encryptServersArray(
  servers: { name: string; type: string; url: string }[]
): { name: string; type: string; url: string; decoyUrl: string }[] {
  return servers.map((srv) => ({
    name: srv.name,
    type: srv.type,
    url: encryptVideoUrl(srv.url),
    decoyUrl: getDecoyForUrl(srv.url || srv.type),
  }));
}
