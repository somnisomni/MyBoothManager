import { createHash, randomBytes } from "crypto";

/**
 * Generates a random digest file name using random 32 bytes hashed with SHAKE256 (32 bytes output length).
 *
 * while SHAKE256 output length is 32 bytes, base64url encoded text with a length of 43 characters will be returned.
 *
 * @returns `fileName` is the bas64url-encoded generated file name, `withExt` is a function that appends an extension to the file name.
 */
export function generateRandomDigestFileName() {
  const digest = `${createHash("shake256", { outputLength: 32 }).update(randomBytes(32)).digest("base64url")}`;

  return {
    fileName: digest,
    withExt(ext: string) {
      return `${this.fileName}.${ext}`;
    },
  };
}
