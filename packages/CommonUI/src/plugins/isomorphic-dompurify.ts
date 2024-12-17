// reference: https://github.com/kkomelin/isomorphic-dompurify/blob/master/src/index.js
// Rewritten in ESM because of `require()` statements, which causes several errors

import DOMPurify, { type WindowLike } from "dompurify";

export async function resolveDOMPurify(): Promise<{ dompurify: typeof DOMPurify, window: WindowLike }> {
  const isClientSide = typeof window !== "undefined" && !!window;
  const windowLike: WindowLike = isClientSide ? window : new (await import("jsdom")).JSDOM("<!DOCTYPE html>").window;

  return {
    dompurify: DOMPurify(windowLike),
    window: windowLike,
  };
}
