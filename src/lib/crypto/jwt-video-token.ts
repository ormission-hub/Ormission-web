/**
 * Cryptographic RFC 7519 JSON Web Token (JWT) helper for Video Playback Security.
 * 
 * Provides:
 * - signVideoSessionToken: Signs a short-lived video session JWT with HMAC-SHA256.
 * - verifyVideoSessionToken: Cryptographically verifies signature, expiration, and integrity
 *   using constant-time comparison to prevent timing attacks.
 * 
 * Runs in Node.js server environment only.
 */

import crypto from "crypto";

export interface VideoSessionJwtPayload {
  sub: string;                // User UUID
  email?: string;             // User email
  courseId: string | number;  // Course ID
  courseSlug?: string;        // Course slug
  lessonId: string | number;  // Lesson ID
  iat: number;                // Issued at timestamp (seconds)
  exp: number;                // Expiration timestamp (seconds)
}

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

function getJwtSecret(): string {
  return (
    process.env.VIDEO_ENCRYPTION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "ormission-secure-video-jwt-secret-seed-2026"
  );
}

/**
 * Sign a video playback session JWT (valid for 2 hours = 7200 seconds by default)
 */
export function signVideoSessionToken(
  payload: Omit<VideoSessionJwtPayload, "iat" | "exp">,
  expiresInSeconds: number = 7200
): string {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const fullPayload: VideoSessionJwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);

  return `${signingInput}.${encodedSignature}`;
}

/**
 * Cryptographically verify a video playback session JWT.
 * Returns the verified payload if authentic and unexpired; returns null otherwise.
 */
export function verifyVideoSessionToken(token: string): VideoSessionJwtPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const secret = getJwtSecret();

  // Re-sign with server secret to verify authenticity
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest();
  const expectedEncodedSignature = base64UrlEncode(expectedSignature);

  // Constant-time comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(encodedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedEncodedSignature, "utf8");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  // Parse header
  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return null;
    }
  } catch {
    return null;
  }

  // Parse payload and check expiration
  try {
    const payload: VideoSessionJwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp !== "number" || payload.exp < now) {
      return null; // Expired
    }

    if (!payload.sub) {
      return null; // Missing subject
    }

    return payload;
  } catch {
    return null;
  }
}
