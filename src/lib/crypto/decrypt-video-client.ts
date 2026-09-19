/**
 * Client-side AES-256-GCM decryption for encrypted video URLs.
 * 
 * Uses the Web Crypto API (SubtleCrypto) — works in all modern browsers.
 * Decrypts video URLs that were encrypted server-side.
 */

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Decode a base64url string to Uint8Array.
 * Handles the URL-safe base64 variant (no padding, -_ instead of +/).
 */
function base64urlToBytes(base64url: string): Uint8Array {
  // Convert base64url to standard base64
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decode a hex string to Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Decrypt an encrypted video URL using the Web Crypto API.
 * 
 * @param ciphertext - The base64url-encoded encrypted string from the server
 * @param keyHex - The 64-character hex encryption key
 * @returns The decrypted video URL, or null if decryption fails or token expired
 */
export async function decryptVideoUrlClient(
  ciphertext: string,
  keyHex: string
): Promise<string | null> {
  try {
    const packed = base64urlToBytes(ciphertext);

    if (packed.length < IV_LENGTH + TAG_LENGTH + 1) {
      return null;
    }

    const iv = packed.slice(0, IV_LENGTH);
    const authTag = packed.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = packed.slice(IV_LENGTH + TAG_LENGTH);

    // In Web Crypto, GCM expects ciphertext + authTag concatenated
    const ciphertextWithTag = new Uint8Array(encrypted.length + authTag.length);
    ciphertextWithTag.set(encrypted);
    ciphertextWithTag.set(authTag, encrypted.length);

    // Import key
    const keyBytes = hexToBytes(keyHex);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes as unknown as BufferSource,
      { name: ALGORITHM },
      false,
      ["decrypt"]
    );

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv as unknown as BufferSource, tagLength: TAG_LENGTH * 8 },
      cryptoKey,
      ciphertextWithTag as unknown as BufferSource
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    const payload = JSON.parse(decryptedText);

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
 * Decrypt an array of encrypted servers (each server's URL is encrypted).
 */
export async function decryptServersArray(
  servers: { name: string; type: string; url: string }[],
  keyHex: string
): Promise<{ name: string; type: string; url: string }[]> {
  const results = await Promise.all(
    servers.map(async (srv) => {
      const decryptedUrl = await decryptVideoUrlClient(srv.url, keyHex);
      return {
        name: srv.name,
        type: srv.type,
        url: decryptedUrl || "",
      };
    })
  );
  return results;
}
